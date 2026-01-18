import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Category } from '@/core/interfaces/category';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogService } from 'primeng/dynamicdialog';
import { SaveCategoryDlg } from '../../components/save-category-dlg/save-category-dlg';
import { CategoryApi } from '@/core/services/category/category-api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-category-page',
  imports: [
    ButtonModule,
    TableModule,
    TagModule,
    ConfirmDialogModule,
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './category-page.html',
  styles: ``,
})
export class CategoryPage implements OnInit {
  #dialogService = inject(DialogService);
  first = 0;
  rows = 10;
  #categoryApi = inject(CategoryApi);
  #confirmationService = inject(ConfirmationService);
  categories = signal<Category[]>([]);

  ngOnInit(): void {
    this.getCategories();
  }

  pageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  getCategories(): void {
    this.#categoryApi.getAll().subscribe(res => {
      if (res && res.data && res.data.content) {
        this.categories.set(res.data.content);
      }
    })
  }

  confirmInactiveCategory(category: Category): void {
    this.#confirmationService.confirm({
      message: '¿Estas eguro de inactivar esta categoria?',
      header: 'Inactivar categoria',
      icon: 'ti ti-alert-square-rounded',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Inactivar',
        severity: 'danger',
      },

      accept: () => {
        console.log('Confirm target', category);
        this.inactiveCategory(category.id);
      }
    });
  }

  private inactiveCategory(categoryId: string): void {
    this.#categoryApi.inactive(categoryId).subscribe(res => {
      if (res) {
        this.getCategories();
      }
    });
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

    ref?.onClose.subscribe(res => {
      if (res) {
        this.getCategories();
      }
    })
  }

}
