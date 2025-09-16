import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardResolver implements Resolve<any> {
  resolve(): Observable<any> {
    // Simulate API call – replace with HttpClient request
    return of({
      user: { id: 1, name: 'Abhishek' },
      notifications: 5,
      chats: ['Hello!', 'How are you?', 'Welcome to ChatApp']
    });
  }
}
