import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { DialogService, DynamicDialog, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SessionStore } from '@/core/services/session/session-store';
import { FormValidator } from '@/shared/utils/form-validator.util';
import { StoreApi } from '@/core/services/store/store-api';
import { StoreResponse } from '@/core/interfaces/store';

@Component({
  selector: 'app-save-store-dlg',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    MessageModule,
  ],
  templateUrl: './save-store-dlg.html',
  styles: ``,
})
export class SaveStoreDlg implements OnInit, OnDestroy {
  private readonly instance: DynamicDialog | undefined;
  private readonly _dialogRef = inject(DynamicDialogRef);
  private readonly _dialogService = inject(DialogService);
  #fb = inject(FormBuilder);
  #storeApi = inject(StoreApi);
  #sessionStore = inject(SessionStore);

  form!: FormGroup;
  formValidator!: FormValidator;

  store = signal<StoreResponse | null>(null);

  constructor() {
    this.instance = this._dialogService.getInstance(this._dialogRef);
  }

  ngOnInit(): void {
    this.initForm();
  }

  saveStore(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.instance && this.instance.data) {
      this.updateStore();
    } else {
      this.createStore();
    }
  }

  createStore(): void {
    this.#storeApi.create(this.form.value).subscribe(res => {
      if (res && res.data) {
        this.close(res.data);
      }
    });
  }

  updateStore(): void {
    const storeId = this.store()!.id;

    this.#storeApi.update(storeId, this.form.value).subscribe(res => {
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

  private initForm(): void {
    this.form = this.#fb.group({
      name: ['', [Validators.required]],
      email: [''],
      phone: [''],
      addressId: [1],
      state: [1],
    });

    this.formValidator = new FormValidator(this.form);

    if (this.instance && this.instance.data) {
      this.store.set(this.instance.data);
      this.form.patchValue(this.instance.data);
    }
  }
}
