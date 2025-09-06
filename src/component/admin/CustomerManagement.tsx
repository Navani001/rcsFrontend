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
  Spinner
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
  MdPerson
} from "react-icons/md";
import { CustomerAPI, Customer, type CustomersResponse } from "@/utils";

const statusColors = {
  subscribed: "success",
  unsubscribed: "danger", 
  blocked: "warning",
  active: "success"
} as const;

const getStatusDisplayName = (status: string) => {
  const statusMap: Record<string, string> = {
    subscribed: "Active",
    unsubscribed: "Unsubscribed",
    blocked: "Blocked"
  };
  return statusMap[status] || status;
};

export const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Fetch customers from API
  const fetchCustomers = async (page = 1, search = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await CustomerAPI.getAllCustomers({
        page,
        limit: itemsPerPage,
        search: search || undefined
      }) as any;

      if (response.success) {
        setCustomers(response.data.customers);
        setTotalCustomers(response.data.total);
        setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      } else {
        setError("Failed to fetch customers");
      }
    } catch (err: any) {
      console.error("Error fetching customers:", err);
      setError("Failed to fetch customers: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(currentPage, searchTerm);
  }, [currentPage]);

  // Handle search with debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setCurrentPage(1);
      fetchCustomers(1, searchTerm);
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    onOpen();
  };

  const handleRefresh = () => {
    fetchCustomers(currentPage, searchTerm);
  };

  const getActiveSubscriptions = (customer: Customer) => {
    return customer.subscriptions.filter(sub => sub.status === 'subscribed');
  };

  const getTotalSubscriptions = (customer: Customer) => {
    return customer._count.subscriptions;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Customer Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage all customer accounts and subscriptions
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
                <MdPerson className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
                <p className="text-sm text-gray-600">Total Customers</p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => getActiveSubscriptions(c).length > 0).length}
                </p>
                <p className="text-sm text-gray-600">Active Subscribers</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <MdBusiness className="text-yellow-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.reduce((acc, customer) => acc + getTotalSubscriptions(customer), 0)}
                </p>
                <p className="text-sm text-gray-600">Total Subscriptions</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MdDateRange className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => {
                    const today = new Date();
                    const createdDate = new Date(c.created_at);
                    const diffTime = Math.abs(today.getTime() - createdDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays <= 30;
                  }).length}
                </p>
                <p className="text-sm text-gray-600">New This Month</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search Filter */}
      <Card>
        <CardBody>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Search customers by name, phone, or country code..."
                startContent={<MdSearch className="text-gray-400" />}
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="w-full"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <h3 className="text-lg font-semibold">Customer Accounts ({totalCustomers})</h3>
            {loading && <Spinner size="sm" />}
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Subscriptions</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Brands</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Joined</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <MdPerson className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-500">ID: {customer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MdPhone className="text-xs" />
                          +{customer.country_code} {customer.phone_number}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          {getTotalSubscriptions(customer)} total
                        </p>
                        <p className="text-xs text-gray-500">
                          {getActiveSubscriptions(customer).length} active
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {customer.subscriptions.slice(0, 2).map((sub, index) => (
                          <Chip 
                            key={index}
                            size="sm" 
                            variant="flat"
                            color={statusColors[sub.status as keyof typeof statusColors] || "default"}
                          >
                            {sub.brand.display_name || sub.brand.name}
                          </Chip>
                        ))}
                        {customer.subscriptions.length > 2 && (
                          <Chip size="sm" variant="flat" color="default">
                            +{customer.subscriptions.length - 2} more
                          </Chip>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        size="sm"
                        variant="flat"
                        startContent={<MdVisibility />}
                        onPress={() => handleViewCustomer(customer)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      {searchTerm ? 'No customers found matching your search.' : 'No customers found.'}
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

      {/* Customer Details Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <MdPerson className="text-blue-600 text-xl" />
                  <div>
                    <h3 className="text-lg font-semibold">{selectedCustomer?.name}</h3>
                    <p className="text-sm text-gray-500">Customer ID: {selectedCustomer?.id}</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                {selectedCustomer && (
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Basic Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Full Name</label>
                          <p className="font-medium">{selectedCustomer.name}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Customer ID</label>
                          <p className="font-medium">{selectedCustomer.id}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Phone Number</label>
                          <p className="font-medium">+{selectedCustomer.country_code} {selectedCustomer.phone_number}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Country Code</label>
                          <p className="font-medium">+{selectedCustomer.country_code}</p>
                        </div>
                      </div>
                    </div>

                    {/* Account Details */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Account Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Joined Date</label>
                          <p className="font-medium">{new Date(selectedCustomer.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Last Updated</label>
                          <p className="font-medium">{new Date(selectedCustomer.updated_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Total Subscriptions</label>
                          <p className="font-medium">{getTotalSubscriptions(selectedCustomer)}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Active Subscriptions</label>
                          <p className="font-medium">{getActiveSubscriptions(selectedCustomer).length}</p>
                        </div>
                      </div>
                    </div>

                    {/* Subscriptions */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Brand Subscriptions</h4>
                      <div className="space-y-3">
                        {selectedCustomer.subscriptions.length === 0 ? (
                          <p className="text-gray-500 text-sm">No subscriptions found</p>
                        ) : (
                          selectedCustomer.subscriptions.map((subscription, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-3">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <MdBusiness className="text-blue-600" />
                                    <span className="font-medium">{subscription.brand.display_name || subscription.brand.name}</span>
                                    <Chip 
                                      size="sm" 
                                      color={statusColors[subscription.status as keyof typeof statusColors] || "default"}
                                      variant="flat"
                                    >
                                      {getStatusDisplayName(subscription.status)}
                                    </Chip>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                    <div>
                                      <span className="text-gray-500">Brand ID:</span> {subscription.brand.id}
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Subscription ID:</span> {subscription.id}
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Subscribed:</span>{" "}
                                      {subscription.subscribed_at 
                                        ? new Date(subscription.subscribed_at).toLocaleDateString()
                                        : "N/A"}
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Status:</span> {subscription.status}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
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
                  Edit Customer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CustomerManagement;
