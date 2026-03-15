export interface StoreResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  state: number;
  active: boolean;
}

export interface SaveStoreRequest {
  name: string;
  addressId: number;
  email: string;
  phone: string;
  state: number;
}
