import { Routes } from '@angular/router';
import { ShellLayout } from '@/shared/layouts/shell-layout';

export const routes: Routes = [
  {
    path: '',
    component: ShellLayout,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./feature/dashboard/dashboard.routes').then(m => m.routes)
      },
      {
        path: 'products',
        loadChildren: () => import('./feature/product/product.routes').then(m => m.routes)
      },
      {
        path: 'categories',
        loadChildren: () => import('./feature/category/category.routes').then(m => m.routes)
      },
      {
        path: 'customers',
        loadChildren: () => import('./feature/customer/customer.routes').then(m => m.routes)
      },
      {
        path: 'inventory',
        loadChildren: () => import('./feature/inventory/inventory.routes').then(m => m.routes)
      },
      {
        path: 'settings',
        loadChildren: () => import('./feature/setting/setting.routes').then(m => m.routes)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  }
];
