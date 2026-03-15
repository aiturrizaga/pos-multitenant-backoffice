import { Component, inject, OnInit, signal } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CashDrawerApi } from '@/core/services/cash-drawer/cash-drawer-api';
import { CashDrawerResponse } from '@/core/interfaces/cash-drawer';
import { SaveCashDrawerDlg } from '@/feature/drawer/components/save-cash-drawer-dlg/save-cash-drawer-dlg';

@Component({
  selector: 'app-drawer-list-page',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    TableModule,
    TagModule
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './drawer-list-page.html',
  styles: ``,
})
export class DrawerListPage implements OnInit {
  #dialogService = inject(DialogService);
  first = 0;
  rows = 10;
  #cashDrawerApi = inject(CashDrawerApi);
  #confirmationService = inject(ConfirmationService);
  cashDrawers = signal<CashDrawerResponse[]>([]);

  ngOnInit(): void {
    this.getCashDrawers();
  }

  pageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  getCashDrawers(): void {
    this.#cashDrawerApi.getAll({ sort: 'id,desc' }).subscribe(res => {
      if (res && res.data && res.data.content) {
        this.cashDrawers.set(res.data.content);
      }
    })
  }

  confirmDeactivate(cashDrawer: CashDrawerResponse): void {
    this.#confirmationService.confirm({
      message: '¿Estas eguro de inactivar esta caja registradora?',
      header: 'Inactivar caja registradora',
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
        this.deactivate(cashDrawer.id);
      }
    });
  }

  private deactivate(cashDrawerId: number): void {
    this.#cashDrawerApi.deactivate(cashDrawerId).subscribe(res => {
      this.getCashDrawers();
    });
  }

  openSaveCashDrawerDlg(cashDrawer?: CashDrawerResponse): void {
    const ref = this.#dialogService.open(SaveCashDrawerDlg, {
      header: cashDrawer ? 'Actualizar caja registradora' : 'Nueva caja registradora',
      data: cashDrawer,
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
        this.getCashDrawers();
      }
    })
  }
}
