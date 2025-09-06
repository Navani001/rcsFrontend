import { getRequest, patchRequest } from './axios';

// Types for the API response
export interface Campaign {
  id: number;
  name: string;
  campaign_type: string;
  status: string;
  start_time: string | null;
  end_time: string | null;
  created_at: string;
  updated_at: string;
  total_recipients: number;
  messages_sent: number;
  brand: {
    id: number;
    name: string;
    display_name: string;
    logo_url: string | null;
  };
  agent: {
    id: number;
    name: string;
    display_name: string;
  };
  template: {
    id: number;
    name: string;
    template_type: string;
    category: string;
  };
  _count: {
    targets: number;
    messages: number;
  };
}

export interface CampaignsResponse {
  success: boolean;
  message: string;
  data: {
    campaigns: Campaign[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface CampaignsQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  search?: string;
}

export class CampaignAPI {
  /**
   * Get all campaigns across all brands
   */
  static async getAllCampaigns(params?: CampaignsQueryParams) {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.search) queryParams.append('search', params.search);

    const url = `campaign/campaigns/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return await getRequest(url);
  }

  /**
   * Update campaign status
   */
  static async updateCampaignStatus(campaignId: number, status: string) {
    const url = `campaign/campaigns/${campaignId}/status`;
    
    return await patchRequest(url, { status });
  }
}
