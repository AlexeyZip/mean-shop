import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ErrorInterceptor } from './error-interceptor';
import { AuthInterceptor } from './auth-interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
