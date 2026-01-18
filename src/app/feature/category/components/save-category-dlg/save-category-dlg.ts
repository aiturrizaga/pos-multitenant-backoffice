import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DialogService, DynamicDialog, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Category } from '@/core/interfaces/category';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { CategoryApi } from '@/core/services/category/category-api';
import { SessionStore } from '@/core/services/session/session-store';

@Component({
  selector: 'app-save-category-dlg',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    MessageModule
  ],
  templateUrl: './save-category-dlg.html',
  styles: ``,
})
export class SaveCategoryDlg implements OnInit, OnDestroy {
  private readonly instance: DynamicDialog | undefined;
  private readonly _dialogRef = inject(DynamicDialogRef);
  private readonly _dialogService = inject(DialogService);
  #fb = inject(FormBuilder);
  #categoryApi = inject(CategoryApi);
  #sessionStore = inject(SessionStore);

  categoryForm!: FormGroup;

  category = signal<Category | null>(null);

  constructor() {
    this.instance = this._dialogService.getInstance(this._dialogRef);
  }

  ngOnInit(): void {
    this.initCategoryForm();
  }

  saveCategory(): void {
    if (this.instance && this.instance.data) {
      this.updateCategory();
    } else {
      this.createCategory();
    }
  }

  createCategory(): void {
    const companyId = this.#sessionStore.companyId();
    const req = {...this.categoryForm.value, companyId};

    this.#categoryApi.create(req).subscribe(res => {
      if (res && res.data) {
        this.close(res.data);
      }
    });
  }

  updateCategory(): void {

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
    this.categoryForm = this.#fb.group({
      name: ['', [Validators.required]],
      description: [''],
    });

    if (this.instance && this.instance.data) {
      this.category.set(this.instance.data);
      this.categoryForm.patchValue(this.instance.data);
    }
  }

}
