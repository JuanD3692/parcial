import { Injectable } from '@angular/core';
import { HttpService } from '../../../shared/service/http.service';
import { ILayout } from '../interfaces/ILayout';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class LayoutService {

    constructor(private http: HttpService) { }

    getUserInfo() {
        return this.http.get<ILayout>(`info`); 
    }
}
