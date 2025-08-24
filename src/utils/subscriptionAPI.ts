import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Subscription Plans API
export const subscriptionAPI = {
  // Get all subscription plans
  getPlans: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscription/plans`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw error;
    }
  },

  // Get specific plan by ID
  getPlan: async (planId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscription/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription plan:', error);
      throw error;
    }
  }
};

// Brand Subscription API
export const brandSubscriptionAPI = {
  // Subscribe to a plan
  subscribeToPlan: async (planId: number, autoRenewal: boolean = true) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/brand-subscription/subscribe`,
        { plan_id: planId, auto_renewal: autoRenewal },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      throw error;
    }
  },

  // Get current subscription
  getCurrentSubscription: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/brand-subscription/current`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching current subscription:', error);
      throw error;
    }
  },

  // Get subscription history
  getSubscriptionHistory: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/brand-subscription/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription history:', error);
      throw error;
    }
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId: number, reason?: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/brand-subscription/${subscriptionId}/cancel`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  },

  // Change subscription plan
  changePlan: async (subscriptionId: number, newPlanId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/brand-subscription/${subscriptionId}/change-plan`,
        { new_plan_id: newPlanId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error changing subscription plan:', error);
      throw error;
    }
  },

  // Create payment
  createPayment: async (paymentData: {
    subscription_id: number;
    plan_id: number;
    amount: number;
    currency?: string;
    payment_method?: string;
    gateway_provider?: string;
    customer_email?: string;
    customer_phone?: string;
    description?: string;
  }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/brand-subscription/payments`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  // Get payment history
  getPaymentHistory: async (page?: number, limit?: number, status?: string) => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());
      if (status) params.append('status', status);

      const response = await axios.get(
        `${API_BASE_URL}/brand-subscription/payments?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  },

  // Check subscription status
  checkSubscriptionStatus: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/brand-subscription/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      throw error;
    }
  }
};

export default {
  subscription: subscriptionAPI,
  brandSubscription: brandSubscriptionAPI
};
