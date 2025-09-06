"use client";
import React from "react";
import { 
  MdDashboard, 
  MdBusiness, 
  MdCreditCard, 
  MdAnalytics, 
  MdCampaign,
  MdSecurity,
  MdMessage,
  MdSettings,
  MdPeople,
  MdNotifications,
  MdMonitor,
  MdSupport,
  MdVerifiedUser,
  MdPayment,
  MdApi,
  MdCloudQueue,
  MdTrendingUp,
  MdError
} from "react-icons/md";
import { usePathname } from "next/navigation";
import Link from "next/link";

const superAdminNavigationItems = [
  {
    name: "Overview",
    href: "/admin/dashboard",
    icon: MdDashboard,
    description: "Platform overview & metrics"
  },
  {
    name: "Customer Management",
    href: "/admin/customers",
    icon: MdBusiness,
    description: "All business accounts"
  },
  {
    name: "Subscription & Billing",
    href: "/admin/subscriptions",
    icon: MdCreditCard,
    description: "Plans & payments"
  },
  {
    name: "Campaign Oversight",
    href: "/admin/campaigns",
    icon: MdCampaign,
    description: "Monitor all campaigns"
  },
  {
    name: "Platform Analytics",
    href: "/admin/analytics",
    icon: MdAnalytics,
    description: "Revenue & usage insights"
  },
  // {
  //   name: "Message Gateway",
  //   href: "/admin/gateway",
  //   icon: MdMessage,
  //   description: "RCS API management"
  // },
  // {
  //   name: "System Health",
  //   href: "/admin/system",
  //   icon: MdMonitor,
  //   description: "Uptime & performance"
  // },
  {
    name: "Admin Roles",
    href: "/admin/roles",
    icon: MdPeople,
    description: "Team access control"
  }
];

const quickActions = [
  {
    name: "Approve Brand",
    href: "/admin/approvals",
    icon: MdVerifiedUser,
    color: "text-green-600"
  },
  // {
  //   name: "System Alerts",
  //   href: "/admin/alerts",
  //   icon: MdError,
  //   color: "text-red-600"
  // },
  {
    name: "Revenue Report",
    href: "/admin/reports",
    icon: MdTrendingUp,
    color: "text-blue-600"
  },
  //  
];

export const SuperAdminNavbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-r border-gray-200 h-screen w-64 fixed left-0 top-16 overflow-y-auto z-40">
      <div className="p-4">
        {/* Platform Status */}
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-800">System Online</span>
          </div>
          <div className="text-xs text-green-600">
            99.9% uptime • 127 active clients
          </div>
        </div>

        {/* Main Navigation */}
        <div className="space-y-1 mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Platform Management
          </h3>
          {superAdminNavigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex flex-col gap-1 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-red-50 text-red-700 border-r-2 border-red-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`text-lg ${isActive ? "text-red-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                  {item.name}
                </div>
                <div className={`text-xs ml-6 ${isActive ? "text-red-600" : "text-gray-500"}`}>
                  {item.description}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.name}
                  href={action.href}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <Icon className={`text-lg ${action.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-gray-700">{action.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* System Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            System Info
          </h3>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Version:</span>
              <span className="font-mono">v2.1.4</span>
            </div>
            <div className="flex justify-between">
              <span>Environment:</span>
              <span className="px-1 bg-blue-100 text-blue-700 rounded">PROD</span>
            </div>
            <div className="flex justify-between">
              <span>Last Deploy:</span>
              <span>2h ago</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SuperAdminNavbar;
