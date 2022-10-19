import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
import { User } from '../interfaces/interfaces';

@Injectable()
export class TokenHttpInterceptor implements HttpInterceptor {

    constructor(private loginService: LoginService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add custom header
        const setToken: boolean = !['/login', '/logout','/forgot', '/update-password'].filter((route: string) => request.url.includes(route)).length;
        let customReq: HttpRequest<any>;
        if (setToken) {
            const user: User = this.loginService.getCurrentUser();
            const separator: string = request.url.includes('?') ? `&` : `?`;
            customReq = request.clone({
                url: `${request.url}${separator}token=${user.token}`
            });
        } else {
            customReq = request;
        }

        // pass on the modified request object
        return next.handle(customReq)

    }
}