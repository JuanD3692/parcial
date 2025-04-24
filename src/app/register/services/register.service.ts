import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/service/http.service';
import { IRegister } from '../interfaces/IRegister';

@Injectable({
    providedIn: 'root'
})
export class RegisterService {

    constructor( private http: HttpService,) {}

    register(credentials: IRegister) {
        return this.http.post(`register`, credentials);
    }

}