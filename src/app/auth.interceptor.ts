import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(public authService: AuthService) {

    }
    intercept(req: HttpRequest<any>,

        next: HttpHandler): Observable<HttpEvent<any>> {

        const l = document.createElement("a");
        l.href = req.url;

        const target: any = environment.targets[this.authService.getCurrentTarget()];
        if (l.pathname.startsWith(target.apiPath)) {
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
