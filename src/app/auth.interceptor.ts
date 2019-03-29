import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

const SECRET_KEY: String = environment.dialogflowSecretKey;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {

        const l = document.createElement("a");
        l.href = req.url;

        if (l.pathname.startsWith(environment.apiPath)) {
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
        } else if (SECRET_KEY && l.pathname.startsWith(environment.dialogflowPath)) {
            const cloned = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + SECRET_KEY)
            });
            return next.handle(cloned);

        }




    }
}
