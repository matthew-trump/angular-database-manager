import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { BackendApiService } from './backend-api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(public backendApiService: BackendApiService) {

    }
    intercept(req: HttpRequest<any>,

        next: HttpHandler): Observable<HttpEvent<any>> {

        const l = document.createElement("a");
        l.href = req.url;

        const targetConfig: any = environment.targets[this.backendApiService.target];
        if (l.pathname.startsWith(targetConfig.apiPath)) {
            const idToken = localStorage.getItem("id_token");
            if (idToken) {
                const cloned = req.clone({
                    headers: req.headers.set("Authorization", "Bearer " + idToken)
                });
                return next.handle(cloned);
            }
            else {
                return next.handle(req);
            }
        }




    }
}
