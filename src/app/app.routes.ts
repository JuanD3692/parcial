import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LayoutComponent } from './layout/layout/layout.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'layout', loadChildren: () => import('./layout/layout.routes').then(m => m.LayoutRoutingModule) },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
