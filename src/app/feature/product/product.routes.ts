import { Routes } from '@angular/router';
import { ProductPage } from '@/feature/product/pages/product-home';
import { SaveProductPage } from '@/feature/product/pages/save-product';
import { productByIdResolver } from '@/feature/product/resolvers/product-by-id-resolver';

export const routes: Routes = [
  {
    path: '',
    component: ProductPage
  },
  {
    path: 'register',
    component: SaveProductPage
  },
  {
    path: ':id/edit',
    resolve: { product: productByIdResolver },
    component: SaveProductPage
  }
];
