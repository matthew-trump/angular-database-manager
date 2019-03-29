import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BackendApiService {
    constructor(private http: HttpClient) { }

    /** Testing methods */
    ping() {
        console.log("ping");
        return this.http.get(environment.backendUrl + environment.apiPath + 'ping');
    }
    databasePing(value: string) {
        console.log("database ping", value);
        return this.http.post(environment.backendUrl + environment.apiPath + 'database/ping',
            { key: value });
    }
    databasePings() {
        return this.http.get(environment.backendUrl + environment.apiPath + 'database/ping');
    }
    protected() {
        console.log("protected");
        return this.http.get(environment.backendUrl + environment.apiPath + 'protected');
    }
    /**
    testWebhook(route: String, body: any, options: any ){
        const req = new HttpRequest('POST', environment.backendUrl+route, body, options);
        return this.http.request(req);
    }
     */



}