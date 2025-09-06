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
  Checkbox,
  CheckboxGroup
} from "@heroui/react";
import { 
  MdPeople, 
  MdAdd,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdSearch,
  MdSecurity,
  MdAdminPanelSettings,
  MdWork,
  MdSupport,
  MdRefresh,
  MdDownload
} from "react-icons/md";

// Mock data for admin users and roles
const mockAdminUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@company.com",
    role: "super_admin",
    permissions: ["all"],
    status: "active",
    lastLogin: "2024-09-04T09:30:00Z",
    createdAt: "2024-01-15T10:00:00Z",
    department: "Engineering"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "platform_admin",
    permissions: ["client_management", "subscription_management", "analytics_view"],
    status: "active",
    lastLogin: "2024-09-04T08:15:00Z",
    createdAt: "2024-02-20T14:30:00Z",
    department: "Operations"
  },
  {
    id: 3,
    name: "Mike Davis",
    email: "mike.davis@company.com",
    role: "support_admin",
    permissions: ["client_view", "campaign_view", "support_tickets"],
    status: "active",
    lastLogin: "2024-09-03T16:45:00Z",
    createdAt: "2024-03-10T11:15:00Z",
    department: "Customer Support"
  },
  {
    id: 4,
    name: "Lisa Chen",
    email: "lisa.chen@company.com",
    role: "finance_admin",
    permissions: ["billing_management", "revenue_analytics", "payment_processing"],
    status: "inactive",
    lastLogin: "2024-08-28T12:00:00Z",
    createdAt: "2024-04-05T09:45:00Z",
    department: "Finance"
  }
];

const availablePermissions = [
  { id: "all", label: "All Permissions", category: "Super Admin" },
  { id: "client_management", label: "Client Management", category: "Platform" },
  { id: "client_view", label: "Client View Only", category: "Platform" },
  { id: "subscription_management", label: "Subscription Management", category: "Platform" },
  { id: "billing_management", label: "Billing Management", category: "Finance" },
  { id: "revenue_analytics", label: "Revenue Analytics", category: "Finance" },
  { id: "payment_processing", label: "Payment Processing", category: "Finance" },
  { id: "campaign_management", label: "Campaign Management", category: "Operations" },
  { id: "campaign_view", label: "Campaign View Only", category: "Operations" },
  { id: "analytics_view", label: "Analytics Dashboard", category: "Analytics" },
  { id: "system_monitoring", label: "System Monitoring", category: "Technical" },
  { id: "user_management", label: "User Management", category: "Admin" },
  { id: "support_tickets", label: "Support Tickets", category: "Support" }
];

const roleTemplates = [
  {
    name: "Super Admin",
    value: "super_admin",
    permissions: ["all"],
    description: "Full platform access"
  },
  {
    name: "Platform Admin",
    value: "platform_admin",
    permissions: ["client_management", "subscription_management", "campaign_management", "analytics_view"],
    description: "Platform management access"
  },
  {
    name: "Support Admin",
    value: "support_admin",
    permissions: ["client_view", "campaign_view", "support_tickets"],
    description: "Customer support access"
  },
  {
    name: "Finance Admin",
    value: "finance_admin",
    permissions: ["billing_management", "revenue_analytics", "payment_processing"],
    description: "Financial operations access"
  }
];

const statusColors = {
  active: "success",
  inactive: "danger",
  pending: "warning"
} as const;

const roleColors = {
  super_admin: "danger",
  platform_admin: "primary",
  support_admin: "secondary",
  finance_admin: "success"
} as const;

export const AdminRoles = () => {
  const [users, setUsers] = useState(mockAdminUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockAdminUsers);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    permissions: [] as string[],
    department: ""
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    let filtered = users;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, statusFilter, users]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setFormData({
      name: "",
      email: "",
      role: "",
      permissions: [],
      department: ""
    });
    onOpen();
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsEditing(true);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      department: user.department
    });
    onOpen();
  };

  const handleRoleChange = (role: string) => {
    const template = roleTemplates.find(t => t.value === role);
    if (template) {
      setFormData(prev => ({
        ...prev,
        role,
        permissions: template.permissions
      }));
    }
  };

  const handleSaveUser = () => {
    if (isEditing && selectedUser) {
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...formData }
          : user
      ));
    } else {
      const newUser = {
        id: Date.now(),
        ...formData,
        status: "active",
        lastLogin: "",
        createdAt: new Date().toISOString()
      };
      setUsers(prev => [...prev, newUser as any]);
    }
    onOpenChange();
  };

  const handleToggleUserStatus = (userId: number) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof availablePermissions>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Roles & Permissions
          </h1>
          <p className="text-lg text-gray-600">
            Manage internal team access and role-based permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="flat"
            size="sm"
            startContent={<MdDownload />}
            className="bg-blue-100 text-blue-700"
          >
            Export Access Report
          </Button>
          <Button
            color="primary"
            startContent={<MdAdd />}
            onPress={handleAddUser}
          >
            Add Admin User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MdPeople className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                <p className="text-sm text-gray-600">Total Admins</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MdSecurity className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.status === 'active').length}
                </p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <MdAdminPanelSettings className="text-red-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'super_admin').length}
                </p>
                <p className="text-sm text-gray-600">Super Admins</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MdWork className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{roleTemplates.length}</p>
                <p className="text-sm text-gray-600">Role Templates</p>
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
                placeholder="Search users, emails, or departments..."
                startContent={<MdSearch className="text-gray-400" />}
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="w-full"
              />
            </div>
            <Select
              placeholder="All Roles"
              selectedKeys={[roleFilter]}
              onSelectionChange={(keys) => setRoleFilter(Array.from(keys)[0] as string)}
              className="w-48"
            >
              <SelectItem key="all">All Roles</SelectItem>
              <SelectItem key="super_admin">Super Admin</SelectItem>
              <SelectItem key="platform_admin">Platform Admin</SelectItem>
              <SelectItem key="support_admin">Support Admin</SelectItem>
              <SelectItem key="finance_admin">Finance Admin</SelectItem>
            </Select>
            <Select
              placeholder="All Statuses"
              selectedKeys={[statusFilter]}
              onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
              className="w-48"
            >
              <SelectItem key="all">All Statuses</SelectItem>
              <SelectItem key="active">Active</SelectItem>
              <SelectItem key="inactive">Inactive</SelectItem>
              <SelectItem key="pending">Pending</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Admin Users ({filteredUsers.length})</h3>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Department</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Last Login</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <MdPeople className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Chip 
                        color={roleColors[user.role as keyof typeof roleColors]} 
                        variant="flat" 
                        size="sm"
                      >
                        {user.role.replace('_', ' ')}
                      </Chip>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{user.department}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Chip 
                        color={statusColors[user.status as keyof typeof statusColors]} 
                        variant="flat" 
                        size="sm"
                      >
                        {user.status}
                      </Chip>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="flat"
                          startContent={<MdEdit />}
                          onPress={() => handleEditUser(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          color={user.status === 'active' ? 'danger' : 'success'}
                          variant="flat"
                          onPress={() => handleToggleUserStatus(user.id)}
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Add/Edit User Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3 className="text-lg font-semibold">
                  {isEditing ? 'Edit Admin User' : 'Add New Admin User'}
                </h3>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={formData.name}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                      isRequired
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                      isRequired
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Role Template"
                      selectedKeys={[formData.role]}
                      onSelectionChange={(keys) => handleRoleChange(Array.from(keys)[0] as string)}
                      isRequired
                    >
                      {roleTemplates.map((template) => (
                        <SelectItem key={template.value} description={template.description}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </Select>
                    <Input
                      label="Department"
                      value={formData.department}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                      isRequired
                    />
                  </div>

                  {/* Permissions */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                      Permissions
                    </label>
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {Object.entries(groupedPermissions).map(([category, permissions]) => (
                        <div key={category}>
                          <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                          <CheckboxGroup
                            value={formData.permissions}
                            onValueChange={(values) => setFormData(prev => ({ ...prev, permissions: values }))}
                          >
                            <div className="grid grid-cols-2 gap-2">
                              {permissions.map((permission) => (
                                <Checkbox
                                  key={permission.id}
                                  value={permission.id}
                                  isDisabled={formData.permissions.includes('all') && permission.id !== 'all'}
                                >
                                  {permission.label}
                                </Checkbox>
                              ))}
                            </div>
                          </CheckboxGroup>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSaveUser}>
                  {isEditing ? 'Update User' : 'Create User'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminRoles;
