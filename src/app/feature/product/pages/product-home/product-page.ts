import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ProductApi } from '@/core/services/product/product-api';
import { ProductResponse } from '@/core/interfaces/product';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-page',
  imports: [
    ButtonModule,
    TableModule,
    TagModule,
    ConfirmDialogModule,
  ],
  providers: [
    ConfirmationService
  ],
  templateUrl: './product-page.html',
  styles: ``,
})
export class ProductPage implements OnInit{

  first = 0;
  rows = 10;
  #productApi = inject(ProductApi);
  #confirmationService = inject(ConfirmationService);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  products = signal<ProductResponse[]>([]);

  ngOnInit(): void {
    this.getProducts();
  }

  pageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  getProducts(): void {
    this.#productApi.getAll().subscribe(res => {
      if (res && res.data && res.data.content) {
        this.products.set(res.data.content);
      }
    })
  }

  gotoSaveProductPage(product?: ProductResponse): void {
    if (!product) {
      this.#router.navigate(['register'], {relativeTo: this.#route}).then();
    } else {
      this.#router.navigate([product.id, 'edit'], {relativeTo: this.#route}).then();
    }
  }

  confirmDeactivateCategory(product: ProductResponse): void {
    this.#confirmationService.confirm({
      message: '¿Estas seguro de desactivar este producto?',
      header: 'Desactivar producto',
      icon: 'ti ti-alert-square-rounded',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Si, desactivar',
        severity: 'danger',
      },

      accept: () => {
        this.deactivateProduct(product.id);
      }
    });
  }

  private deactivateProduct(productId: number): void {
    this.#productApi.deactivate(productId).subscribe(() => {
      this.getProducts();
    });
  }

}
