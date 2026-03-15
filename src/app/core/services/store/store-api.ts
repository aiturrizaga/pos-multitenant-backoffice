import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponse, Page } from '@/core/interfaces/api-response';
import { environment } from '../../../../environments/environment';
import { SaveStoreRequest, StoreResponse } from '@/core/interfaces/store';

@Injectable({
  providedIn: 'root',
})
export class StoreApi {
  #http = inject(HttpClient);
  private readonly baseUrl = `${ environment.api.gateway }/ms-organization/v1/stores`;

  getAll(opts?: { page?: number; size?: number; sort?: string | string[]; active?: boolean }) {
    let params = new HttpParams();

    params = params.set('active', opts?.active ? String(opts.active) : 'true');

    if (opts?.page != null) params = params.set('page', String(opts.page));
    if (opts?.size != null) params = params.set('size', String(opts.size));

    const sort = opts?.sort;
    if (typeof sort === 'string') {
      params = params.append('sort', sort);
    } else if (Array.isArray(sort)) {
      sort.forEach(s => (params = params.append('sort', s)));
    }

    return this.#http.get<ApiResponse<Page<StoreResponse>>>(`${ this.baseUrl }`, { params });
  }

  create(req: SaveStoreRequest) {
    return this.#http.post<ApiResponse<StoreResponse>>(`${ this.baseUrl }`, req);
  }

  update(storeId: string, req: SaveStoreRequest) {
    return this.#http.put<ApiResponse<StoreResponse>>(`${ this.baseUrl }/${ storeId }`, req);
  }

  deactivate(id: string) {
    return this.#http.delete<void>(`${ this.baseUrl }/${ id }/deactivate`);
  }
}
