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
  Tab,
  Tabs
} from "@heroui/react";
import { 
  MdCreditCard, 
  MdAttachMoney, 
  MdTrendingUp,
  MdTrendingDown,
  MdEdit,
  MdDelete,
  MdAdd,
  MdVisibility,
  MdSearch,
  MdDownload,
  MdRefresh,
  MdCheckCircle,
  MdError,
  MdWarning,
  MdPending,
  MdReceipt,
  MdPayment
} from "react-icons/md";

// Mock data for subscription plans
const mockPlans = [
  {
    id: 1,
    name: "Starter",
    price: 29.99,
    currency: "USD",
    billingCycle: "monthly",
    features: {
      messagesPerMonth: 1000,
      campaigns: 5,
      analytics: "basic",
      support: "email",
      customBranding: false,
      apiAccess: false
    },
    status: "active",
    subscribers: 45,
    revenue: 1349.55,
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    name: "Professional",
    price: 99.99,
    currency: "USD",
    billingCycle: "monthly",
    features: {
      messagesPerMonth: 5000,
      campaigns: 25,
      analytics: "advanced",
      support: "priority",
      customBranding: true,
      apiAccess: true
    },
    status: "active",
    subscribers: 78,
    revenue: 7799.22,
    createdAt: "2024-01-15"
  },
  {
    id: 3,
    name: "Enterprise",
    price: 299.99,
    currency: "USD",
    billingCycle: "monthly",
    features: {
      messagesPerMonth: "unlimited",
      campaigns: "unlimited",
      analytics: "enterprise",
      support: "dedicated",
      customBranding: true,
      apiAccess: true
    },
    status: "active",
    subscribers: 23,
    revenue: 6899.77,
    createdAt: "2024-01-15"
  }
];

// Mock data for payments
const mockPayments = [
  {
    id: 1,
    paymentId: "PAY_001",
    clientName: "TechCorp Solutions",
    planName: "Enterprise",
    amount: 299.99,
    currency: "USD",
    status: "completed",
    paymentMethod: "credit_card",
    gatewayProvider: "stripe",
    createdAt: "2024-09-04T10:30:00Z",
    paidAt: "2024-09-04T10:30:15Z"
  },
  {
    id: 2,
    paymentId: "PAY_002",
    clientName: "Digital Marketing Inc",
    planName: "Professional",
    amount: 99.99,
    currency: "USD",
    status: "failed",
    paymentMethod: "credit_card",
    gatewayProvider: "stripe",
    failureReason: "Insufficient funds",
    createdAt: "2024-09-04T09:15:00Z",
    failedAt: "2024-09-04T09:15:10Z"
  },
  {
    id: 3,
    paymentId: "PAY_003",
    clientName: "Healthcare Plus",
    planName: "Professional",
    amount: 99.99,
    currency: "USD",
    status: "pending",
    paymentMethod: "bank_transfer",
    gatewayProvider: "razorpay",
    createdAt: "2024-09-04T08:00:00Z"
  }
];

const paymentStatusColors = {
  completed: "success",
  failed: "danger",
  pending: "warning",
  refunded: "default"
} as const;

const planStatusColors = {
  active: "success",
  inactive: "danger",
  draft: "warning"
} as const;

export const SubscriptionManagement = () => {
  const [plans, setPlans] = useState(mockPlans);
  const [payments, setPayments] = useState(mockPayments);
  const [selectedTab, setSelectedTab] = useState("plans");
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isPaymentOpen, onOpen: onPaymentOpen, onOpenChange: onPaymentOpenChange } = useDisclosure();

  // Calculate statistics
  const totalRevenue = plans.reduce((sum, plan) => sum + plan.revenue, 0);
  const totalSubscribers = plans.reduce((sum, plan) => sum + plan.subscribers, 0);
  const averageRevenuePerUser = totalSubscribers > 0 ? totalRevenue / totalSubscribers : 0;

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = searchTerm === "" || 
      payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleEditPlan = (plan: any) => {
    setSelectedPlan(plan);
    onOpen();
  };

  const handleViewPayment = (payment: any) => {
    setSelectedPlan(payment);
    onPaymentOpen();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Subscription & Billing Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage subscription plans, billing, and payment analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="flat"
            size="sm"
            startContent={<MdDownload />}
            className="bg-blue-100 text-blue-700"
          >
            Export Revenue
          </Button>
          <Button
            variant="flat"
            size="sm"
            startContent={<MdRefresh />}
            className="bg-green-100 text-green-700"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MdAttachMoney className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MdCreditCard className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalSubscribers}</p>
                <p className="text-sm text-gray-600">Total Subscribers</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MdTrendingUp className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">${averageRevenuePerUser.toFixed(2)}</p>
                <p className="text-sm text-gray-600">ARPU</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MdReceipt className="text-orange-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
                <p className="text-sm text-gray-600">Active Plans</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs 
        selectedKey={selectedTab} 
        onSelectionChange={(key) => setSelectedTab(key as string)}
        className="w-full"
      >
        <Tab key="plans" title="Subscription Plans">
          <div className="space-y-6">
            {/* Plans Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Subscription Plans</h2>
              <Button
                color="primary"
                startContent={<MdAdd />}
              >
                Create New Plan
              </Button>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MdCreditCard className="text-blue-600" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-lg font-semibold">{plan.name}</p>
                      <div className="flex items-center gap-2">
                        <Chip 
                          color={planStatusColors[plan.status as keyof typeof planStatusColors]} 
                          variant="flat" 
                          size="sm"
                        >
                          {plan.status}
                        </Chip>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-4">
                      {/* Pricing */}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">
                          ${plan.price}
                        </div>
                        <div className="text-sm text-gray-500">
                          per {plan.billingCycle}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Messages/Month:</span>
                          <span className="font-medium">{plan.features.messagesPerMonth}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Campaigns:</span>
                          <span className="font-medium">{plan.features.campaigns}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Analytics:</span>
                          <span className="font-medium capitalize">{plan.features.analytics}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">API Access:</span>
                          <span className="font-medium">{plan.features.apiAccess ? "Yes" : "No"}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="pt-3 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subscribers:</span>
                          <span className="font-semibold text-blue-600">{plan.subscribers}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Revenue:</span>
                          <span className="font-semibold text-green-600">${plan.revenue.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-3">
                        <Button
                          size="sm"
                          variant="flat"
                          startContent={<MdEdit />}
                          onPress={() => handleEditPlan(plan)}
                          className="flex-1"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          startContent={<MdVisibility />}
                          className="flex-1"
                        >
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </Tab>

        <Tab key="payments" title="Payment History">
          <div className="space-y-6">
            {/* Payments Header & Filters */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
              <div className="flex gap-3">
                <Input
                  placeholder="Search payments or clients..."
                  startContent={<MdSearch className="text-gray-400" />}
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                  className="w-64"
                />
                <Select
                  placeholder="All Statuses"
                  selectedKeys={[statusFilter]}
                  onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
                  className="w-40"
                >
                  <SelectItem key="all">All Statuses</SelectItem>
                  <SelectItem key="completed">Completed</SelectItem>
                  <SelectItem key="failed">Failed</SelectItem>
                  <SelectItem key="pending">Pending</SelectItem>
                  <SelectItem key="refunded">Refunded</SelectItem>
                </Select>
              </div>
            </div>

            {/* Payments Table */}
            <Card>
              <CardBody className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Payment ID</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Client</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Plan</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.map((payment) => (
                        <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="font-mono text-sm text-blue-600">
                              {payment.paymentId}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">
                              {payment.clientName}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-gray-600">
                              {payment.planName}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-semibold text-gray-900">
                              ${payment.amount}
                            </div>
                            <div className="text-xs text-gray-500">
                              {payment.currency}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Chip 
                              color={paymentStatusColors[payment.status as keyof typeof paymentStatusColors]} 
                              variant="flat" 
                              size="sm"
                            >
                              {payment.status}
                            </Chip>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-gray-600">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(payment.createdAt).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Button
                              size="sm"
                              variant="flat"
                              startContent={<MdVisibility />}
                              onPress={() => handleViewPayment(payment)}
                            >
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
          </div>
        </Tab>

        <Tab key="analytics" title="Revenue Analytics">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Revenue Analytics Dashboard</h3>
              </CardHeader>
              <CardBody>
                <div className="text-center py-12">
                  <MdTrendingUp className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Revenue analytics dashboard coming soon...</p>
                  <p className="text-sm text-gray-400 mt-2">
                    This will include charts for revenue trends, plan performance, and payment analytics.
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>
      </Tabs>

      {/* Plan Edit Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3 className="text-lg font-semibold">Edit Subscription Plan</h3>
              </ModalHeader>
              <ModalBody>
                {selectedPlan && (
                  <div className="space-y-4">
                    <Input
                      label="Plan Name"
                      defaultValue={selectedPlan.name}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Price"
                        type="number"
                        defaultValue={selectedPlan.price?.toString()}
                        startContent={<span className="text-gray-500">$</span>}
                      />
                      <Select
                        label="Billing Cycle"
                        defaultSelectedKeys={[selectedPlan.billingCycle]}
                      >
                        <SelectItem key="monthly">Monthly</SelectItem>
                        <SelectItem key="quarterly">Quarterly</SelectItem>
                        <SelectItem key="annually">Annually</SelectItem>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Messages per Month"
                        defaultValue={selectedPlan.features?.messagesPerMonth?.toString()}
                      />
                      <Input
                        label="Campaigns Limit"
                        defaultValue={selectedPlan.features?.campaigns?.toString()}
                      />
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Payment Details Modal */}
      <Modal 
        isOpen={isPaymentOpen} 
        onOpenChange={onPaymentOpenChange}
        size="xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3 className="text-lg font-semibold">Payment Details</h3>
              </ModalHeader>
              <ModalBody>
                {selectedPlan && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">Payment ID</label>
                        <p className="font-mono text-sm">{selectedPlan.paymentId}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Client</label>
                        <p className="font-medium">{selectedPlan.clientName}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Amount</label>
                        <p className="font-medium">${selectedPlan.amount} {selectedPlan.currency}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Status</label>
                        <div className="mt-1">
                          <Chip 
                            color={paymentStatusColors[selectedPlan.status as keyof typeof paymentStatusColors]} 
                            variant="flat" 
                            size="sm"
                          >
                            {selectedPlan.status}
                          </Chip>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Payment Method</label>
                        <p className="font-medium capitalize">{selectedPlan.paymentMethod?.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Gateway</label>
                        <p className="font-medium capitalize">{selectedPlan.gatewayProvider}</p>
                      </div>
                    </div>
                    
                    {selectedPlan.failureReason && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <label className="text-sm text-red-600 font-medium">Failure Reason</label>
                        <p className="text-sm text-red-700">{selectedPlan.failureReason}</p>
                      </div>
                    )}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose} startContent={<MdReceipt />}>
                  Download Receipt
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SubscriptionManagement;
