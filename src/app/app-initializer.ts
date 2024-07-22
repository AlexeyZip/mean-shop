import { AuthService } from './auth/auth.service';

export function appInitializer(authService: AuthService) {
  return () => authService.autoAuth();
}
