import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiResponse, Page } from '@/core/interfaces/api-response';
import { TerminalCreateRequest, TerminalResponse, TerminalUpdateRequest } from '@/core/interfaces/terminal';

@Injectable({
  providedIn: 'root',
})
export class TerminalApi {
  #http = inject(HttpClient);
  private readonly baseUrl = `${ environment.api.gateway }/ms-pos/v1/terminals`;

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

    return this.#http.get<ApiResponse<Page<TerminalResponse>>>(`${ this.baseUrl }`, { params });
  }

  create(req: TerminalCreateRequest) {
    return this.#http.post<ApiResponse<TerminalResponse>>(`${ this.baseUrl }`, req);
  }

  update(storeId: string, req: TerminalUpdateRequest) {
    return this.#http.put<ApiResponse<TerminalResponse>>(`${ this.baseUrl }/${ storeId }`, req);
  }

  deactivate(id: number) {
    return this.#http.delete<void>(`${ this.baseUrl }/${ id }/deactivate`);
  }
}
