"use client";
import React, { useState, useEffect } from "react";
import { 
  Button, 
  Chip, 
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tab,
  Tabs,
  Progress
} from "@heroui/react";
import { 
  MdMonitor, 
  MdCloudDone,
  MdError,
  MdWarning,
  MdRefresh,
  MdSettings,
  MdNotifications,
  MdCode,
  MdSpeed,
  MdStorage,
  MdMemory,
  MdTimer,
  MdApi,
  MdDataset,
  MdSecurity,
  MdVisibility,
  MdDownload
} from "react-icons/md";

// Mock system health data
const mockSystemData = {
  uptime: {
    percentage: 99.9,
    lastIncident: "2024-08-15T14:30:00Z",
    uptimeHours: 8760 * 0.999
  },
  performance: {
    avgResponseTime: 145,
    p95ResponseTime: 280,
    errorRate: 0.12,
    throughput: 1547
  },
  infrastructure: {
    cpu: 34.5,
    memory: 67.8,
    disk: 45.2,
    network: 12.3
  },
  services: [
    { name: "API Gateway", status: "healthy", responseTime: 45, uptime: 99.98 },
    { name: "Authentication Service", status: "healthy", responseTime: 78, uptime: 99.95 },
    { name: "Message Queue", status: "warning", responseTime: 234, uptime: 99.85 },
    { name: "Database", status: "healthy", responseTime: 12, uptime: 99.99 },
    { name: "Redis Cache", status: "healthy", responseTime: 3, uptime: 99.97 },
    { name: "File Storage", status: "healthy", responseTime: 156, uptime: 99.93 }
  ],
  alerts: [
    { 
      id: 1, 
      type: "warning", 
      message: "High response time detected on Message Queue", 
      timestamp: "2024-09-04T10:45:00Z",
      status: "active",
      severity: "medium"
    },
    { 
      id: 2, 
      type: "info", 
      message: "Scheduled maintenance completed successfully", 
      timestamp: "2024-09-04T02:00:00Z",
      status: "resolved",
      severity: "low"
    },
    { 
      id: 3, 
      type: "error", 
      message: "Database connection timeout (resolved)", 
      timestamp: "2024-09-03T18:22:00Z",
      status: "resolved",
      severity: "high"
    }
  ],
  logs: [
    { 
      id: 1, 
      level: "ERROR", 
      message: "Failed to process message batch: Connection timeout", 
      service: "Message Queue",
      timestamp: "2024-09-04T10:45:23Z",
      count: 12
    },
    { 
      id: 2, 
      level: "WARN", 
      message: "Rate limit exceeded for client ID: 45231", 
      service: "API Gateway",
      timestamp: "2024-09-04T10:42:15Z",
      count: 156
    },
    { 
      id: 3, 
      level: "INFO", 
      message: "Cache miss rate above threshold: 15%", 
      service: "Redis Cache",
      timestamp: "2024-09-04T10:40:08Z",
      count: 1
    }
  ]
};

const statusColors = {
  healthy: "success",
  warning: "warning",
  error: "danger",
  maintenance: "default"
} as const;

const alertTypeColors = {
  error: "danger",
  warning: "warning",
  info: "primary"
} as const;

const logLevelColors = {
  ERROR: "danger",
  WARN: "warning",
  INFO: "primary",
  DEBUG: "default"
} as const;

export const SystemHealth = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [data, setData] = useState(mockSystemData);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        handleRefresh();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleRefresh = () => {
    // TODO: Implement real API call
    setLastRefresh(new Date());
    console.log("Refreshing system health data...");
  };

  const handleViewAlert = (alert: any) => {
    setSelectedAlert(alert);
    onOpen();
  };

  const getSystemStatus = () => {
    const criticalServices = data.services.filter(s => s.status === "error").length;
    const warningServices = data.services.filter(s => s.status === "warning").length;
    
    if (criticalServices > 0) return { status: "error", message: "System Issues Detected" };
    if (warningServices > 0) return { status: "warning", message: "System Warnings" };
    return { status: "healthy", message: "All Systems Operational" };
  };

  const systemStatus = getSystemStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            System Health Monitor
          </h1>
          <p className="text-lg text-gray-600">
            Real-time system status, performance monitoring, and alerts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
          <Button
            variant="flat"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}
          >
            Auto Refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>
          <Button
            variant="flat"
            size="sm"
            startContent={<MdRefresh />}
            onClick={handleRefresh}
            className="bg-blue-100 text-blue-700"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* System Status Banner */}
      <Card className={`border-l-4 ${
        systemStatus.status === 'healthy' ? 'border-green-500 bg-green-50' :
        systemStatus.status === 'warning' ? 'border-yellow-500 bg-yellow-50' :
        'border-red-500 bg-red-50'
      }`}>
        <CardBody className="p-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${
              systemStatus.status === 'healthy' ? 'bg-green-100' :
              systemStatus.status === 'warning' ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              {systemStatus.status === 'healthy' ? 
                <MdCloudDone className="text-green-600 text-2xl" /> :
                systemStatus.status === 'warning' ?
                <MdWarning className="text-yellow-600 text-2xl" /> :
                <MdError className="text-red-600 text-2xl" />
              }
            </div>
            <div>
              <h2 className={`text-xl font-bold ${
                systemStatus.status === 'healthy' ? 'text-green-800' :
                systemStatus.status === 'warning' ? 'text-yellow-800' :
                'text-red-800'
              }`}>
                {systemStatus.message}
              </h2>
              <p className={`text-sm ${
                systemStatus.status === 'healthy' ? 'text-green-600' :
                systemStatus.status === 'warning' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {data.uptime.percentage}% uptime • {data.performance.avgResponseTime}ms avg response time
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <MdTimer className="text-green-600 text-2xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{data.uptime.percentage}%</p>
                <p className="text-xs text-gray-500">{Math.floor(data.uptime.uptimeHours)} hours</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MdSpeed className="text-blue-600 text-2xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">{data.performance.avgResponseTime}ms</p>
                <p className="text-xs text-gray-500">P95: {data.performance.p95ResponseTime}ms</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <MdError className="text-red-600 text-2xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Error Rate</p>
                <p className="text-2xl font-bold text-gray-900">{data.performance.errorRate}%</p>
                <p className="text-xs text-gray-500">{data.performance.throughput} req/min</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MdApi className="text-purple-600 text-2xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Services</p>
                <p className="text-2xl font-bold text-gray-900">{data.services.filter(s => s.status === 'healthy').length}/{data.services.length}</p>
                <p className="text-xs text-gray-500">services running</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* System Monitoring Tabs */}
      <Tabs 
        selectedKey={selectedTab} 
        onSelectionChange={(key) => setSelectedTab(key as string)}
        className="w-full"
      >
        <Tab key="overview" title="System Overview">
          <div className="space-y-6">
            {/* Infrastructure Metrics */}
            <Card>
              <CardHeader className="flex gap-3">
                <MdMonitor className="text-blue-500 text-xl" />
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">Infrastructure Metrics</p>
                  <p className="text-sm text-gray-500">Real-time resource utilization</p>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">CPU Usage</span>
                      <span className="font-medium">{data.infrastructure.cpu}%</span>
                    </div>
                    <Progress 
                      value={data.infrastructure.cpu} 
                      maxValue={100}
                      color={data.infrastructure.cpu > 80 ? "danger" : data.infrastructure.cpu > 60 ? "warning" : "success"}
                      size="sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Memory Usage</span>
                      <span className="font-medium">{data.infrastructure.memory}%</span>
                    </div>
                    <Progress 
                      value={data.infrastructure.memory} 
                      maxValue={100}
                      color={data.infrastructure.memory > 80 ? "danger" : data.infrastructure.memory > 60 ? "warning" : "success"}
                      size="sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Disk Usage</span>
                      <span className="font-medium">{data.infrastructure.disk}%</span>
                    </div>
                    <Progress 
                      value={data.infrastructure.disk} 
                      maxValue={100}
                      color={data.infrastructure.disk > 80 ? "danger" : data.infrastructure.disk > 60 ? "warning" : "success"}
                      size="sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Network I/O</span>
                      <span className="font-medium">{data.infrastructure.network} MB/s</span>
                    </div>
                    <Progress 
                      value={(data.infrastructure.network / 100) * 100} 
                      maxValue={100}
                      color="primary"
                      size="sm"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Service Status */}
            <Card>
              <CardHeader className="flex gap-3">
                <MdSettings className="text-green-500 text-xl" />
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">Service Status</p>
                  <p className="text-sm text-gray-500">Microservices health monitoring</p>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.services.map((service) => (
                    <div key={service.name} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{service.name}</h4>
                        <Chip 
                          color={statusColors[service.status as keyof typeof statusColors]} 
                          variant="flat" 
                          size="sm"
                        >
                          {service.status}
                        </Chip>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Response Time:</span>
                          <span className="font-medium">{service.responseTime}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Uptime:</span>
                          <span className="font-medium">{service.uptime}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>

        <Tab key="alerts" title="Alerts & Notifications">
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex gap-3">
                <MdNotifications className="text-orange-500 text-xl" />
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">System Alerts</p>
                  <p className="text-sm text-gray-500">Recent system alerts and notifications</p>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {data.alerts.map((alert) => (
                    <div key={alert.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className={`p-2 rounded-lg ${
                        alert.type === 'error' ? 'bg-red-100' :
                        alert.type === 'warning' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        {alert.type === 'error' && <MdError className="text-red-600" />}
                        {alert.type === 'warning' && <MdWarning className="text-yellow-600" />}
                        {alert.type === 'info' && <MdNotifications className="text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{alert.message}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-500">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                          <Chip 
                            color={alertTypeColors[alert.type as keyof typeof alertTypeColors]} 
                            variant="flat" 
                            size="sm"
                          >
                            {alert.severity}
                          </Chip>
                          <Chip 
                            color={alert.status === 'active' ? "warning" : "success"} 
                            variant="flat" 
                            size="sm"
                          >
                            {alert.status}
                          </Chip>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="flat"
                        startContent={<MdVisibility />}
                        onPress={() => handleViewAlert(alert)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>

        <Tab key="logs" title="Error Logs">
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex gap-3">
                <MdCode className="text-purple-500 text-xl" />
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">System Error Logs</p>
                  <p className="text-sm text-gray-500">Recent error and warning logs</p>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {data.logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-3 border border-gray-200 rounded-lg">
                      <Chip 
                        color={logLevelColors[log.level as keyof typeof logLevelColors]} 
                        variant="flat" 
                        size="sm"
                      >
                        {log.level}
                      </Chip>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{log.message}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>{log.service}</span>
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                          {log.count > 1 && (
                            <Chip color="warning" variant="flat" size="sm">
                              {log.count} occurrences
                            </Chip>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t mt-4">
                  <Button
                    variant="flat"
                    startContent={<MdDownload />}
                    className="w-full"
                  >
                    Download Full Log File
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>
      </Tabs>

      {/* Alert Details Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3 className="text-lg font-semibold">Alert Details</h3>
              </ModalHeader>
              <ModalBody>
                {selectedAlert && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">Alert Type</label>
                        <div className="mt-1">
                          <Chip 
                            color={alertTypeColors[selectedAlert.type as keyof typeof alertTypeColors]} 
                            variant="flat"
                          >
                            {selectedAlert.type.toUpperCase()}
                          </Chip>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Severity</label>
                        <p className="font-medium capitalize">{selectedAlert.severity}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Status</label>
                        <div className="mt-1">
                          <Chip 
                            color={selectedAlert.status === 'active' ? "warning" : "success"} 
                            variant="flat"
                          >
                            {selectedAlert.status}
                          </Chip>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Timestamp</label>
                        <p className="font-medium">{new Date(selectedAlert.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Message</label>
                      <p className="font-medium text-gray-900 mt-1">{selectedAlert.message}</p>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Mark as Resolved
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SystemHealth;
