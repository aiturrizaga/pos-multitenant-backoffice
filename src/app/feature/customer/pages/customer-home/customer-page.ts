import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { PartnerResponse } from '@/core/interfaces/partner';
import { CustomerApi } from '@/core/services/partner/customer-api';
import { UpperCasePipe } from '@angular/common';
import { SaveCustomerDlg } from '@/feature/customer/components/save-customer-dlg/save-customer-dlg';

@Component({
  selector: 'app-customer-page',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    TableModule,
    TagModule,
    UpperCasePipe
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './customer-page.html',
  styles: ``,
})
export class CustomerPage implements OnInit {
  #dialogService = inject(DialogService);
  first = 0;
  rows = 10;
  #customerApi = inject(CustomerApi);
  #confirmationService = inject(ConfirmationService);
  customers = signal<PartnerResponse[]>([]);

  ngOnInit(): void {
    this.getCustomers();
  }

  pageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  getCustomers(): void {
    this.#customerApi.getAll({sort: 'id,desc'}).subscribe(res => {
      if (res && res.data && res.data.content) {
        this.customers.set(res.data.content);
      }
    })
  }

  openSaveCustomerDlg(customer?: PartnerResponse): void {
    const ref = this.#dialogService.open(SaveCustomerDlg, {
      header: customer ? 'Actualizar cliente' : 'Nuevo cliente',
      data: customer,
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
        this.getCustomers();
      }
    })
  }

  confirmDeactivateCustomer(customer: PartnerResponse): void {
    this.#confirmationService.confirm({
      message: '¿Estas seguro de desactivar este cliente?',
      header: 'Desactivar cliente',
      icon: 'ti ti-alert-square-rounded',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Si, estoy seguro',
        severity: 'danger',
      },

      accept: () => {
        this.deactivateCustomer(customer.id);
      }
    });
  }

  private deactivateCustomer(customerId: number): void {
    this.#customerApi.deactivate(customerId).subscribe(res => {
      if (res) {
        this.getCustomers();
      }
    });
  }
}
