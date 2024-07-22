import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null | undefined = '';
  private tokenTimer: NodeJS.Timer | undefined;
  private isAuthenticated: boolean = false;
  private userId: string | null = null;
  private authStatusListener = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  getToken(): string | null | undefined {
    return this.token;
  }

  getAuthStatus(): boolean {
    return this.isAuthenticated;
  }

  getUserId(): string | null {
    return this.userId;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string): void {
    const authData: AuthData = { email, password };
    this.http
      .post('http://localhost:3000/api/auth/signup', authData)
      .subscribe((res) => {
        console.log(res);
      });
  }

  login(email: string, password: string): void {
    const authData: AuthData = { email, password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        'http://localhost:3000/api/auth/login',
        authData
      )
      .subscribe((res) => {
        const token = res.token;
        this.token = token;
        if (token) {
          const expiresInDuration = res.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = res.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/admin/createProduct']);
        }
      });
  }

  logout(): void {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer as NodeJS.Timeout);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/login']);
  }

  autoAuth(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (typeof window === 'undefined') {
        resolve();
        return;
      }
      const authInfo = this.getAuthData();
      const now = new Date();
      if (!authInfo?.expirationDate) {
        resolve();
        return;
      }
      const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.token = authInfo.token;
        this.isAuthenticated = true;
        this.userId = authInfo.userId;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
        console.log('User authenticated automatically');
      } else {
        console.log('Token expired');
      }
      resolve();
    });
  }

  private setAuthTimer(duration: number): void {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000) as NodeJS.Timeout;
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string | null
  ): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('expiration', expirationDate.toISOString());
      localStorage.setItem('userId', userId!);
    }
  }

  private clearAuthData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('expiration');
      localStorage.removeItem('userId');
    }
  }

  private getAuthData():
    | { token: string; expirationDate: Date; userId: string | null }
    | undefined {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return undefined;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
    };
  }
}
