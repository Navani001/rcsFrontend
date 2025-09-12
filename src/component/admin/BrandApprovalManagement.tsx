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
  Spinner,
  Textarea,
  Avatar
} from "@heroui/react";
import { 
  MdBusiness, 
  MdVerifiedUser, 
  MdBlock, 
  MdEdit,
  MdVisibility,
  MdSearch,
  MdFilter,
  MdDownload,
  MdRefresh,
  MdCheckCircle,
  MdPending,
  MdError,
  MdEmail,
  MdPhone,
  MdDateRange,
  MdCheck,
  MdClose,
  MdPause,
  MdDelete,
  MdKey,
  MdDescription,
  MdCategory,
  MdApi
} from "react-icons/md";
import { BrandAPI, Brand, BrandsResponse } from "@/utils";

const statusColors = {
  active: "success",
  pending: "warning", 
  rejected: "danger",
  suspended: "secondary",
  inactive: "default"
} as const;

const getStatusDisplayName = (status: string) => {
  const statusMap: Record<string, string> = {
    active: "Active",
    pending: "Pending",
    rejected: "Rejected",
    suspended: "Suspended",
    inactive: "Inactive"
  };
  return statusMap[status] || status;
};

export const BrandApprovalManagement = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalBrands, setTotalBrands] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'suspend' | 'view' | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [suspendReason, setSuspendReason] = useState("");
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isActionModalOpen, onOpen: onActionModalOpen, onOpenChange: onActionModalOpenChange } = useDisclosure();

  // Fetch brands from API
  const fetchBrands = async (page = 1, search = "", status = "all") => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        page,
        limit: itemsPerPage,
      };
      
      if (search) params.search = search;
      if (status && status !== "all") params.status = status;

      const response = await BrandAPI.getAllBrands(params) as any;

      if (response.success) {
        setBrands(response.data.brands);
        setTotalBrands(response.data.total);
        setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      } else {
        setError("Failed to fetch brands");
      }
    } catch (err: any) {
      console.error("Error fetching brands:", err);
      setError("Failed to fetch brands: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands(currentPage, searchTerm, statusFilter);
  }, [currentPage, statusFilter]);

  // Handle search with debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setCurrentPage(1);
      fetchBrands(1, searchTerm, statusFilter);
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const handleViewBrand = (brand: Brand) => {
    setSelectedBrand(brand);
    setActionType('view');
    onOpen();
  };

  const handleActionBrand = (brand: Brand, action: 'approve' | 'reject' | 'suspend') => {
    setSelectedBrand(brand);
    setActionType(action);
    setRejectReason("");
    setSuspendReason("");
    onActionModalOpen();
  };

  const handleConfirmAction = async () => {
    if (!selectedBrand || !actionType) return;

    setActionLoading(true);
    try {
      let response;
      switch (actionType) {
        case 'approve':
          response = await BrandAPI.approveBrand(selectedBrand.id);
          break;
        case 'reject':
          response = await BrandAPI.rejectBrand(selectedBrand.id, rejectReason);
          break;
        case 'suspend':
          response = await BrandAPI.suspendBrand(selectedBrand.id, suspendReason);
          break;
        default:
          return;
      }

      if ((response as any).success) {
        await fetchBrands(currentPage, searchTerm, statusFilter);
        onActionModalOpenChange();
        setActionType(null);
        setSelectedBrand(null);
      } else {
        setError(`Failed to ${actionType} brand`);
      }
    } catch (err: any) {
      console.error(`Error ${actionType}ing brand:`, err);
      setError(`Failed to ${actionType} brand: ` + (err.message || "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchBrands(currentPage, searchTerm, statusFilter);
  };

  const getStatusStats = () => {
    const stats = {
      total: totalBrands,
      active: brands.filter(b => b.status === 'active').length,
      pending: brands.filter(b => b.status === 'pending').length,
      verified: brands.filter(b => b.verified).length
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Brand Approval Management
          </h1>
          <p className="text-lg text-gray-600">
            Review and approve brand registration requests
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
            Export Data
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MdBusiness className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Brands</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MdCheckCircle className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                <p className="text-sm text-gray-600">Active Brands</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <MdPending className="text-yellow-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending Approval</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MdVerifiedUser className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.verified}</p>
                <p className="text-sm text-gray-600">Verified Brands</p>
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
                placeholder="Search brands by name or description..."
                startContent={<MdSearch className="text-gray-400" />}
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="w-full"
              />
            </div>
            <div className="min-w-48">
              <Select
                label="Status Filter"
                selectedKeys={statusFilter ? [statusFilter] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  setStatusFilter(selected as string);
                }}
                startContent={<MdFilter className="text-gray-400" />}
              >
                <SelectItem key="all">All Status</SelectItem>
                <SelectItem key="pending">Pending</SelectItem>
                <SelectItem key="active">Active</SelectItem>
                <SelectItem key="rejected">Rejected</SelectItem>
                <SelectItem key="suspended">Suspended</SelectItem>
                <SelectItem key="inactive">Inactive</SelectItem>
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Brands Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <h3 className="text-lg font-semibold">Brand Applications ({totalBrands})</h3>
            {loading && <Spinner size="sm" />}
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Brand</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Details</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Statistics</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Created</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr key={brand.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={brand.logo_url || undefined}
                          name={brand.display_name || brand.name}
                          size="md"
                          className="bg-blue-100"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{brand.display_name || brand.name}</p>
                          <p className="text-sm text-gray-500">ID: {brand.id}</p>
                          <p className="text-xs text-gray-400">{brand.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MdCategory className="text-xs" />
                          {brand.subscription_type || 'Standard'}
                        </div>
                        {brand.description && (
                          <p className="text-xs text-gray-500 max-w-48 truncate">
                            {brand.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-2">
                        <Chip 
                          size="sm" 
                          color={statusColors[brand.status as keyof typeof statusColors] || "default"}
                          variant="flat"
                        >
                          {getStatusDisplayName(brand.status)}
                        </Chip>
                        {brand.verified && (
                          <Chip size="sm" color="success" variant="flat" startContent={<MdVerifiedUser />}>
                            Verified
                          </Chip>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Agents:</span>
                          <span className="font-medium">{brand._count.brandAgents}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Templates:</span>
                          <span className="font-medium">{brand._count.templates}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Campaigns:</span>
                          <span className="font-medium">{brand._count.campaigns}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600">
                        {new Date(brand.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="flat"
                          startContent={<MdVisibility />}
                          onPress={() => handleViewBrand(brand)}
                        >
                          View
                        </Button>
                        {brand.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              color="success"
                              variant="flat"
                              startContent={<MdCheck />}
                              onPress={() => handleActionBrand(brand, 'approve')}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              color="danger"
                              variant="flat"
                              startContent={<MdClose />}
                              onPress={() => handleActionBrand(brand, 'reject')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {brand.status === 'active' && (
                          <Button
                            size="sm"
                            color="warning"
                            variant="flat"
                            startContent={<MdPause />}
                            onPress={() => handleActionBrand(brand, 'suspend')}
                          >
                            Suspend
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {brands.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      {searchTerm || statusFilter !== "all" ? 'No brands found matching your filters.' : 'No brands found.'}
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

      {/* Brand Details Modal */}
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
                  <Avatar
                    src={selectedBrand?.logo_url || undefined}
                    name={selectedBrand?.display_name || selectedBrand?.name}
                    size="lg"
                    className="bg-blue-100"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{selectedBrand?.display_name || selectedBrand?.name}</h3>
                    <p className="text-sm text-gray-500">Brand ID: {selectedBrand?.id}</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                {selectedBrand && (
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Basic Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Brand Name</label>
                          <p className="font-medium">{selectedBrand.name}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Display Name</label>
                          <p className="font-medium">{selectedBrand.display_name || 'Not set'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Brand ID</label>
                          <p className="font-medium">{selectedBrand.id}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Subscription Type</label>
                          <p className="font-medium">{selectedBrand.subscription_type || 'Standard'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Status & Verification */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Status & Verification</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Current Status</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Chip 
                              size="sm" 
                              color={statusColors[selectedBrand.status as keyof typeof statusColors] || "default"}
                              variant="flat"
                            >
                              {getStatusDisplayName(selectedBrand.status)}
                            </Chip>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Verification Status</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Chip 
                              size="sm" 
                              color={selectedBrand.verified ? "success" : "warning"}
                              variant="flat"
                              startContent={selectedBrand.verified ? <MdVerifiedUser /> : <MdPending />}
                            >
                              {selectedBrand.verified ? 'Verified' : 'Unverified'}
                            </Chip>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Created Date</label>
                          <p className="font-medium">{new Date(selectedBrand.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Last Updated</label>
                          <p className="font-medium">{new Date(selectedBrand.updated_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {selectedBrand.description && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {selectedBrand.description}
                        </p>
                      </div>
                    )}

                    {/* API Information */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">API Configuration</h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MdApi className="text-blue-600" />
                          <span className="text-sm font-medium">API Key</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-white px-2 py-1 rounded border flex-1 overflow-hidden">
                            {selectedBrand.api_key.substring(0, 20)}...
                          </code>
                          <Button
                            size="sm"
                            variant="flat"
                            startContent={<MdKey />}
                            className="text-blue-600"
                          >
                            Regenerate
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Brand Statistics</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                          <p className="text-2xl font-bold text-blue-700">{selectedBrand._count.brandAgents}</p>
                          <p className="text-sm text-blue-600">Brand Agents</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg text-center">
                          <p className="text-2xl font-bold text-green-700">{selectedBrand._count.templates}</p>
                          <p className="text-sm text-green-600">Message Templates</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg text-center">
                          <p className="text-2xl font-bold text-purple-700">{selectedBrand._count.campaigns}</p>
                          <p className="text-sm text-purple-600">Campaigns</p>
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
                {selectedBrand?.status === 'pending' && (
                  <>
                    <Button 
                      color="success" 
                      onPress={() => {
                        onClose();
                        handleActionBrand(selectedBrand, 'approve');
                      }}
                      startContent={<MdCheck />}
                    >
                      Approve Brand
                    </Button>
                    <Button 
                      color="danger" 
                      onPress={() => {
                        onClose();
                        handleActionBrand(selectedBrand, 'reject');
                      }}
                      startContent={<MdClose />}
                    >
                      Reject Brand
                    </Button>
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Action Confirmation Modal */}
      <Modal 
        isOpen={isActionModalOpen} 
        onOpenChange={onActionModalOpenChange}
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">
                  {actionType === 'approve' && 'Approve Brand'}
                  {actionType === 'reject' && 'Reject Brand'}
                  {actionType === 'suspend' && 'Suspend Brand'}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedBrand?.display_name || selectedBrand?.name}
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    {actionType === 'approve' && 'Are you sure you want to approve this brand? This will activate the brand and allow them to use the platform.'}
                    {actionType === 'reject' && 'Are you sure you want to reject this brand application? Please provide a reason for rejection.'}
                    {actionType === 'suspend' && 'Are you sure you want to suspend this brand? This will temporarily disable their access to the platform.'}
                  </p>
                  
                  {actionType === 'reject' && (
                    <Textarea
                      label="Rejection Reason"
                      placeholder="Please provide a detailed reason for rejecting this brand application..."
                      value={rejectReason}
                      onValueChange={setRejectReason}
                      isRequired
                      minRows={3}
                    />
                  )}
                  
                  {actionType === 'suspend' && (
                    <Textarea
                      label="Suspension Reason"
                      placeholder="Please provide a reason for suspending this brand..."
                      value={suspendReason}
                      onValueChange={setSuspendReason}
                      minRows={3}
                    />
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color={actionType === 'approve' ? 'success' : 'danger'} 
                  onPress={handleConfirmAction}
                  isLoading={actionLoading}
                  isDisabled={actionType === 'reject' && !rejectReason.trim()}
                >
                  {actionType === 'approve' && 'Approve'}
                  {actionType === 'reject' && 'Reject'}
                  {actionType === 'suspend' && 'Suspend'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default BrandApprovalManagement;
