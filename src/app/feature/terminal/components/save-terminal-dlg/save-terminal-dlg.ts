import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { DialogService, DynamicDialog, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StoreApi } from '@/core/services/store/store-api';
import { FormValidator } from '@/shared/utils/form-validator.util';
import { StoreResponse } from '@/core/interfaces/store';
import { TerminalApi } from '@/core/services/terminal/terminal-api';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-save-terminal-dlg',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    MessageModule,
    Select,
  ],
  templateUrl: './save-terminal-dlg.html',
  styles: ``,
})
export class SaveTerminalDlg implements OnInit, OnDestroy {
  private readonly instance: DynamicDialog | undefined;
  private readonly _dialogRef = inject(DynamicDialogRef);
  private readonly _dialogService = inject(DialogService);
  #fb = inject(FormBuilder);
  #terminalApi = inject(TerminalApi);
  #storeApi = inject(StoreApi);

  form!: FormGroup;
  formValidator!: FormValidator;

  terminal = signal<StoreResponse | null>(null);
  stores = signal<StoreResponse[]>([]);

  constructor() {
    this.instance = this._dialogService.getInstance(this._dialogRef);
  }

  ngOnInit(): void {
    this.initForm();
    this.getStores();
  }

  saveTerminal(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.instance && this.instance.data) {
      this.updateTerminal();
    } else {
      this.createTerminal();
    }
  }

  createTerminal(): void {
    this.#terminalApi.create(this.form.value).subscribe(res => {
      if (res && res.data) {
        this.close(res.data);
      }
    });
  }

  updateTerminal(): void {
    const terminalId = this.terminal()!.id;

    this.#terminalApi.update(terminalId, this.form.value).subscribe(res => {
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
      storeId: ['', [Validators.required]],
    });

    this.formValidator = new FormValidator(this.form);

    if (this.instance && this.instance.data) {
      this.terminal.set(this.instance.data);
      this.form.patchValue(this.instance.data);
    }
  }
}
