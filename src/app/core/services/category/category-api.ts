import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category, CategoryCreateRequest } from '@/core/interfaces/category';
import { environment } from '../../../../environments/environment';
import { ApiResponse, Page } from '@/core/interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class CategoryApi {
  #http = inject(HttpClient);

  getAll() {
    return this.#http.get<ApiResponse<Page<Category>>>(`${environment.api.gateway}/ms-catalogue/v1/categories`);
  }

  create(req: CategoryCreateRequest) {
    return this.#http.post<ApiResponse<Category>>(`${environment.api.gateway}/ms-catalogue/v1/categories`, req);
  }
}
