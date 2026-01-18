import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { ProductCreateRequest, ProductResponse } from '@/core/interfaces/product';
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
import { ToggleSwitchChangeEvent, ToggleSwitchModule } from 'primeng/toggleswitch';

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
    ToggleSwitchModule
  ],
  templateUrl: './save-product-page.html',
  styles: ``,
})
export class SaveProductPage implements OnInit {

  #router = inject(Router);
  #fb = inject(FormBuilder);
  #uomApi = inject(UnitMeasureApi);
  #categoryApi = inject(CategoryApi);
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
  trackInventory = signal<boolean>(false);

  productForm!: FormGroup;
  formValidator!: FormValidator;

  ngOnInit(): void {
    this.initProductForm();
    this.getGroupedUnitMeasures();
    this.getCategories();
  }

  saveProduct(): void {
    console.log('Product form:', this.productForm.value);
  }

  gotoProductPage(): void {
    this.#router.navigate(['/products']).then();
  }

  addSku(): void {
    this.skus.push(
      this.#fb.group({
        id: [null as number | null],
        skuCode: [''],
        barcode: [''],
        name: ['', Validators.required],
        uomId: [3, [Validators.required, Validators.min(1)]],
        salePrice: [null as number | null],
        costPrice: [null as number | null],
        isDefault: [false, Validators.required],
        isBaseUnit: [true],
        baseSkuId: [null as number | null],
        baseQty: [null as number | null],
      })
    );
  }

  removeSku(index: number): void {
    this.skus.removeAt(index);
  }

  changeTrackInventory(event: ToggleSwitchChangeEvent): void {
    this.trackInventory.set(event.checked);
    this.productForm.patchValue({
      trackInventory: event.checked,
      inventoryPolicy: event.checked ? 'TRACK' : 'NONE'
    });
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
      code: ['', [Validators.required, Validators.maxLength(20)]],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      brand: [''],

      currencyCode: ['PEN', [Validators.required, Validators.pattern(/^[A-Z]{3}$/)]],
      taxId: [1, [Validators.required, Validators.min(1)]],
      unspsc: [null as number | null],

      allowDiscount: [true],
      allowPriceOverride: [false],

      trackInventory: [false],
      inventoryPolicy: ['NONE' as ProductCreateRequest['inventoryPolicy']],

      trackLot: [false],
      trackExpiry: [false],

      metadata: [null as unknown | null],

      categoryIds: [[] as string[]],

      skus: this.#fb.array<FormGroup>([])
    });

    this.formValidator = new FormValidator(this.productForm);
  }

  get skus(): FormArray<FormGroup> {
    return this.productForm.controls['skus'] as unknown as FormArray<FormGroup>;
  }

}
