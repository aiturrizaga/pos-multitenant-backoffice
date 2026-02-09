import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Category, CategoryCreateRequest, CategoryUpdateRequest } from '@/core/interfaces/category';
import { environment } from '../../../../environments/environment';
import { ApiResponse, Page } from '@/core/interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class CategoryApi {
  #http = inject(HttpClient);

  getAll(opts?: { page?: number; size?: number; sort?: string | string[]; }) {
    let params = new HttpParams();

    if (opts?.page != null) params = params.set('page', String(opts.page));
    if (opts?.size != null) params = params.set('size', String(opts.size));

    const sort = opts?.sort;
    if (typeof sort === 'string') {
      params = params.append('sort', sort);
    } else if (Array.isArray(sort)) {
      sort.forEach(s => (params = params.append('sort', s)));
    }

    return this.#http.get<ApiResponse<Page<Category>>>(`${ environment.api.gateway }/ms-catalogue/v1/categories`, { params });
  }

  create(req: CategoryCreateRequest) {
    return this.#http.post<ApiResponse<Category>>(`${ environment.api.gateway }/ms-catalogue/v1/categories`, req);
  }

  update(categoryId: string, req: CategoryUpdateRequest) {
    return this.#http.put<ApiResponse<Category>>(`${ environment.api.gateway }/ms-catalogue/v1/categories/${ categoryId }`, req);
  }

  inactive(categoryId: string) {
    return this.#http.delete<ApiResponse<void>>(`${ environment.api.gateway }/ms-catalogue/v1/categories/${ categoryId }`);
  }

}
