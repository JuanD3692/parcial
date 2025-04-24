import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ILogin } from '../interfaces/ILogin';
import { IResponse } from '../interfaces/IResponse';
import { HttpService } from '../../shared/service/http.service';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private tokenTimer: any;

    constructor(
        private http: HttpService,
        private router: Router
    ) {
    }

    login(credentials: ILogin): Observable<IResponse> {
        return this.http.post<IResponse>(`login`, credentials);
    }

    loginWithGoogle(token: string): Observable<IResponse> {
        return this.http.post<IResponse>(`login/google`, { token });
    }

    handleLoginResponse(response: IResponse) {
        if (response.token) {

            localStorage.setItem('token', response.token);
            localStorage.setItem('rol', response.rol);

        }
    }

    private convertExpiresInToMilliseconds(expiresIn: string): number {
        const timeValue = parseInt(expiresIn.slice(0, -1), 10);
        const timeUnit = expiresIn.slice(-1);

        switch (timeUnit) {
            case 'h':
                return timeValue * 60 * 60 * 1000;
            case 'm':
                return timeValue * 60 * 1000;
            case 's':
                return timeValue * 1000;
            default:
                throw new Error('Invalid expiresIn format');
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('rol');
        if (this.tokenTimer) {
            clearTimeout(this.tokenTimer);
        }
        this.router.navigate(['/login']);
    }


    getToken(): string | null {
        return localStorage.getItem('token');
    }
}