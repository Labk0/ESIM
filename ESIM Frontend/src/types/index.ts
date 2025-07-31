export interface eSIM {
  id: string;
  api_id: string;
  country: string;
  countryCode: string;
  dataQuota: number;
  validity: number;
  price: number;
  currency: string;
  description?: string;
  network?: string;
}

export interface CartItem extends eSIM {
  quantity: number;
}

export interface FilterState {
  country: string;
  dataQuota: number;
  validity: number;
}