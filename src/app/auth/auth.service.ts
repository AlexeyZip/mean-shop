import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null | undefined = '';
  private tokenTimer: NodeJS.Timer | undefined;
  private isAuthenticated: boolean = false;
  private authStatusListener = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  getToken(): string | null | undefined {
    return this.token;
  }

  getAuthStatus(): boolean {
    return this.isAuthenticated;
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
      .post<{ token: string; expiresIn: number }>(
        'http://localhost:3000/api/auth/login',
        authData
      )
      .subscribe({
        next: (res) => {
          const token = res.token;
          this.token = token;
          if (token) {
            const expiresInDuration = res.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(token, expirationDate);
            this.router.navigate(['/admin/createProduct']);
          }
        },
        error: (err) => {
          console.error('Login error:', err);
        },
      });
  }

  logout(): void {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer as NodeJS.Timeout);
    this.clearAuthData();
    this.router.navigate(['login']);
  }

  autoAuth(): void {
    const authInfo = this.getAuthData();
    const now = new Date();
    if (!authInfo?.expirationDate) {
      return;
    }
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      console.log('true');

      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number): void {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000) as NodeJS.Timeout;
  }

  private saveAuthData(token: string, expirationDate: Date): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData(): { token: string; expirationDate: Date } | undefined {
    if (typeof window === 'undefined' || !window.localStorage) {
      return undefined;
    }
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return undefined;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
    };
  }
}