import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BackendApiService {
    constructor(public http: HttpClient) { }

    /** Testing methods */
    ping(target: string) {
        const url: string = environment.targets[target].url;
        const apiPath: string = environment.targets[target].apiPath;
        console.log("ping");
        return this.http.get(url + apiPath + 'ping');
    }
    databasePing(target: string, value: string) {
        const url: string = environment.targets[target].url;
        const apiPath: string = environment.targets[target].apiPath;
        console.log("database ping", value);
        return this.http.post(url + apiPath + 'database/ping',
            { key: value });
    }
    databasePings(target: string) {
        const url: string = environment.targets[target].url;
        const apiPath: string = environment.targets[target].apiPath;
        return this.http.get(url + apiPath + 'database/ping');
    }
    protected(target: string) {
        const url: string = environment.targets[target].url;
        const apiPath: string = environment.targets[target].apiPath;
        console.log("protected");
        return this.http.get(url + apiPath + 'protected');
    }
    configSchema(target: string, ) {
        const url: string = environment.targets[target].url;
        const apiPath: string = environment.targets[target].apiPath;
        console.log("config schema");
        return this.http.get(url + apiPath + 'config/schema');
    }
    /**
    testWebhook(route: String, body: any, options: any ){
        const req = new HttpRequest('POST', environment.backendUrl+route, body, options);
        return this.http.request(req);
    }
     */



}