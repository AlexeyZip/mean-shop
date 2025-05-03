import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { catchError, Observable, throwError } from 'rxjs';
import { ErrorComponent } from '../error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  readonly dialog = inject(MatDialog);
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occured!';
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorComponent, {
          data: { message: errorMessage },
          height: '200px',
          width: '300px',
        });
        return throwError(() => new Error(error.message));
      })
    );
  }
}
