import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { DialogService, DynamicDialog, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TerminalApi } from '@/core/services/terminal/terminal-api';
import { StoreApi } from '@/core/services/store/store-api';
import { FormValidator } from '@/shared/utils/form-validator.util';
import { StoreResponse } from '@/core/interfaces/store';
import { CashDrawerApi } from '@/core/services/cash-drawer/cash-drawer-api';
import { CashDrawerResponse } from '@/core/interfaces/cash-drawer';
import { TerminalResponse } from '@/core/interfaces/terminal';

@Component({
  selector: 'app-save-cash-drawer-dlg',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    MessageModule,
    SelectModule,
  ],
  templateUrl: './save-cash-drawer-dlg.html',
})
export class SaveCashDrawerDlg implements OnInit, OnDestroy {
  private readonly instance: DynamicDialog | undefined;
  private readonly _dialogRef = inject(DynamicDialogRef);
  private readonly _dialogService = inject(DialogService);
  #fb = inject(FormBuilder);
  #cashDrawerApi = inject(CashDrawerApi);
  #terminalApi = inject(TerminalApi);
  #storeApi = inject(StoreApi);

  form!: FormGroup;
  formValidator!: FormValidator;

  cashDrawer = signal<CashDrawerResponse | null>(null);
  terminals = signal<TerminalResponse[]>([]);
  stores = signal<StoreResponse[]>([]);

  constructor() {
    this.instance = this._dialogService.getInstance(this._dialogRef);
  }

  ngOnInit(): void {
    this.initForm();
    this.getStores();
    this.getTerminals();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.instance && this.instance.data) {
      this.update();
    } else {
      this.create();
    }
  }

  create(): void {
    this.#cashDrawerApi.create(this.form.value).subscribe(res => {
      if (res && res.data) {
        this.close(res.data);
      }
    });
  }

  update(): void {
    const cashDrawerId = this.cashDrawer()!.id;

    this.#cashDrawerApi.update(cashDrawerId, this.form.value).subscribe(res => {
      if (res && res.data) {
        this.close(res.data);
      }
    });
  }

  close(data?: any): void {
    this._dialogRef.close(data);
  }

  ngOnDestroy(): void {
    if (this._dialogRef) {
      this._dialogRef.close();
    }
  }

  private getTerminals(): void {
    this.#terminalApi.getAll({ active: true }).subscribe(res => {
      if (res && res.data && res.data.content) {
        this.terminals.set(res.data.content);
      }
    })
  }

  private getStores(): void {
    this.#storeApi.getAll({ active: true }).subscribe(res => {
      if (res && res.data && res.data.content) {
        this.stores.set(res.data.content);
      }
    })
  }

  private initForm(): void {
    this.form = this.#fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      storeId: [''],
      terminalId: ['', [Validators.required]],
    });

    this.formValidator = new FormValidator(this.form);

    if (this.instance && this.instance.data) {
      this.cashDrawer.set(this.instance.data);
      this.form.patchValue(this.instance.data);
    }
  }
}
