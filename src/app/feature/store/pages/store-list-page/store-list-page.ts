import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { Category } from '@/core/interfaces/category';
import { StoreApi } from '@/core/services/store/store-api';
import { StoreResponse } from '@/core/interfaces/store';
import { SaveStoreDlg } from '@/feature/store/components/save-store-dlg/save-store-dlg';

@Component({
  selector: 'app-store-list-page',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    TableModule,
    TagModule
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './store-list-page.html',
  styles: ``,
})
export class StoreListPage implements OnInit {
  #dialogService = inject(DialogService);
  first = 0;
  rows = 10;
  #storeApi = inject(StoreApi);
  #confirmationService = inject(ConfirmationService);
  stores = signal<StoreResponse[]>([]);

  ngOnInit(): void {
    this.getStores();
  }

  pageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  getStores(): void {
    this.#storeApi.getAll({ sort: 'id,desc' }).subscribe(res => {
      if (res && res.data && res.data.content) {
        this.stores.set(res.data.content);
      }
    })
  }

  confirmInactiveStore(store: Category): void {
    this.#confirmationService.confirm({
      message: '¿Estas eguro de inactivar esta sucursal?',
      header: 'Inactivar sucursal',
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
        console.log('Confirm target', store);
        this.inactiveStore(store.id);
      }
    });
  }

  private inactiveStore(storeId: string): void {
    this.#storeApi.deactivate(storeId).subscribe(res => {
      this.getStores();
    });
  }

  openSaveStoreDlg(store?: Category): void {
    const ref = this.#dialogService.open(SaveStoreDlg, {
      header: store ? 'Actualizar sucursal' : 'Nueva sucursal',
      data: store,
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
        this.getStores();
      }
    })
  }
}
