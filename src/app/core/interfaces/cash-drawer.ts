export interface CashDrawerResponse {
  id: number;
  terminalId: number;
  code: string;
  name: string;
  active: boolean;
}

export type CashDrawerCreateRequest = Pick<CashDrawerResponse, 'terminalId' | 'code' | 'name'>;
export type CashDrawerUpdateRequest = Pick<CashDrawerResponse, 'terminalId' | 'name'>;
