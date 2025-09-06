"use client";
import React, { useState, useEffect } from "react";
import { 
  Button, 
  Chip, 
  Input, 
  Select, 
  SelectItem,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Pagination,
  Progress,
  Spinner
} from "@heroui/react";
import { 
  MdCampaign, 
  MdStop, 
  MdPause,
  MdPlayArrow,
  MdVisibility,
  MdSearch,
  MdFilter,
  MdDownload,
  MdRefresh,
  MdWarning,
  MdCheckCircle,
  MdError,
  MdSchedule,
  MdMessage,
  MdPeople,
  MdAnalytics,
  MdBusiness,
  MdFlag
} from "react-icons/md";
import { CampaignAPI, Campaign, type CampaignsResponse } from "@/utils";

const statusColors = {
  draft: "default",
  scheduled: "primary", 
  active: "success",
  running: "success",
  paused: "warning",
  completed: "default",
  suspended: "danger",
  failed: "danger"
} as const;

const priorityColors = {
  low: "default",
  medium: "primary",
  high: "warning",
  critical: "danger"
} as const;

// Map API status to display status
const mapApiStatus = (apiStatus: string): string => {
  const statusMap: Record<string, string> = {
    'draft': 'scheduled',
    'active': 'running',
    'paused': 'paused',
    'completed': 'completed',
    'suspended': 'suspended',
    'failed': 'failed'
  };
  return statusMap[apiStatus] || apiStatus;
};

// Calculate priority based on campaign metrics (since API doesn't provide it)
const calculatePriority = (campaign: Campaign): string => {
  const messageRate = campaign.total_recipients > 0 ? (campaign.messages_sent / campaign.total_recipients) : 0;
  
  if (campaign.status === 'suspended' || campaign.status === 'failed') {
    return 'critical';
  }
  
  if (campaign.total_recipients > 10000) {
    return 'high';
  }
  
  if (campaign.total_recipients > 1000) {
    return 'medium';
  }
  
  return 'low';
};

export const CampaignOversight = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Fetch campaigns from API
  const fetchCampaigns = async (page = 1, search = "", status = "all") => {
    setLoading(true);
    setError(null);
    try {
      const response = await CampaignAPI.getAllCampaigns({
        page,
        limit: itemsPerPage,
        search: search || undefined,
        status: status !== "all" ? status : undefined
      }) as any;

      if (response.success) {
        setCampaigns(response.data.campaigns);
        setTotalCampaigns(response.data.total);
        setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      } else {
        setError("Failed to fetch campaigns");
      }
    } catch (err: any) {
      console.error("Error fetching campaigns:", err);
      setError("Failed to fetch campaigns: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns(currentPage, searchTerm, statusFilter);
  }, [currentPage, statusFilter]);

  // Handle search with debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setCurrentPage(1);
      fetchCampaigns(1, searchTerm, statusFilter);
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    onOpen();
  };

  const handleRefresh = () => {
    fetchCampaigns(currentPage, searchTerm, statusFilter);
  };

  const handlePauseCampaign = async (campaignId: number) => {
    try {
      await CampaignAPI.updateCampaignStatus(campaignId, 'paused');
      // Refresh campaigns after status update
      fetchCampaigns(currentPage, searchTerm, statusFilter);
    } catch (error) {
      console.error('Error pausing campaign:', error);
      setError('Failed to pause campaign');
    }
  };

  const handleResumeCampaign = async (campaignId: number) => {
    try {
      await CampaignAPI.updateCampaignStatus(campaignId, 'active');
      // Refresh campaigns after status update
      fetchCampaigns(currentPage, searchTerm, statusFilter);
    } catch (error) {
      console.error('Error resuming campaign:', error);
      setError('Failed to resume campaign');
    }
  };

  const handleSuspendCampaign = async (campaignId: number) => {
    try {
      await CampaignAPI.updateCampaignStatus(campaignId, 'suspended');
      // Refresh campaigns after status update
      fetchCampaigns(currentPage, searchTerm, statusFilter);
    } catch (error) {
      console.error('Error suspending campaign:', error);
      setError('Failed to suspend campaign');
    }
  };

  const getStatusIcon = (status: string) => {
    const mappedStatus = mapApiStatus(status);
    switch (mappedStatus) {
      case 'running': return <MdPlayArrow className="text-green-600" />;
      case 'paused': return <MdPause className="text-yellow-600" />;
      case 'scheduled': return <MdSchedule className="text-blue-600" />;
      case 'completed': return <MdCheckCircle className="text-gray-600" />;
      case 'suspended': return <MdStop className="text-red-600" />;
      case 'failed': return <MdError className="text-red-600" />;
      default: return <MdCampaign className="text-gray-600" />;
    }
  };

  // Calculate statistics
  const stats = {
    total: totalCampaigns,
    running: campaigns.filter(c => c.status === 'active').length,
    flagged: campaigns.filter(c => c.status === 'suspended').length, // Treat suspended as flagged
    totalMessages: campaigns.reduce((sum, c) => sum + c.messages_sent, 0),
    averageEngagement: campaigns.length > 0 ? campaigns.reduce((sum, c) => {
      // Calculate a simple engagement rate based on messages sent vs targets
      const rate = c.total_recipients > 0 ? (c.messages_sent / c.total_recipients) * 100 : 0;
      return sum + rate;
    }, 0) / campaigns.length : 0
  };

  // Filter campaigns for priority filter (client-side since API doesn't support it)
  const filteredCampaigns = priorityFilter === "all" 
    ? campaigns 
    : campaigns.filter(campaign => calculatePriority(campaign) === priorityFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Campaign Oversight
          </h1>
          <p className="text-lg text-gray-600">
            Monitor and manage all client campaigns across the platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="flat"
            size="sm"
            startContent={<MdDownload />}
            className="bg-blue-100 text-blue-700"
            isDisabled={loading}
          >
            Export Report
          </Button>
          <Button
            variant="flat"
            size="sm"
            startContent={<MdRefresh />}
            className="bg-green-100 text-green-700"
            onPress={handleRefresh}
            isLoading={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card>
          <CardBody>
            <div className="flex items-center gap-3 text-red-600">
              <MdError />
              <span>{error}</span>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Alert Banner for Flagged Campaigns */}
      {stats.flagged > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <MdWarning className="text-red-500 text-xl mr-3" />
            <div>
              <h3 className="text-red-800 font-medium">Flagged Campaigns Alert</h3>
              <p className="text-red-700 text-sm">
                {stats.flagged} campaign(s) have been flagged for policy violations and require review
              </p>
            </div>
            <Button size="sm" color="danger" className="ml-auto">
              Review Flagged
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MdCampaign className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Campaigns</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MdPlayArrow className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.running}</p>
                <p className="text-sm text-gray-600">Currently Running</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <MdFlag className="text-red-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.flagged}</p>
                <p className="text-sm text-gray-600">Flagged</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MdMessage className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMessages.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Messages</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MdAnalytics className="text-orange-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.averageEngagement.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Avg Progress</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Search campaigns, brands, or types..."
                startContent={<MdSearch className="text-gray-400" />}
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="w-full"
              />
            </div>
            <Select
              placeholder="All Statuses"
              selectedKeys={[statusFilter]}
              onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
              className="w-48"
            >
              <SelectItem key="all">All Statuses</SelectItem>
              <SelectItem key="draft">Draft</SelectItem>
              <SelectItem key="active">Active</SelectItem>
              <SelectItem key="paused">Paused</SelectItem>
              <SelectItem key="completed">Completed</SelectItem>
              <SelectItem key="suspended">Suspended</SelectItem>
            </Select>
            <Select
              placeholder="All Priorities"
              selectedKeys={[priorityFilter]}
              onSelectionChange={(keys) => setPriorityFilter(Array.from(keys)[0] as string)}
              className="w-48"
            >
              <SelectItem key="all">All Priorities</SelectItem>
              <SelectItem key="low">Low</SelectItem>
              <SelectItem key="medium">Medium</SelectItem>
              <SelectItem key="high">High</SelectItem>
              <SelectItem key="critical">Critical</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <h3 className="text-lg font-semibold">Campaign Monitor ({totalCampaigns})</h3>
            {loading && <Spinner size="sm" />}
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Campaign</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Brand</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Performance</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Progress</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => {
                  const displayStatus = mapApiStatus(campaign.status);
                  const priority = calculatePriority(campaign);
                  const progressPercentage = campaign.total_recipients > 0 
                    ? (campaign.messages_sent / campaign.total_recipients) * 100 
                    : 0;
                  
                  return (
                    <tr 
                      key={campaign.id} 
                      className={`border-b border-gray-100 hover:bg-gray-50 ${
                        campaign.status === 'suspended' ? 'bg-red-50' : ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(campaign.status)}
                            {campaign.status === 'suspended' && <MdFlag className="text-red-500" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{campaign.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Chip color={priorityColors[priority as keyof typeof priorityColors]} variant="flat" size="sm">
                                {priority}
                              </Chip>
                              <span className="text-xs text-gray-500 capitalize">{campaign.campaign_type}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <MdBusiness className="text-gray-400" />
                          <div>
                            <span className="font-medium text-gray-900">
                              {campaign.brand.display_name || campaign.brand.name}
                            </span>
                            <p className="text-xs text-gray-500">ID: {campaign.brand.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Chip 
                          color={statusColors[displayStatus as keyof typeof statusColors] || "default"} 
                          variant="flat" 
                          size="sm"
                        >
                          {displayStatus}
                        </Chip>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <MdMessage className="text-gray-400 text-xs" />
                            <span>{campaign.messages_sent.toLocaleString()} / {campaign.total_recipients.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600">Template:</span>
                            <span className="font-medium">{campaign.template.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600">Agent:</span>
                            <span className="font-medium">{campaign.agent.display_name || campaign.agent.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">
                            Messages: {progressPercentage.toFixed(1)}%
                          </div>
                          <Progress 
                            value={progressPercentage} 
                            maxValue={100}
                            color="primary"
                            size="sm"
                          />
                          <div className="text-sm text-gray-500">
                            Created: {new Date(campaign.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="flat"
                            startContent={<MdVisibility />}
                            onPress={() => handleViewCampaign(campaign)}
                          >
                            View
                          </Button>
                          {campaign.status === 'active' && (
                            <Button
                              size="sm"
                              color="warning"
                              variant="flat"
                              startContent={<MdPause />}
                              onPress={() => handlePauseCampaign(campaign.id)}
                            >
                              Pause
                            </Button>
                          )}
                          {campaign.status === 'paused' && (
                            <Button
                              size="sm"
                              color="success"
                              variant="flat"
                              startContent={<MdPlayArrow />}
                              onPress={() => handleResumeCampaign(campaign.id)}
                            >
                              Resume
                            </Button>
                          )}
                          {(campaign.status === 'active' || campaign.status === 'paused') && (
                            <Button
                              size="sm"
                              color="danger"
                              variant="flat"
                              startContent={<MdStop />}
                              onPress={() => handleSuspendCampaign(campaign.id)}
                            >
                              Suspend
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredCampaigns.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      {searchTerm ? 'No campaigns found matching your search.' : 'No campaigns found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center py-4">
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={setCurrentPage}
                showControls
                isDisabled={loading}
              />
            </div>
          )}
        </CardBody>
      </Card>

      {/* Campaign Details Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <MdCampaign className="text-blue-600 text-xl" />
                  <div>
                    <h3 className="text-lg font-semibold">{selectedCampaign?.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedCampaign?.brand.display_name || selectedCampaign?.brand.name}
                    </p>
                  </div>
                  {selectedCampaign?.status === 'suspended' && (
                    <Chip color="danger" variant="flat">
                      <MdFlag className="mr-1" />
                      Suspended
                    </Chip>
                  )}
                </div>
              </ModalHeader>
              <ModalBody>
                {selectedCampaign && (
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Campaign Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Campaign Type</label>
                          <p className="font-medium capitalize">{selectedCampaign.campaign_type}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Priority</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Chip color={priorityColors[calculatePriority(selectedCampaign) as keyof typeof priorityColors]} variant="flat" size="sm">
                              {calculatePriority(selectedCampaign)}
                            </Chip>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Start Time</label>
                          <p className="font-medium">
                            {selectedCampaign.start_time 
                              ? new Date(selectedCampaign.start_time).toLocaleString()
                              : 'Not set'
                            }
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">End Time</label>
                          <p className="font-medium">
                            {selectedCampaign.end_time 
                              ? new Date(selectedCampaign.end_time).toLocaleString()
                              : 'Not set'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Brand & Agent Info */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Brand & Agent Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Brand</label>
                          <div className="flex items-center gap-2">
                            <MdBusiness className="text-gray-400" />
                            <div>
                              <p className="font-medium">{selectedCampaign.brand.display_name || selectedCampaign.brand.name}</p>
                              <p className="text-xs text-gray-500">ID: {selectedCampaign.brand.id}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Agent</label>
                          <div className="flex items-center gap-2">
                            <MdPeople className="text-gray-400" />
                            <div>
                              <p className="font-medium">{selectedCampaign.agent.display_name || selectedCampaign.agent.name}</p>
                              <p className="text-xs text-gray-500">ID: {selectedCampaign.agent.id}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Template Information */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Template Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Template Name</label>
                          <p className="font-medium">{selectedCampaign.template.name}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Template Type</label>
                          <p className="font-medium capitalize">{selectedCampaign.template.template_type}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Category</label>
                          <p className="font-medium capitalize">{selectedCampaign.template.category}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Template ID</label>
                          <p className="font-medium">{selectedCampaign.template.id}</p>
                        </div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Performance Metrics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Target Recipients</label>
                          <p className="font-medium">{selectedCampaign.total_recipients.toLocaleString()}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Messages Sent</label>
                          <p className="font-medium">{selectedCampaign.messages_sent.toLocaleString()}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Total Targets</label>
                          <p className="font-medium">{selectedCampaign._count.targets.toLocaleString()}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Total Messages</label>
                          <p className="font-medium">{selectedCampaign._count.messages.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Visualization */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Campaign Progress</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Message Delivery Progress</span>
                            <span>
                              {selectedCampaign.total_recipients > 0 
                                ? ((selectedCampaign.messages_sent / selectedCampaign.total_recipients) * 100).toFixed(1)
                                : 0
                              }%
                            </span>
                          </div>
                          <Progress 
                            value={selectedCampaign.total_recipients > 0 
                              ? (selectedCampaign.messages_sent / selectedCampaign.total_recipients) * 100
                              : 0
                            }
                            maxValue={100}
                            color="primary"
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Timeline</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Created At</label>
                          <p className="font-medium">{new Date(selectedCampaign.created_at).toLocaleString()}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Last Updated</label>
                          <p className="font-medium">{new Date(selectedCampaign.updated_at).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  View Full Analytics
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CampaignOversight;
