import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate: CanActivateFn = () => {
    const isAuth = this.authService.getAuthStatus();
    if (!isAuth) {
      this.router.navigate(['login']);
    }
    return isAuth;
  };
}
