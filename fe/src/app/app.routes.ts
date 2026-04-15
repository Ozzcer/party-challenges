import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
];
