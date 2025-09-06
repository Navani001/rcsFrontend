import { getRequest, postRequest, putRequest, patchRequest, deleteRequest } from './axios';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  brand?: {
    id: number;
    name: string;
  };
}

export interface AdminRole {
  id: number;
  name: string;
  code: string;
  description: string;
  permissions?: string[];
}

export interface AdminPermission {
  id: number;
  name: string;
  code: string;
  category: string;
}

export interface AdminStats {
  totalAdmins: number;
  activeUsers: number;
  superAdmins: number;
  roleTemplates: number;
  totalBrands: number;
  totalCampaigns: number;
  totalSubscriptions: number;
  recentActivity: number;
  roleDistribution: Array<{
    role: string;
    count: number;
  }>;
  period: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export interface ApiResponse<T> {
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

// Admin API functions using the existing request utilities
export const adminAPI = {
  // Get all admin users with optional filters
  getAdminUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }) => {
    const queryString = buildQueryString(params);
    return getRequest<ApiResponse<{ adminUsers: AdminUser[]; total: number; page: number; limit: number }>>(
      `userSub/admin/users${queryString}`
    );
  },

  // Create a new admin user
  createAdminUser: async (userData: {
    name: string;
    email: string;
    role: string;
  }) => {
    return postRequest<ApiResponse<AdminUser>>(
      'userSub/admin/users',
      userData
    );
  },

  // Update an existing admin user
  updateAdminUser: async (userId: number, userData: {
    name?: string;
    email?: string;
    role?: string;
  }) => {
    return putRequest<ApiResponse<AdminUser>>(
      `userSub/admin/users/${userId}`,
      userData
    );
  },

  // Toggle user status
  toggleUserStatus: async (userId: number, status: 'active' | 'inactive') => {
    return patchRequest<ApiResponse<AdminUser>>(
      `userSub/admin/users/${userId}/status`,
      { status }
    );
  },

  // Delete an admin user
  deleteAdminUser: async (userId: number) => {
    return deleteRequest<ApiResponse<{ id: number }>>(
      `userSub/admin/users/${userId}`,
      {}
    );
  },

  // Get available roles
  getRoles: async (includePermissions: boolean = true) => {
    return getRequest<ApiResponse<AdminRole[]>>(
      `userSub/admin/roles?includePermissions=${includePermissions}`
    );
  },

  // Get permissions grouped by category
  getPermissions: async (params?: {
    category?: string;
    grouped?: boolean;
  }) => {
    const queryString = buildQueryString(params);
    return getRequest<ApiResponse<AdminPermission[] | Array<{ category: string; permissions: AdminPermission[] }>>>(
      `userSub/admin/permissions${queryString}`
    );
  },

  // Get admin dashboard statistics
  getAdminStats: async (period: string = 'month') => {
    return getRequest<ApiResponse<AdminStats>>(
      `userSub/admin/stats?period=${period}`
    );
  }
};

export default adminAPI;
