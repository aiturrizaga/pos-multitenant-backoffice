export interface TerminalResponse {
  id: number;
  storeId: number;
  code: string;
  name: string;
  active: boolean;
}

export type TerminalCreateRequest = Pick<TerminalResponse, 'storeId' | 'code' | 'name'>;
export type TerminalUpdateRequest = Pick<TerminalCreateRequest, 'name'>;
