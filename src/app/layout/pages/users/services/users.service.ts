import { Injectable } from '@angular/core';
import { HttpService } from '../../../../shared/service/http.service';
import { User, Role } from '../interfaces/IUsers';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class UsersService {

    constructor(private http: HttpService) { }


    getUsers() {
        return this.http.get<{ users: User[]; roles: Role[] }>('admin/users');
    }

    deleteUsers(id: string) {
        return this.http.delete(`admin/users/${id}`);
    }

    updateUsers(id: string, user: Partial<User>): Observable<User> {
        return this.http.put<User>(`admin/users/${id}`, user);
    }

    createUsers(user: User): Observable<User> {
        return this.http.post<User>('admin/users', user);
    }

}

