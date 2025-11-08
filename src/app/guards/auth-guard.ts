import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from "../services/auth.service";
import { AlertService } from "../services/alert.service";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const alertService = inject(AlertService);

  const storedUser = localStorage.getItem('userData');
  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
    console.log("user::",user);
    
  } catch (err) {
    console.error('Invalid user object in localStorage');
  }

  // const token = user.token;
  if (user && user.token) {
    console.log('✅ AuthGuard: User found and token valid');
    return true;
  } else {
    console.warn('⛔ AuthGuard: No valid session, redirecting to login');
    router.navigate(['/auth/login']);
    alertService.warning("Login to proceed");
    return false;
  }
};
