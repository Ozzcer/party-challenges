import { Routes } from '@angular/router';
import { adminNoAuthGuard } from '../core/guards/admin-no-auth.guard';
import { AdminLogin } from './admin-login/admin-login.component';

export const AUTH_ROUTES: Routes = [
  { path: 'admin/login', component: AdminLogin, canActivate: [adminNoAuthGuard] },
];
