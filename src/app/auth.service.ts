import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username: String, password: String) {
    return this.http.post<any>(environment.backendUrl + environment.apiPath + 'login', { username, password })
      .pipe(
        tap(res => this.setSession(res)),
        tap(_ => console.log('Successfully logged in')),
        shareReplay(1)
      );
  }
  private setSession(authResult) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem("username", authResult.username);
  }
  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("username");
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }
  public getLoggedInUser() {
    if (this.isLoggedIn()) {
      return localStorage.getItem("username");
    }
    return null;
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
