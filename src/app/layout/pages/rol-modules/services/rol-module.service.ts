import { Injectable } from '@angular/core';
import { HttpService } from '../../../../shared/service/http.service';
import { IRolXModules, Module } from '../interfaces/Module';

@Injectable({
    providedIn: 'root'
})

export class RolModuleService {
    constructor(private http: HttpService) { }

    getInfo() {
        return this.http.get<IRolXModules[]>(`admin/roles`);
    }

    updateRolXModule(rol_id: number, modules: Module[]) {
        return this.http.put(`admin/rolModule/${rol_id}`, modules );
    }
}