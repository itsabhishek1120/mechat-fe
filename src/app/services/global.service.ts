import { Injectable, importProvidersFrom  } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private baseUrl = "http://localhost:3000";

  constructor(private http: HttpClient){}

  // GET request
  async get(endpoint: string, headers?: HttpHeaders): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.baseUrl}/${endpoint}`, { headers }));
  }

  // POST request
  async post(endpoint: string, data: any, headers?: HttpHeaders): Promise<any> {
    return await firstValueFrom(this.http.post(`${this.baseUrl}/${endpoint}`, data, { headers }));
  }

}
