"use client";
import React, { useState, useEffect } from "react";
import { 
  Button, 
  Chip, 
  Select, 
  SelectItem,
  Card,
  CardBody,
  CardHeader,
  Tab,
  Tabs
} from "@heroui/react";
import { 
  MdTrendingUp, 
  MdTrendingDown,
  MdAttachMoney,
  MdMessage,
  MdCampaign,
  MdBusiness,
  MdAnalytics,
  MdDownload,
  MdRefresh,
  MdDateRange,
  MdPieChart,
  MdBarChart,
  MdShowChart
} from "react-icons/md";

// Mock analytics data
const mockAnalyticsData = {
  revenue: {
    total: 45280.50,
    growth: 12.3,
    monthlyData: [
      { month: 'Jan', revenue: 32400, clients: 89 },
      { month: 'Feb', revenue: 35600, clients: 95 },
      { month: 'Mar', revenue: 38900, clients: 102 },
      { month: 'Apr', revenue: 41200, clients: 108 },
      { month: 'May', revenue: 43800, clients: 115 },
      { month: 'Jun', revenue: 45280, clients: 127 }
    ]
  },
  messaging: {
    totalMessages: 1847650,
    deliveryRate: 98.7,
    engagementRate: 24.3,
    clickThroughRate: 8.9,
    dailyVolume: [
      { date: '2024-09-01', messages: 45680, delivered: 45123 },
      { date: '2024-09-02', messages: 52340, delivered: 51678 },
      { date: '2024-09-03', messages: 48920, delivered: 48301 },
      { date: '2024-09-04', messages: 51230, delivered: 50564 }
    ]
  },
  clients: {
    totalClients: 127,
    activeClients: 118,
    growth: 8.5,
    byIndustry: [
      { industry: 'E-commerce', count: 34, revenue: 15420.30 },
      { industry: 'Healthcare', count: 28, revenue: 12680.50 },
      { industry: 'Finance', count: 22, revenue: 8940.25 },
      { industry: 'Technology', count: 20, revenue: 6830.75 },
      { industry: 'Marketing', count: 15, revenue: 1408.70 },
      { industry: 'Other', count: 8, revenue: 890.50 }
    ]
  },
  campaigns: {
    totalCampaigns: 1247,
    activeCampaigns: 89,
    avgSuccessRate: 87.4,
    topPerformers: [
      { type: 'Promotional', count: 456, successRate: 89.2 },
      { type: 'Transactional', count: 387, successRate: 96.8 },
      { type: 'Announcement', count: 234, successRate: 82.5 },
      { type: 'Reminder', count: 170, successRate: 91.3 }
    ]
  }
};

export const PlatformAnalytics = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("6months");
  const [data, setData] = useState(mockAnalyticsData);

  const handleRefresh = () => {
    // TODO: Implement real API call
    console.log("Refreshing analytics data...");
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Exporting analytics report...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Platform Analytics
          </h1>
          <p className="text-lg text-gray-600">
            Revenue insights, usage metrics, and performance analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            selectedKeys={[timeRange]}
            onSelectionChange={(keys) => setTimeRange(Array.from(keys)[0] as string)}
            className="w-40"
          >
            <SelectItem key="1month">Last Month</SelectItem>
            <SelectItem key="3months">Last 3 Months</SelectItem>
            <SelectItem key="6months">Last 6 Months</SelectItem>
            <SelectItem key="1year">Last Year</SelectItem>
          </Select>
          <Button
            variant="flat"
            size="sm"
            startContent={<MdDownload />}
            onClick={handleExport}
            className="bg-blue-100 text-blue-700"
          >
            Export Report
          </Button>
          <Button
            variant="flat"
            size="sm"
            startContent={<MdRefresh />}
            onClick={handleRefresh}
            className="bg-green-100 text-green-700"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <MdAttachMoney className="text-green-600 text-2xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${data.revenue.total.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <MdTrendingUp className="text-green-600 text-sm" />
                  <span className="text-sm text-green-600">+{data.revenue.growth}%</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MdMessage className="text-blue-600 text-2xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{data.messaging.totalMessages.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-blue-600">{data.messaging.deliveryRate}% delivered</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MdBusiness className="text-purple-600 text-2xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold text-gray-900">{data.clients.activeClients}</p>
                <div className="flex items-center gap-1 mt-1">
                  <MdTrendingUp className="text-green-600 text-sm" />
                  <span className="text-sm text-green-600">+{data.clients.growth}%</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <MdCampaign className="text-orange-600 text-2xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Campaign Success</p>
                <p className="text-2xl font-bold text-gray-900">{data.campaigns.avgSuccessRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-orange-600">{data.campaigns.activeCampaigns} active</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs 
        selectedKey={selectedTab} 
        onSelectionChange={(key) => setSelectedTab(key as string)}
        className="w-full"
      >
        <Tab key="overview" title="Revenue Overview">
          <div className="space-y-6">
            {/* Revenue Trend Chart Placeholder */}
            <Card>
              <CardHeader className="flex gap-3">
                <MdShowChart className="text-green-500 text-xl" />
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">Revenue Trend</p>
                  <p className="text-sm text-gray-500">Monthly revenue and client growth</p>
                </div>
              </CardHeader>
              <CardBody>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MdShowChart className="text-4xl text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Revenue Trend Chart</p>
                    <p className="text-sm text-gray-400">Chart integration coming soon</p>
                  </div>
                </div>
                
                {/* Revenue Data Table */}
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Month</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Revenue</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Clients</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">ARPU</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.revenue.monthlyData.map((month) => (
                        <tr key={month.month} className="border-b border-gray-100">
                          <td className="py-2 px-3 font-medium">{month.month}</td>
                          <td className="py-2 px-3">${month.revenue.toLocaleString()}</td>
                          <td className="py-2 px-3">{month.clients}</td>
                          <td className="py-2 px-3">${(month.revenue / month.clients).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>

        <Tab key="messaging" title="Message Analytics">
          <div className="space-y-6">
            {/* Message Volume Chart */}
            <Card>
              <CardHeader className="flex gap-3">
                <MdBarChart className="text-blue-500 text-xl" />
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">Message Volume & Delivery</p>
                  <p className="text-sm text-gray-500">Daily message statistics</p>
                </div>
              </CardHeader>
              <CardBody>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MdBarChart className="text-4xl text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Message Volume Chart</p>
                    <p className="text-sm text-gray-400">Chart integration coming soon</p>
                  </div>
                </div>

                {/* Messaging Stats Grid */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-700">{data.messaging.deliveryRate}%</p>
                    <p className="text-sm text-blue-600">Delivery Rate</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-700">{data.messaging.engagementRate}%</p>
                    <p className="text-sm text-green-600">Engagement Rate</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-700">{data.messaging.clickThroughRate}%</p>
                    <p className="text-sm text-purple-600">Click-Through Rate</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>

        <Tab key="clients" title="Client Analytics">
          <div className="space-y-6">
            {/* Client Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex gap-3">
                  <MdPieChart className="text-purple-500 text-xl" />
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold">Clients by Industry</p>
                    <p className="text-sm text-gray-500">Industry distribution</p>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    {data.clients.byIndustry.map((industry) => (
                      <div key={industry.industry} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-blue-500 rounded"></div>
                          <span className="font-medium">{industry.industry}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{industry.count} clients</p>
                          <p className="text-sm text-gray-500">${industry.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="flex gap-3">
                  <MdAnalytics className="text-green-500 text-xl" />
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold">Top Revenue Industries</p>
                    <p className="text-sm text-gray-500">Revenue by industry</p>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    {data.clients.byIndustry
                      .sort((a, b) => b.revenue - a.revenue)
                      .slice(0, 5)
                      .map((industry, index) => (
                        <div key={industry.industry} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-green-600">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{industry.industry}</p>
                            <p className="text-sm text-gray-500">{industry.count} clients</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">${industry.revenue.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </Tab>

        <Tab key="campaigns" title="Campaign Performance">
          <div className="space-y-6">
            {/* Campaign Type Performance */}
            <Card>
              <CardHeader className="flex gap-3">
                <MdCampaign className="text-orange-500 text-xl" />
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">Campaign Performance by Type</p>
                  <p className="text-sm text-gray-500">Success rates and volume</p>
                </div>
              </CardHeader>
              <CardBody>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Campaign Type</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Total Campaigns</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Success Rate</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.campaigns.topPerformers.map((type) => (
                        <tr key={type.type} className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium">{type.type}</td>
                          <td className="py-3 px-4">{type.count.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <Chip 
                              color={type.successRate >= 90 ? "success" : type.successRate >= 80 ? "warning" : "danger"} 
                              variant="flat" 
                              size="sm"
                            >
                              {type.successRate}%
                            </Chip>
                          </td>
                          <td className="py-3 px-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${type.successRate}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default PlatformAnalytics;
