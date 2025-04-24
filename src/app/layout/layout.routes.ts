import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { BorrowerComponent } from './pages/borrower/borrower.component';
import { LenderComponent } from './pages/lender/lender.component';
import { RolModulesComponent } from './pages/rol-modules/rol-modules.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '', 
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'rol-modules',
                component: RolModulesComponent
            },
            {
                path: 'users',
                component: UsersComponent
            },
            {
                path: 'borrower',
                component: BorrowerComponent
            },
            {
                path: 'lender',
                component: LenderComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
