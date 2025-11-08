import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })

export class AlertService {

  success(message: string, title: string = 'Success') {
    Swal.fire({
      icon: 'success',
      // title,
      text: message,
      showConfirmButton: false,
      timer: 2000,
      toast: true,
      position: 'top-end',
      background: '#e7f9ee',
      color: '#1a4d2e'
    });
  }

  error(message: string, title: string = 'Error') {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
      showConfirmButton: false,
      timer: 3000,
      toast: true,
      position: 'top-end',
      background: '#fde8e8',
      color: '#7a0000'
    });
  }

  warning(message: string, title: string = 'Warning') {
    Swal.fire({
      icon: 'warning',
      // title,
      text: message,
      showConfirmButton: false,
      timer: 2500,
      toast: true,
      position: 'top-end'
    });
  }

  info(message: string, title: string = 'Info') {
    Swal.fire({
      icon: 'info',
      // title,
      text: message,
      showConfirmButton: false,
      timer: 2500,
      toast: true,
      position: 'top-end'
    });
  }
}
