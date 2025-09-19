import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // const router = inject(Router);

  // const isLoggedIn = !!localStorage.getItem('token'); // Example check
  // // ******* change it with user object stored in localStorage ******//
  // if (isLoggedIn) {
  //   console.log("Token Found");
  //   return true;
  // } else {
  //   console.log("Token Not Found");
  //   router.navigate(['/auth/login']);
  //   return false;
  // }
    return true;
};
