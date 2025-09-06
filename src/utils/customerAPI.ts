import { getRequest } from './axios';

// Types for the API response
export interface Customer {
  id: number;
  phone_number: string;
  name: string;
  country_code: string;
  created_at: string;
  updated_at: string;
  subscriptions: Subscription[];
  _count: {
    subscriptions: number;
  };
}

export interface Subscription {
  id: number;
  status: string;
  subscribed_at: string;
  brand: {
    id: number;
    name: string;
    display_name: string;
  };
}

export interface CustomersResponse {
  success: boolean;
  message: string;
  data: {
    customers: Customer[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface CustomersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export class CustomerAPI {
  /**
   * Get all customers not based on brand
   */
  static async getAllCustomers(params?: CustomersQueryParams) {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const url = `userSub/customers/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return await getRequest(url);
  }
}
