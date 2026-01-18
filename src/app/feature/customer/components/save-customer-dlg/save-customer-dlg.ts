import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DialogService, DynamicDialog, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidator } from '@/shared/utils/form-validator.util';
import { CustomerApi } from '@/core/services/partner/customer-api';
import { CreateCompanyRequest, CreatePersonRequest, PartnerResponse } from '@/core/interfaces/partner';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectButtonModule, SelectButtonOptionClickEvent } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-save-customer-dlg',
  imports: [
    ButtonModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectButtonModule,
    SelectModule
  ],
  templateUrl: './save-customer-dlg.html',
  styles: ``,
})
export class SaveCustomerDlg implements OnInit, OnDestroy {
  private readonly instance: DynamicDialog | undefined;
  private readonly _dialogRef = inject(DynamicDialogRef);
  private readonly _dialogService = inject(DialogService);
  #fb = inject(FormBuilder);
  #customerApi = inject(CustomerApi);

  selectedPartnerType = new FormControl('PERSON');
  partnerTypes = signal([
    { label: 'Persona', value: 'PERSON' },
    { label: 'Empresa', value: 'COMPANY' },
  ]);

  documentTypes = signal([
    { label: 'DNI', value: 1 },
    { label: 'RUC', value: 2 },
  ])

  customerForm!: FormGroup;
  formValidator!: FormValidator;

  customer = signal<PartnerResponse | null>(null);

  constructor() {
    this.instance = this._dialogService.getInstance(this._dialogRef);
  }

  ngOnInit(): void {
    this.initCategoryForm();
  }

  saveCustomer(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    if (this.instance && this.instance.data) {
      this.updateCustomer();
    } else {
      this.createCustomer();
    }
  }

  createCustomer(): void {
    const { legalName, tradeName, firstName, lastName, documentNumber, email, phone, mobile } = this.customerForm.value;
    if (this.selectedPartnerType.value === 'PERSON') {
      const req = new CreatePersonRequest(
        firstName, lastName, documentNumber
      );
      req.email = email;
      req.phone = phone;
      req.mobile = mobile;
      this.#customerApi.createPerson(req).subscribe(res => {
        if (res && res.data) {
          this.close(res.data);
        }
      });
    } else {
      const req = new CreateCompanyRequest(
        legalName, tradeName, documentNumber
      );
      req.email = email;
      req.phone = phone;
      req.mobile = mobile;
      this.#customerApi.createCompany(req).subscribe(res => {
        if (res && res.data) {
          this.close(res.data);
        }
      });
    }
  }

  updateCustomer(): void {
    const customerId = this.customer()!.id;

    this.#customerApi.update(customerId, this.customerForm.value).subscribe(res => {
      if (res && res.data) {
        this.close(res.data);
      }
    });
  }

  selectPartnerType(event: SelectButtonOptionClickEvent): void {
    if (event.option.value === 'PERSON') {
      this.customerForm.patchValue({ documentType: 1 });
    } else {
      this.customerForm.patchValue({ documentType: 2 });
    }
  }

  close(data?: any): void {
    this._dialogRef.close(data);
  }

  ngOnDestroy(): void {
    if (this._dialogRef) {
      this._dialogRef.close();
    }
  }

  private initCategoryForm(): void {
    this.customerForm = this.#fb.group({
      firstName: [''],
      lastName: [''],
      legalName: [''],
      tradeName: [''],
      documentType: [1],
      documentNumber: ['', [Validators.required]],
      email: ['', [Validators.email]],
      phone: [''],
      mobile: [''],
    });

    this.formValidator = new FormValidator(this.customerForm);

    if (this.instance && this.instance.data) {
      this.customer.set(this.instance.data);
      this.customerForm.patchValue(this.instance.data);
    }
  }
}
