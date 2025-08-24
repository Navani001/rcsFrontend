"use client";
import React, { useState, useEffect } from "react";
import { 
  MdCheck, 
  MdClose, 
  MdStar, 
  MdTrendingUp,
  MdCampaign,
  MdMessage,
  MdAnalytics,
  MdSupport,
  MdSecurity,
  MdCloud
} from "react-icons/md";
import { subscriptionAPI, brandSubscriptionAPI } from "@/utils/subscriptionAPI";

interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  currency: string;
  billing_cycle: string;
  features: {
    features?: string[];
    limitations?: string[];
    [key: string]: any;
  };
  status: string;
  created_at: string;
  updated_at: string;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  billing: string;
  description: string;
  features: string[];
  limitations?: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant: "primary" | "secondary";
}

const SubscriptionPage = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plansResponse, subscriptionResponse] = await Promise.all([
        subscriptionAPI.getPlans(),
        brandSubscriptionAPI.getCurrentSubscription().catch(() => ({ data: null }))
      ]);

      if (plansResponse.success) {
        setPlans(plansResponse.data);
      }

      if (subscriptionResponse.data) {
        setCurrentSubscription(subscriptionResponse.data);
      }
    } catch (err: any) {
      setError('Failed to load subscription data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const convertToPricingPlan = (plan: SubscriptionPlan): PricingPlan => {
    const features = plan.features?.features || [];
    const limitations = plan.features?.limitations || [];
    
    return {
      id: plan.id.toString(),
      name: plan.name,
      price: plan.price,
      billing: plan.billing_cycle === 'forever' ? 'Forever' : `per ${plan.billing_cycle}`,
      description: plan.name === 'Free Starter' 
        ? 'Perfect for getting started with basic messaging campaigns'
        : 'Advanced features for growing businesses and marketing teams',
      features,
      limitations,
      popular: plan.name === 'Premium Pro',
      buttonText: plan.price === 0 ? 'Get Started Free' : 'Start Premium Trial',
      buttonVariant: plan.price === 0 ? 'secondary' : 'primary'
    };
  };

  const handlePlanSelection = async (planId: string) => {
    setSelectedPlan(planId);
    setIsProcessing(true);
    
    try {
      const plan = plans.find(p => p.id.toString() === planId);
      if (!plan) throw new Error('Plan not found');

      if (plan.price === 0) {
        // Free plan - direct subscription
        const response = await brandSubscriptionAPI.subscribeToPlan(plan.id);
        if (response.success) {
          alert("Free plan activated! Welcome to RCS Backend!");
          await fetchData(); // Refresh data
        }
      } else {
        // Paid plan - would typically redirect to payment gateway
        // For now, simulate payment process
        const response = await brandSubscriptionAPI.subscribeToPlan(plan.id);
        if (response.success) {
          alert("Subscription successful! Welcome to Premium!");
          await fetchData(); // Refresh data
        }
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const pricingPlans = plans.map(convertToPricingPlan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Scale your messaging campaigns with powerful RCS technology. 
            Start free and upgrade as you grow.
          </p>

          {/* Current Subscription Alert */}
          {currentSubscription && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg max-w-2xl mx-auto mb-8">
              <p>
                <strong>Current Plan:</strong> {currentSubscription.plan?.name} 
                {currentSubscription.status === 'active' && ' (Active)'}
              </p>
              {currentSubscription.end_date && (
                <p className="text-sm">
                  Next billing: {new Date(currentSubscription.end_date).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
          
          {/* Features Highlight */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-700">
              <MdSecurity className="text-green-600" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <MdCloud className="text-blue-600" />
              <span>Cloud Infrastructure</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <MdSupport className="text-purple-600" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => {
            const isCurrentPlan = currentSubscription?.plan?.id.toString() === plan.id;
            
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-2xl ${
                  plan.popular
                    ? "border-blue-500 shadow-xl scale-105 bg-white"
                    : "border-gray-200 bg-white hover:border-blue-300"
                } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                      <MdStar className="text-yellow-300" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4">
                    <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Current Plan
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600">/{plan.billing}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePlanSelection(plan.id)}
                    disabled={isCurrentPlan || (isProcessing && selectedPlan === plan.id)}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                      isCurrentPlan 
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : plan.buttonVariant === "primary"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300"
                    } ${
                      isProcessing && selectedPlan === plan.id
                        ? "opacity-50 cursor-not-allowed"
                        : !isCurrentPlan ? "hover:scale-105" : ""
                    }`}
                  >
                    {isCurrentPlan ? (
                      "Current Plan"
                    ) : isProcessing && selectedPlan === plan.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      plan.buttonText
                    )}
                  </button>
                </div>

                {/* Features List */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <MdCheck className="text-green-600" />
                    What's included:
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <MdCheck className="text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Limitations */}
                  {plan.limitations && plan.limitations.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <h4 className="font-semibold text-gray-500 flex items-center gap-2 mb-3">
                        <MdClose className="text-gray-400" />
                        Not included:
                      </h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <MdClose className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-500 text-sm">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Features Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features for Every Plan
            </h2>
            <p className="text-lg text-gray-600">
              Get access to enterprise-grade messaging infrastructure
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdCampaign className="text-2xl text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Campaign Management</h3>
              <p className="text-gray-600 text-sm">Create, schedule, and manage sophisticated messaging campaigns</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdMessage className="text-2xl text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Rich Messaging</h3>
              <p className="text-gray-600 text-sm">Send interactive messages with media, buttons, and carousels</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdAnalytics className="text-2xl text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600 text-sm">Track performance with detailed insights and reporting</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdTrendingUp className="text-2xl text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Growth Tools</h3>
              <p className="text-gray-600 text-sm">Scale your messaging with automation and optimization</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-3">Can I change plans anytime?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-3">Is there a free trial?</h3>
              <p className="text-gray-600">Yes! Start with our free plan and upgrade to Premium for a 14-day free trial.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers for enterprise plans.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-3">Do you offer refunds?</h3>
              <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee for all paid plans.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
