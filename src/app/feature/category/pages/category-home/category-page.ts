import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Category } from '@/core/interfaces/category';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogService } from 'primeng/dynamicdialog';
import { SaveCategoryDlg } from '../../components/save-category-dlg/save-category-dlg';

export const CATEGORIES_MOCK: Category[] = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/internet/300/200',
    name: 'Internet',
    description: 'Servicios de conexión a internet residencial y empresarial.',
    active: true,
    createdBy: '550e8400-e29b-41d4-a716-446655440000',
    createdAt: '2025-01-05T10:15:30Z'
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/telefonia/300/200',
    name: 'Telefonía',
    description: 'Planes de telefonía fija y móvil.',
    active: true,
    createdBy: '550e8400-e29b-41d4-a716-446655440001',
    createdAt: '2025-01-06T08:45:00Z'
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/equipos/300/200',
    name: 'Equipos',
    description: 'Routers, ONT, decodificadores y otros dispositivos.',
    active: true,
    createdBy: '550e8400-e29b-41d4-a716-446655440002',
    createdAt: '2025-01-07T14:20:10Z'
  },
  {
    id: 4,
    image: 'https://picsum.photos/seed/soporte/300/200',
    name: 'Soporte Técnico',
    description: 'Servicios de instalación, mantenimiento y soporte.',
    active: false,
    createdBy: '550e8400-e29b-41d4-a716-446655440003',
    createdAt: '2025-01-08T09:00:00Z'
  },
  {
    id: 5,
    image: 'https://picsum.photos/seed/otros/300/200',
    name: 'Otros Servicios',
    description: 'Servicios adicionales y complementarios.',
    active: true,
    createdBy: '550e8400-e29b-41d4-a716-446655440004',
    createdAt: '2025-01-09T16:30:45Z'
  }
];


@Component({
  selector: 'app-category-page',
  imports: [
    ButtonModule,
    TableModule,
    TagModule,
  ],
  providers: [DialogService],
  templateUrl: './category-page.html',
  styles: ``,
})
export class CategoryPage {
  #dialogService = inject(DialogService);
  first = 0;
  rows = 10;
  categories = signal(CATEGORIES_MOCK);

  pageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  openSaveCategoryDlg(category?: Category): void {
    const ref = this.#dialogService.open(SaveCategoryDlg, {
      header: category ? 'Actualizar categoria' : 'Nueva categoria',
      data: category,
      modal: true,
      closable: true,
      closeOnEscape: true,
      width: '30vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
    });
  }

}
