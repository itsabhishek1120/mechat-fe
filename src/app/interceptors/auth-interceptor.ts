import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storedUser = localStorage.getItem('userData');
  const user = storedUser ? JSON.parse(storedUser) : null; 
  if (user?.token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
