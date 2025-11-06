import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertService } from '../services/alert.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const alert = inject(AlertService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unknown error occurred';
      console.log("Han bhai yhi hu...",error.error);
      if(error.error.message) message = error.error.message;

      if (error.status === 0) {
        message = 'Network error. Please check your connection.';
      } else if (error.status === 401) {
        message = 'Session expired. Please login again.';
        router.navigate(['/login']);
      } else if (error.status === 403) {
        message = 'You don’t have permission to do this.';
      } else if (error.status === 404) {
        message = 'Resource not found.';
      } else if (error.status >= 500) {
        message = 'Server error. Please try again later.';
      }

      // snackBar.open(message, 'Close', {
      //   duration: 3000,          // auto close after 3s
      //   horizontalPosition: 'right',
      //   verticalPosition: 'top',
      //   panelClass: ['bg-red-600', 'text-white'] // if using Tailwind or custom styling
      // });

      alert.error(message);

      return throwError(() => error);
    })
  );
};
