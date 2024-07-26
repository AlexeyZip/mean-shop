import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    await this.authService.autoAuth();
    const isAuth = this.authService.getAuthStatus();
    console.log(isAuth);
    if (!isAuth) {
      this.router.navigate(['/login']);
    }

    return isAuth;
  }
}
