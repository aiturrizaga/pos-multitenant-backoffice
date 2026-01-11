import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { MenuItem } from 'primeng/api';
import { Avatar } from 'primeng/avatar';

@Component({
  selector: 'app-shell-layout',
  imports: [
    RouterOutlet,
    DrawerModule,
    RouterLink,
    Avatar,
    RouterLinkActive
  ],
  templateUrl: './shell-layout.html',
  styles: ``,
})
export class ShellLayout {
  menuItems = signal<MenuItem[]>([
    {
      id: '1',
      icon: 'ti ti-layout text-2xl',
      label: 'Dashboard',
      routerLink: 'dashboard'
    },
    {
      id: '2',
      icon: 'ti ti-tag text-2xl',
      label: 'Productos',
      routerLink: 'products'
    },
    {
      id: '3',
      icon: 'ti ti-category text-2xl',
      label: 'Categorías',
      routerLink: 'categories'
    },
    {
      id: '4',
      icon: 'ti ti-user-square-rounded text-2xl',
      label: 'Clientes',
      routerLink: 'customers'
    },
    {
      id: '5',
      icon: 'ti ti-archive text-2xl',
      label: 'Inventario',
      routerLink: 'inventory'
    },
    {
      id: '6',
      icon: 'ti ti-settings text-2xl',
      label: 'Configuración',
      routerLink: 'settings'
    }
  ]);
}
