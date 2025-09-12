import { getRequest, postRequest, putRequest, patchRequest, deleteRequest } from './axios';

export interface Brand {
  id: number;
  name: string;
  display_name: string | null;
  logo_url: string | null;
  api_key: string;
  subscription_type: string | null;
  status: string;
  description: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
  _count: {
    brandAgents: number;
    templates: number;
    campaigns: number;
    subscriptions?: number;
  };
}

export interface BrandAgent {
  id: number;
  brand_id: number;
  name: string;
  display_name: string | null;
  email: string;
  logo_url: string | null;
  role: string;
  status: string;
  verification_status: string;
  created_at: string;
  updated_at: string;
  brand: Brand;
}

export interface BrandsResponse {
  brands: Brand[];
  total: number;
  page: number;
  limit: number;
}

export interface BrandApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Helper function to build query string
const buildQueryString = (params?: Record<string, any>): string => {
  if (!params) return '';
  
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });
  
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

// Brand API functions
export const BrandAPI = {
  // Get all brands with optional filters
  getAllBrands: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => {
    const queryString = buildQueryString(params);
    return getRequest<BrandApiResponse<BrandsResponse>>(
      `brand${queryString}`
    );
  },

  // Get brand by ID
  getBrandById: async (brandId: number) => {
    return getRequest<BrandApiResponse<Brand>>(
      `brand/${brandId}`
    );
  },

  // Create a new brand
  createBrand: async (brandData: {
    name: string;
    display_name?: string;
    description?: string;
    subscription_type?: string;
  }) => {
    return postRequest<BrandApiResponse<Brand>>(
      'brand',
      brandData
    );
  },

  // Update brand
  updateBrand: async (brandId: number, brandData: {
    name?: string;
    display_name?: string;
    logo_url?: string;
    subscription_type?: string;
    status?: string;
    description?: string;
    verified?: boolean;
  }) => {
    return putRequest<BrandApiResponse<Brand>>(
      `brand/${brandId}`,
      brandData
    );
  },

  // Approve brand (set verified to true and status to active)
  approveBrand: async (brandId: number, approvalData?: {
    status?: string;
    verified?: boolean;
  }) => {
    return patchRequest<BrandApiResponse<Brand>>(
      `brand/${brandId}`,
      {
        verified: true,
        status: 'active',
        ...approvalData
      }
    );
  },

  // Reject brand (set status to rejected)
  rejectBrand: async (brandId: number, reason?: string) => {
    return patchRequest<BrandApiResponse<Brand>>(
      `brand/${brandId}`,
      {
        status: 'rejected',
        description: reason ? `Rejection reason: ${reason}` : undefined
      }
    );
  },

  // Suspend brand
  suspendBrand: async (brandId: number, reason?: string) => {
    return patchRequest<BrandApiResponse<Brand>>(
      `brand/${brandId}`,
      {
        status: 'suspended',
        description: reason ? `Suspension reason: ${reason}` : undefined
      }
    );
  },

  // Delete brand
  deleteBrand: async (brandId: number) => {
    return deleteRequest<BrandApiResponse<{ id: number }>>(
      `brand/${brandId}`,
      {}
    );
  },

  // Regenerate API key
  regenerateApiKey: async (brandId: number) => {
    return postRequest<BrandApiResponse<{ id: number; name: string; api_key: string }>>(
      `brand/${brandId}/regenerate-api-key`,
      {}
    );
  },

  // Get pending brands (for approval workflow)
  getPendingBrands: async (params?: {
    page?: number;
    limit?: number;
  }) => {
    const queryString = buildQueryString({
      ...params,
      status: 'pending'
    });
    return getRequest<BrandApiResponse<BrandsResponse>>(
      `brand${queryString}`
    );
  },

  // Get brands by status
  getBrandsByStatus: async (status: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    const queryString = buildQueryString({
      ...params,
      status
    });
    return getRequest<BrandApiResponse<BrandsResponse>>(
      `brand${queryString}`
    );
  }
};

export default BrandAPI;
