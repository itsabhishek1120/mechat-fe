import { Injectable } from '@angular/core';
import { BehaviorSubject, timer, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { AlertService } from "../services/alert.service";
import { SocketService } from "../services/socket.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private tokenTimer?: Subscription;

  constructor(private router: Router, private alertService: AlertService, private socketService: SocketService) {
    this.autoLogin();
  }

  /** Login */
  login(userDetail: any, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

    const user: User = {
      id: userDetail.id,
      username: userDetail.username,
      token: token,
      tokenExpirationDate: expirationDate
    };
    this.currentUserSubject.next(user);
    localStorage.setItem('userData', JSON.stringify(user));

    //Connect to socket for the user
    this.socketService.connect(user);

    this.autoLogout(expiresIn * 1000);
  }

  /** Logout */
  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('userData');

    if (this.tokenTimer) this.tokenTimer.unsubscribe();
    this.socketService.disconnect();
    this.router.navigate(['/login']);
    this.alertService.info("Logged out");
  }

  /** Auto-logout when token expires */
  autoLogout(expirationDuration: number) {
    if (this.tokenTimer) this.tokenTimer.unsubscribe();

    this.tokenTimer = timer(expirationDuration).subscribe(() => {
      this.logout();
    });
  }

  /** Auto-login (restore from localStorage if not expired) */
  autoLogin() {
    const storedUser = localStorage.getItem('userData');
    if (!storedUser) return;

    const user: User = JSON.parse(storedUser);
    const loadedUser: User = {
      ...user,
      tokenExpirationDate: new Date(user.tokenExpirationDate)
    };

    if (loadedUser.tokenExpirationDate > new Date()) {
      this.currentUserSubject.next(loadedUser);

      const remainingTime =
        loadedUser.tokenExpirationDate.getTime() - new Date().getTime();
      this.autoLogout(remainingTime);
    } else {
      this.logout();
    }
  }

  /** Get current user snapshot (not observable) */
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}
