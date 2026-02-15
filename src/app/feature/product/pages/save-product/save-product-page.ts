import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem, MessageService } from 'primeng/api';
import { ProductCreateRequest, ProductResponse, ProductSkuResponse } from '@/core/interfaces/product';
import { CardModule } from 'primeng/card';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidator } from '@/shared/utils/form-validator.util';
import { UnitMeasureApi } from '@/core/services/uom/unit-measure-api';
import { UnitMeasureGrouped } from '@/core/interfaces/unit-measure';
import { SelectModule } from 'primeng/select';
import { CategoryApi } from '@/core/services/category/category-api';
import { Category } from '@/core/interfaces/category';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ProductApi } from '@/core/services/product/product-api';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-save-product-page',
  imports: [
    ButtonModule,
    TooltipModule,
    SplitButtonModule,
    CardModule,
    SelectModule,
    ReactiveFormsModule,
    MultiSelectModule,
    InputTextModule,
    MessageModule,
    TextareaModule,
    CheckboxModule,
    ToggleSwitchModule,
    ToastModule,
    RadioButtonModule
  ],
  providers: [
    MessageService
  ],
  templateUrl: './save-product-page.html',
  styles: ``,
})
export class SaveProductPage implements OnInit {

  #router = inject(Router);
  #fb = inject(FormBuilder);
  #uomApi = inject(UnitMeasureApi);
  #categoryApi = inject(CategoryApi);
  #productApi = inject(ProductApi);
  #messageService = inject(MessageService);
  product = input.required<ProductResponse>();
  items = signal<MenuItem[]>([
    {
      label: 'Duplicar',
      icon: 'ti ti-copy',
    },
    {
      label: 'Desactivar',
      icon: 'ti ti-trash',
    }
  ]);
  currencyCodes = signal([
    {
      name: 'Sol peruano',
      code: 'PEN',
      symbol: 'S/.'
    },
    {
      name: 'Dolar estadounidense',
      code: 'USD',
      symbol: '$'
    }
  ]);
  taxIds = signal([
    {
      id: 1,
      name: 'Gravado 18% IGV',
    },
    {
      id: 2,
      name: 'Exonerado',
    },
    {
      id: 3,
      name: 'Inafecto',
    },
    {
      id: 4,
      name: 'ICBPER-Gravado',
    },
    {
      id: 5,
      name: 'Gravado 10% IGV',
    }
  ]);
  groupedUnitMeasures = signal<UnitMeasureGrouped[]>([]);
  categories = signal<Category[]>([]);

  productForm!: FormGroup;
  formValidator!: FormValidator;

  ngOnInit(): void {
    this.initProductForm();
    this.getGroupedUnitMeasures();
    this.getCategories();
  }

  saveProduct(): void {
    console.log('Product form:', this.productForm.value);
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    if (this.product()) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  createProduct(): void {
    this.#productApi.create(this.productForm.value).subscribe(res => {
      if (res && res.data) {
        this.#messageService.add({
          severity: 'success',
          summary: 'Producto creado',
          detail: 'Se creo el producto con exito.'
        });
        this.gotoProductPage();
      }
    })
  }

  updateProduct(): void {
    const productId = this.product()!.id;
    this.#productApi.update(productId, this.productForm.value).subscribe(res => {
      if (res && res.data) {
        this.#messageService.add({
          severity: 'success',
          summary: 'Producto actualizada',
          detail: 'Se actualizo el producto con exito.'
        });
        this.gotoProductPage();
      }
    })
  }

  gotoProductPage(): void {
    this.#router.navigate(['/products']).then();
  }

  private getGroupedUnitMeasures(): void {
    this.#uomApi.getGrouped().subscribe(res => {
      if (res && res.data) {
        this.groupedUnitMeasures.set(res.data);
      }
    })
  }

  private getCategories(): void {
    this.#categoryApi.getAll().subscribe(res => {
      if (res && res.data && res.data.content) {
        this.categories.set(res.data.content);
      }
    })
  }

  private initProductForm(): void {
    this.productForm = this.#fb.group({

      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      type: ['SIMPLE', [Validators.required]],
      code: ['', [Validators.maxLength(20)]],
      currencyCode: ['PEN', [Validators.required, Validators.pattern(/^[A-Z]{3}$/)]],
      price: [0, [Validators.required, Validators.min(0)]],
      uomId: [null, [Validators.required]],
      taxId: [1, [Validators.required, Validators.min(1)]],
      unspsc: [null as number | null],
      sellable: [true],
      trackInventory: [false],
      trackLot: [false],
      trackExpiry: [false],
      allowDiscount: [true],
      categoryIds: [[]],
      metadata: [null as unknown | null],
    });

    this.formValidator = new FormValidator(this.productForm);

    const product = this.product()!;
    if (product) {
      this.productForm.patchValue({
        ...product,
        categoryIds: product.categories?.map(c => c.id) ?? []
      });
    }
  }

}
