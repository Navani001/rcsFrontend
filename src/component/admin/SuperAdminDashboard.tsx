"use client";
import React, { useState, useEffect } from "react";
import { Button, Chip, Progress, Card, CardBody, CardHeader } from "@heroui/react";
import { 
  MdBusiness, 
  MdCampaign, 
  MdMessage, 
  MdAttachMoney,
  MdTrendingUp,
  MdTrendingDown,
  MdWarning,
  MdCheckCircle,
  MdError,
  MdRefresh,
  MdDownload,
  MdVisibility,
  MdSecurity,
  MdCloudDone,
  MdCreditCard
} from "react-icons/md";
import Link from "next/link";

// Mock data - replace with actual API calls
const mockPlatformStats = {
  totalClients: 127,
  activeClients: 118,
  pendingApprovals: 9,
  totalRevenue: 45280.50,
  monthlyGrowth: 12.3,
  totalCampaigns: 1247,
  activeCampaigns: 89,
  totalMessages: 89450,
  messageSuccessRate: 98.7,
  systemUptime: 99.9,
  activeAlerts: 3,
  criticalAlerts: 0
};

const mockRecentActivities = [
  { id: 1, type: 'approval', message: 'New brand registration pending approval', brand: 'TechCorp Solutions', time: '5 min ago', priority: 'high' },
  { id: 2, type: 'payment', message: 'Payment failed for client subscription', brand: 'Digital Marketing Inc', time: '12 min ago', priority: 'critical' },
  { id: 3, type: 'campaign', message: 'Large campaign launched successfully', brand: 'E-commerce Giant', time: '25 min ago', priority: 'normal' },
  { id: 4, type: 'system', message: 'API response time spike detected', brand: 'System Alert', time: '1 hour ago', priority: 'medium' },
  { id: 5, type: 'approval', message: 'Brand verification completed', brand: 'FinTech Startup', time: '2 hours ago', priority: 'normal' }
];

const mockTopClients = [
  { id: 1, name: 'E-commerce Giant', messagesThisMonth: 15420, revenue: 2340.50, growth: 18.5 },
  { id: 2, name: 'Banking Corp', messagesThisMonth: 12890, revenue: 1980.25, growth: 12.3 },
  { id: 3, name: 'Retail Chain', messagesThisMonth: 9870, revenue: 1560.75, growth: -2.1 },
  { id: 4, name: 'Tech Solutions', messagesThisMonth: 8540, revenue: 1320.00, growth: 8.7 },
  { id: 5, name: 'Healthcare Plus', messagesThisMonth: 7650, revenue: 1180.50, growth: 15.2 }
];

export const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(mockPlatformStats);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refreshData = async () => {
    setIsLoading(true);
    // TODO: Replace with actual API calls
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Platform Overview
          </h1>
          <p className="text-lg text-gray-600">
            Monitor and manage your RCS messaging platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button
            variant="flat"
            size="sm"
            startContent={<MdRefresh />}
            onClick={refreshData}
            isLoading={isLoading}
            className="bg-blue-100 text-blue-700"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {stats.criticalAlerts > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <div className="flex items-center">
            <MdError className="text-blue-500 text-xl mr-3" />
            <div>
              <h3 className="text-blue-800 font-medium">Critical System Alert</h3>
              <p className="text-blue-700 text-sm">
                {stats.criticalAlerts} critical issue(s) require immediate attention
              </p>
            </div>
            <Link href="/admin/alerts" className="ml-auto">
              <Button size="sm" color="danger">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Clients */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MdBusiness className="text-2xl text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
              <div className="flex items-center gap-2 mt-1">
                <Chip color="success" variant="flat" size="sm">
                  {stats.activeClients} active
                </Chip>
                <Chip color="warning" variant="flat" size="sm">
                  {stats.pendingApprovals} pending
                </Chip>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <MdAttachMoney className="text-2xl text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <MdTrendingUp className="text-green-600" />
                <span className="text-sm text-green-600">+{stats.monthlyGrowth}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <MdCampaign className="text-2xl text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCampaigns}</p>
              <div className="mt-1">
                <Chip color="primary" variant="flat" size="sm">
                  {stats.activeCampaigns} running now
                </Chip>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <MdCloudDone className="text-2xl text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">System Health</p>
              <p className="text-2xl font-bold text-gray-900">{stats.systemUptime}%</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message Analytics */}
        <Card>
          <CardHeader className="flex gap-3">
            <MdMessage className="text-blue-500 text-xl" />
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Message Analytics</p>
              <p className="text-sm text-gray-500">Platform-wide messaging stats</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Messages Sent</span>
                <span className="font-semibold">{stats.totalMessages.toLocaleString()}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="text-green-600">{stats.messageSuccessRate}%</span>
                </div>
                <Progress 
                  value={stats.messageSuccessRate} 
                  maxValue={100}
                  color="success"
                  size="sm"
                />
              </div>
              <div className="pt-2 border-t">
                <Link href="/admin/analytics">
                  <Button size="sm" variant="flat" className="w-full">
                    View Detailed Analytics
                  </Button>
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader className="flex gap-3">
            <MdSecurity className="text-purple-500 text-xl" />
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Recent Activities</p>
              <p className="text-sm text-gray-500">Platform events & alerts</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {mockRecentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
                  <div className={`p-1 rounded-full ${
                    activity.priority === 'critical' ? 'bg-blue-100' :
                    activity.priority === 'high' ? 'bg-orange-100' :
                    activity.priority === 'medium' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    {activity.type === 'approval' && <MdCheckCircle className="text-green-600 text-sm" />}
                    {activity.type === 'payment' && <MdAttachMoney className="text-blue-600 text-sm" />}
                    {activity.type === 'campaign' && <MdCampaign className="text-blue-600 text-sm" />}
                    {activity.type === 'system' && <MdWarning className="text-orange-600 text-sm" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.message}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">{activity.brand}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t mt-3">
              <Link href="/admin/activities">
                <Button size="sm" variant="flat" className="w-full">
                  View All Activities
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Top Performing Clients */}
      <Card>
        <CardHeader className="flex gap-3">
          <MdTrendingUp className="text-green-500 text-xl" />
          <div className="flex flex-col">
            <p className="text-lg font-semibold">Top Performing Clients</p>
            <p className="text-sm text-gray-500">Highest revenue generators this month</p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Client</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Messages</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Revenue</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Growth</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockTopClients.map((client, index) => (
                  <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <span className="font-medium text-gray-900">{client.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-600">
                      {client.messagesThisMonth.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-600">
                      ${client.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <div className={`flex items-center gap-1 ${client.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {client.growth >= 0 ? <MdTrendingUp /> : <MdTrendingDown />}
                        <span className="text-sm">{Math.abs(client.growth)}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <Button size="sm" variant="flat" startContent={<MdVisibility />}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardBody className="text-center p-6">
            <MdBusiness className="text-3xl text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Clients</h3>
            <p className="text-sm text-gray-600 mb-4">
              View, approve, and manage all business accounts on the platform
            </p>
            <Link href="/admin/customers">
              <Button color="primary" className="w-full">
                Access Client Management
              </Button>
            </Link>
          </CardBody>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardBody className="text-center p-6">
            <MdCreditCard className="text-3xl text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Billing Center</h3>
            <p className="text-sm text-gray-600 mb-4">
              Manage subscription plans, payments, and revenue analytics
            </p>
            <Link href="/admin/subscriptions">
              <Button color="success" className="w-full">
                Open Billing Center
              </Button>
            </Link>
          </CardBody>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardBody className="text-center p-6">
            <MdSecurity className="text-3xl text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">System Monitor</h3>
            <p className="text-sm text-gray-600 mb-4">
              Monitor system health, performance, and security alerts
            </p>
            <Link href="/admin/system">
              <Button color="primary" className="w-full">
                View System Status
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
