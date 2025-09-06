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
  CheckboxGroup,
  Spinner
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
import { adminAPI } from '../../utils/adminAPI';

// Types
interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  brand?: {
    id: number;
    name: string;
  };
}

interface AdminStats {
  totalAdmins: number;
  activeUsers: number;
  superAdmins: number;
  roleTemplates: number;
  totalBrands: number;
  totalCampaigns: number;
  totalSubscriptions: number;
}

interface Role {
  id: number;
  name: string;
  code: string;
  description: string;
  permissions?: string[];
}

interface Permission {
  id: number;
  name: string;
  code: string;
  category: string;
}

interface PermissionGroup {
  category: string;
  permissions: Permission[];
}

const statusColors = {
  active: "success",
  inactive: "danger",
  pending: "warning"
} as const;

const roleColors = {
  super_admin: "danger",
  admin: "primary",
  moderator: "secondary",
  analyst: "success"
} as const;

export const AdminRoles = () => {
  // State management
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<PermissionGroup[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    permissions: [] as string[]
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // API Functions
  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      const response:any = await adminAPI.getAdminUsers();
      if (response.success) {
        setUsers(response.data.adminUsers || []);
      }
    } catch (error) {
      console.error('Failed to fetch admin users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const response:any = await adminAPI.getAdminStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response:any = await adminAPI.getRoles();
      if (response.success) {
        setRoles(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response:any = await adminAPI.getPermissions();
      if (response.success) {
        setPermissions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    }
  };

  const createAdminUser = async (userData: any) => {
    try {
      setLoading(true);
      const response:any = await adminAPI.createAdminUser(userData);
      if (response.success) {
        await fetchAdminUsers(); // Refresh the list
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to create admin user:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAdminUser = async (userId: number, userData: any) => {
    try {
      setLoading(true);
      const response:any = await adminAPI.updateAdminUser(userId, userData);
      if (response.success) {
        await fetchAdminUsers(); // Refresh the list
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update admin user:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: number, status: 'active' | 'inactive') => {
    try {
      setLoading(true);
      const response:any = await adminAPI.toggleUserStatus(userId, status);
      if (response.success) {
        await fetchAdminUsers(); // Refresh the list
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAdminUser = async (userId: number) => {
    try {
      setLoading(true);
      const response:any = await adminAPI.deleteAdminUser(userId);
      if (response.success) {
        await fetchAdminUsers(); // Refresh the list
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete admin user:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchAdminUsers();
    fetchAdminStats();
    fetchRoles();
    fetchPermissions();
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((user: AdminUser) => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user: AdminUser) => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user: AdminUser) => user.status === statusFilter);
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
      permissions: []
    });
    onOpen();
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsEditing(true);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: []
    });
    onOpen();
  };

  const handleRoleChange = (role: string) => {
    const selectedRole = roles.find((r: Role) => r.code === role);
    if (selectedRole) {
      setFormData(prev => ({
        ...prev,
        role,
        permissions: selectedRole.permissions || []
      }));
    }
  };

  const handleSaveUser = async () => {
    const userData = {
      name: formData.name,
      email: formData.email,
      role: formData.role
    };

    let success = false;
    if (isEditing && selectedUser) {
      success = await updateAdminUser(selectedUser.id, userData);
    } else {
      success = await createAdminUser(userData);
    }

    if (success) {
      onOpenChange();
    }
  };

  const handleToggleUserStatus = async (user: AdminUser) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    await toggleUserStatus(user.id, newStatus);
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this admin user?')) {
      await deleteAdminUser(userId);
    }
  };

  // Create grouped permissions from API data
  const groupedPermissions = permissions.reduce((acc: any, group: PermissionGroup) => {
    acc[group.category] = group.permissions;
    return acc;
  }, {});

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
            startContent={<MdRefresh />}
            onPress={() => {
              fetchAdminUsers();
              fetchAdminStats();
            }}
            isLoading={loading}
            className="bg-gray-100 text-gray-700"
          >
            Refresh
          </Button>
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
            isLoading={loading}
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
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? <Spinner size="sm" /> : (stats?.totalAdmins || users.length)}
                </p>
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
                  {loading ? <Spinner size="sm" /> : (stats?.activeUsers || users.filter(u => u.status === 'active').length)}
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
                  {loading ? <Spinner size="sm" /> : (stats?.superAdmins || users.filter(u => u.role === 'super_admin').length)}
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
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? <Spinner size="sm" /> : (stats?.roleTemplates || roles.length)}
                </p>
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
              <SelectItem key="admin">Admin</SelectItem>
              <SelectItem key="moderator">Moderator</SelectItem>
              <SelectItem key="analyst">Analyst</SelectItem>
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
          <h3 className="text-lg font-semibold">
            Admin Users ({filteredUsers.length})
            {loading && <Spinner size="sm" className="ml-2" />}
          </h3>
        </CardHeader>
        <CardBody className="p-0">
          {loading && users.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Brand</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Created</th>
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
                        color={roleColors[user.role as keyof typeof roleColors] || 'default'} 
                        variant="flat" 
                        size="sm"
                      >
                        {user.role.replace('_', ' ')}
                      </Chip>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">
                        {user.brand?.name || 'No Brand'}
                      </span>
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
                        {new Date(user.created_at).toLocaleDateString()}
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
                          onPress={() => handleToggleUserStatus(user)}
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          variant="flat"
                          startContent={<MdDelete />}
                          onPress={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
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
                      {roles.map((role: Role) => (
                        <SelectItem key={role.code} description={role.description}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </Select>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Brand Association
                      </label>
                      <span className="text-sm text-gray-500">
                        Auto-assigned based on system requirements
                      </span>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                      Permissions (Read-only - Based on Role)
                    </label>
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                        <div key={category}>
                          <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {(categoryPermissions as Permission[]).map((permission: Permission) => (
                              <div key={permission.id} className="flex items-center gap-2">
                                <Checkbox
                                  value={permission.code}
                                  isSelected={formData.permissions.includes(permission.code)}
                                  isDisabled={true}
                                >
                                  {permission.name}
                                </Checkbox>
                              </div>
                            ))}
                          </div>
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
                <Button 
                  color="primary" 
                  onPress={handleSaveUser}
                  isLoading={loading}
                >
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
