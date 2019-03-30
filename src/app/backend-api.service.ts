import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BackendApiService {
    constructor(public authService: AuthService, public http: HttpClient) { }

    /** Testing methods */
    ping() {
        const target: string = this.authService.getCurrentTarget();
        const url: string = environment.targets[target].url;
        const apiPath: string = environment.targets[target].apiPath;
        console.log("ping");
        return this.http.get(url + apiPath + 'ping');
    }
    databasePing(value: string) {
        const target: string = this.authService.getCurrentTarget();
        const url: string = environment.targets[target].url;
        const apiPath: string = environment.targets[target].apiPath;
        console.log("database ping", value);
        return this.http.post(url + apiPath + 'database/ping',
            { key: value });
    }
    databasePings() {
        const target: string = this.authService.getCurrentTarget();
        const url: string = environment.targets[target].url;
        const apiPath: string = environment.targets[target].apiPath;
        return this.http.get(url + apiPath + 'database/ping');
    }
    protected() {
        const target: string = this.authService.getCurrentTarget();
        const url: string = environment.targets[target].url;
        const apiPath: string = environment.targets[target].apiPath;
        console.log("protected");
        return this.http.get(url + apiPath + 'protected');
    }
    /**
    testWebhook(route: String, body: any, options: any ){
        const req = new HttpRequest('POST', environment.backendUrl+route, body, options);
        return this.http.request(req);
    }
     */



}