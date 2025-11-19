import { Injectable, importProvidersFrom  } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, firstValueFrom } from 'rxjs';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  // public baseUrl = "https://mechat-be.vercel.app";
  public baseUrl = "https://mechat-be.onrender.com";
  // public baseUrl = "http://localhost:3000";

  constructor(private http: HttpClient, private alertService: AlertService){}

  public currentUser = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')!) : {};

  // GET request
  async get(endpoint: string, headers?: HttpHeaders): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.baseUrl}/${endpoint}`, { headers }));
  }

  // POST request
  async post(endpoint: string, data: any, headers?: HttpHeaders): Promise<any> {
    return await firstValueFrom(this.http.post(`${this.baseUrl}/${endpoint}`, data, { headers }));
  }

  formatRelativeTime(dateValue: string | Date): string {
    if (!dateValue) return '';

    const date = new Date(dateValue);
    const now = new Date();

    // Convert both to IST
    const toIST = (d: Date) =>
      new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

    const istDate = toIST(date);
    const istNow = toIST(now);

    const diffMs = istNow.getTime() - istDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Today → show time
      return istDate.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      // Within the week → weekday
      return istDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        timeZone: 'Asia/Kolkata'
      });
    } else {
      // Older → date only
      return istDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        timeZone: 'Asia/Kolkata'
      });
    }
  }

  async getContacts(){
    try {
      const currUserDetails = await this.get('user/current-user');
      let contactArr = currUserDetails.data.contacts.map((c: { contactId: any; }) => c.contactId);
      contactArr = contactArr.map((item: { _id: any; username: any; }) => ({
        id: item._id,
        name: item.username
      }));
      console.log("getContacts>>>>",contactArr);
      return contactArr;
    } catch (error) {
      console.error("Error getting contacts:", error);
    }
  }
}
