import { Injectable } from '@angular/core';
import { shareReplay, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { ConfigSchemaService } from './config-schema.service';

import * as moment from "moment";
import { BackendApiService } from './backend-api.service';

const TARGETS: any = environment.targets;


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  targetNames: string[] = Object.keys(TARGETS);
  constructor(
    private backendApiService: BackendApiService,
    private configSchemaService: ConfigSchemaService) {

  }

  login(target: string, username: string, password: string) {
    return this.backendApiService.login(target, username, password)
      .pipe(
        tap(res => this.setSession(res)),
        tap(_ => {
          //this.currentTarget = target;
          localStorage.setItem('target', target);
          this.configSchemaService.loadSchema(target);
        }),
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
  getTargetNames() {
    return this.targetNames;
  }
}
