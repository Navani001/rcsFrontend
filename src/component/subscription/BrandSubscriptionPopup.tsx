"use client";
import React, { useState, useEffect } from "react";
import { getRequest, postRequest } from "@/utils";
import { MdCheck, MdClose, MdStar, MdCreditCard } from "react-icons/md";
import { Modals } from "../modal";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  durationUnit: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

interface BrandSubscriptionPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const    BrandSubscriptionPopup = ({ isOpen, onClose }: BrandSubscriptionPopupProps) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  // Default plans in case API fails
  const defaultPlans: SubscriptionPlan[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      duration: 1,
      durationUnit: "month",
      description: "Perfect for getting started with basic features",
      features: [
        "Up to 5 campaigns per month",
        "Basic templates",
        "Email support",
        "Basic analytics",
        "Up to 100 contacts"
      ]
    },
    {
      id: "premium",
      name: "Premium",
      price: 29.99,
      duration: 1,
      durationUnit: "month",
      description: "Everything you need to grow your business",
      features: [
        "Unlimited campaigns",
        "Premium templates",
        "Priority support",
        "Advanced analytics",
        "Unlimited contacts",
        "Custom branding",
        "A/B testing",
        "Advanced automation"
      ],
      isPopular: true
    }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchSubscriptionPlans();
    }
  }, [isOpen]);

  const fetchSubscriptionPlans = async () => {
    try {
      setLoading(true);
      const response = await getRequest<SubscriptionPlan[]>("/subscription-plans/plans");
      
      if (response && Array.isArray(response)) {
        setPlans(response);
      } else if (response && (response as any).data) {
        setPlans((response as any).data);
      } else {
        // Fallback to default plans
        setPlans(defaultPlans);
      }
    } catch (error) {
      console.error("Failed to fetch subscription plans:", error);
      // Fallback to default plans
      setPlans(defaultPlans);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      setPurchasing(true);
      setSelectedPlan(planId);

      const plan = plans.find(p => p.id === planId);
      
      if (plan?.price === 0) {
        // Handle free plan
        const response = await postRequest("/brand-subscriptions/subscribe", {
          plan_id: planId,
          auto_renewal: true
        });
        
        alert("Successfully subscribed to free plan!");
        onClose();
      } else {
        // Handle premium plan - create payment first
        const paymentResponse = await postRequest("/brand-subscriptions/payment", {
          plan_id: planId,
          amount: plan?.price,
          currency: "USD",
          payment_method: "card"
        });
        
        // Here you would integrate with Stripe, PayPal, etc.
        // For now, we'll simulate a successful payment
        setTimeout(async () => {
          try {
            await postRequest("/brand-subscriptions/subscribe", {
              plan_id: planId,
              auto_renewal: true
            });
            alert("Payment successful! Subscription activated.");
            onClose();
          } catch (error) {
            alert("Payment successful but subscription activation failed. Please contact support.");
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Subscription failed:", error);
      alert("Subscription failed. Please try again.");
    } finally {
      setPurchasing(false);
      setSelectedPlan(null);
    }
  };

  const PopupContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return (
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Choose Your Brand Plan
          </h1>
          <p className="text-lg text-gray-600">
            Unlock powerful features to grow your brand and reach more customers
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 border-2 ${
                plan.isPopular 
                  ? "border-blue-500 scale-105" 
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-bl-lg">
                  <div className="flex items-center gap-1">
                    <MdStar className="text-sm" />
                    <span className="text-xs font-semibold">Most Popular</span>
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-3">
                    <span className="text-3xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600 ml-1">
                      / {plan.duration} {plan.durationUnit}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <ul className="space-y-2">
                    {plan.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <MdCheck className="text-green-500 text-lg mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                    {plan.features.length > 4 && (
                      <li className="text-xs text-gray-500 pl-6">
                        +{plan.features.length - 4} more features
                      </li>
                    )}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={purchasing && selectedPlan === plan.id}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    plan.price === 0
                      ? "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
                      : plan.isPopular
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  } ${
                    purchasing && selectedPlan === plan.id
                      ? "opacity-75 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {purchasing && selectedPlan === plan.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <MdCreditCard className="text-lg" />
                      {plan.price === 0 ? "Get Started Free" : "Subscribe Now"}
                    </>
                  )}
                </button>

                {plan.price > 0 && (
                  <p className="text-center text-xs text-gray-500 mt-2">
                    30-day money-back guarantee
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick FAQ */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-center text-gray-900 mb-4">
            Quick FAQ
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium mb-1">Can I upgrade anytime?</h4>
              <p className="text-gray-600 text-xs">
                Yes, upgrade or downgrade instantly.
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium mb-1">Free trial available?</h4>
              <p className="text-gray-600 text-xs">
                Free plan available forever, no card required.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modals
      isopen={isOpen}
      onClose={onClose}
      size="xl"
      modalClassName="max-w-4xl"
      bodyClassName="p-6"
      ModalContents={<PopupContent />}
    />
  );
};

export default BrandSubscriptionPopup;
