import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ProductApi } from '@/core/services/product/product-api';
import { catchError, EMPTY, map } from 'rxjs';
import { ProductResponse } from '@/core/interfaces/product';

export const productByIdResolver: ResolveFn<ProductResponse> = (route, state) => {
  const productApi = inject(ProductApi);

  const rawId = route.paramMap.get('id');
  const id = rawId ? Number(rawId) : NaN;

  if (!Number.isFinite(id) || id <= 0) {
    return EMPTY;
  }

  return productApi.getById(id).pipe(
    map(res => res.data),
    catchError(() => EMPTY)
  );
};
