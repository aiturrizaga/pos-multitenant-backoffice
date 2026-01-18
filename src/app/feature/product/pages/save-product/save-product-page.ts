import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { ProductResponse } from '@/core/interfaces/product';

@Component({
  selector: 'app-save-product-page',
  imports: [
    ButtonModule,
    TooltipModule,
    SplitButtonModule
  ],
  templateUrl: './save-product-page.html',
  styles: ``,
})
export class SaveProductPage implements OnInit {

  #router = inject(Router);
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

  ngOnInit(): void {
    console.log(this.product());
  }

  saveProduct(): void {

  }

  gotoProductPage(): void {
    this.#router.navigate(['/products']).then();
  }
}
