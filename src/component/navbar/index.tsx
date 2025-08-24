"use client";
import React, { useState } from "react";
import { 
  MdDashboard, 
  MdCampaign, 
  MdMessage, 
  MdAnalytics, 
  MdGroup, 
  MdSettings,
  MdBusinessCenter,
  MdCreditCard,
  MdBrandingWatermark
} from "react-icons/md";
import { usePathname } from "next/navigation";
import Link from "next/link";
import BrandSubscriptionPopup from "../subscription/BrandSubscriptionPopup";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: MdDashboard,
  },
  {
    name: "Campaigns",
    href: "/campaigns",
    icon: MdCampaign,
  },
  // {
  //   name: "Messages",
  //   href: "/messages",
  //   icon: MdMessage,
  // },
  {
    name: "Templates",
    href: "/templates",
    icon: MdMessage,
  },
  // {
  //   name: "Analytics",
  //   href: "/analytics",
  //   icon: MdAnalytics,
  // },
  {
    name: "Audience",
    href: "/audience",
    icon: MdGroup,
  },
  
  // Brand Plans will be handled as a popup, so we remove it from navigation
  // {
  //   name: "Brand Plans",
  //   href: "/brand-subscription",
  //   icon: MdBrandingWatermark,
  // },
  // {
  //   name: "Brand Management",
  //   href: "/brands",
  //   icon: MdBusinessCenter,
  // },
  // {
  //   name: "Settings",
  //   href: "/settings",
  //   icon: MdSettings,
  // },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);

  return (
    <>
      <nav className="bg-white border-r border-gray-200 h-screen w-64 fixed left-0 top-16 overflow-y-auto z-40">
        <div className="p-4">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon className={`text-lg ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                  {item.name}
                </Link>
              );
            })}
            
            {/* Brand Plans as clickable item */}
           
          </div>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                href="/campaigns/create"
                className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <MdCampaign className="text-lg" />
                New Campaign
              </Link>
              <Link
                href="/templates/create"
                className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <MdMessage className="text-lg" />
                Create Template
              </Link>
              {/* Add Brand Subscription as quick action */}
            
            </div>
          </div>
        </div>
      </nav>
      
      {/* Brand Subscription Popup */}
      <BrandSubscriptionPopup 
        isOpen={showSubscriptionPopup}
        onClose={() => setShowSubscriptionPopup(false)}
      />
    </>
  );
};

export default Navbar;
