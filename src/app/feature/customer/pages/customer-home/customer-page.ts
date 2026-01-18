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
    this.#customerApi.getAll().subscribe(res => {
      if (res && res.data && res.data.content) {
        this.customers.set(res.data.content);
      }
    })
  }

  openSaveCustomerDlg(customer?: PartnerResponse): void {

  }

  confirmDeactivateCustomer(customer: PartnerResponse): void {

  }
}
