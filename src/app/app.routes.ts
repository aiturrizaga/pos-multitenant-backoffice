import { Routes } from '@angular/router';
import { ShellLayout } from '@/shared/layouts/shell-layout';
import { canActivateAuthRole } from '@/core/guards/auth-guard';
import { UnauthorizedPage } from '@/core/pages/unauthorized-page';

export const routes: Routes = [
  {
    path: '',
    component: ShellLayout,
    canActivate: [canActivateAuthRole],
    data: { roles: ['admin'] },
    children: [
      {
        path: 'dashboard',
        data: { roles: ['admin'] },
        loadChildren: () => import('./feature/dashboard/dashboard.routes').then(m => m.routes)
      },
      {
        path: 'products',
        data: { roles: ['admin'] },
        loadChildren: () => import('./feature/product/product.routes').then(m => m.routes)
      },
      {
        path: 'categories',
        data: { roles: ['admin'] },
        loadChildren: () => import('./feature/category/category.routes').then(m => m.routes)
      },
      {
        path: 'customers',
        data: { roles: ['admin'] },
        loadChildren: () => import('./feature/customer/customer.routes').then(m => m.routes)
      },
      {
        path: 'inventory',
        data: { roles: ['admin'] },
        loadChildren: () => import('./feature/inventory/inventory.routes').then(m => m.routes)
      },
      {
        path: 'settings',
        data: { roles: ['admin'] },
        loadChildren: () => import('./feature/setting/setting.routes').then(m => m.routes)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedPage
  }

];
