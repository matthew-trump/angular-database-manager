import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { ConfigSchemaService } from './config-schema.service';

import * as moment from "moment";

const TARGETS: any = environment.targets;
const DEFAULT_TARGET: any = environment.defaultTarget;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentTarget: string = DEFAULT_TARGET;
  targetNames: string[] = Object.keys(TARGETS);
  constructor(private http: HttpClient, private configSchemaService: ConfigSchemaService) {

  }

  login(target: string, username: String, password: String) {
    const url: string = environment.targets[target].url;
    const apiPath: string = environment.targets[target].apiPath;
    console.log(target, username, password, url, apiPath);
    return this.http.post<any>(url + apiPath + 'login', { username, password })
      .pipe(
        tap(res => this.setSession(res)),
        tap(_ => {
          this.currentTarget = target;
          this.configSchemaService.loadSchema(target).then((schema: any) => {
            console.log("SCHEMA loaded for target", target, schema);
          })
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
  getCurrentTarget() {
    return this.currentTarget;
  }
  getTargetNames() {
    return this.targetNames;
  }
}
