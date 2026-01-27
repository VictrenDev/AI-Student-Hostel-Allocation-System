// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Brain,
  Users,
  Home,
  TrendingUp,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  RefreshCw,
  Download,
  Calendar,
  Target,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { allocateStudentsAction } from "@/src/actions/admin/allocation";
import { generateAITraitsForAllUsers } from "@/src/lib/ai/generate-ai-traits";
import { getAdminStudents } from "@/src/actions/admin/students";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    withQuestionnaire: 0,
    allocated: 0,
    pendingAllocation: 0,
    averageCompatibility: 0,
    aiAccuracy: 0,
  });

  const [allocationStatus, setAllocationStatus] = useState({
    status: "ready", // "ready", "running", "completed", "error"
    lastRun: "2024-03-10T14:30:00Z",
    estimatedTime: "15-20 minutes",
    matchesGenerated: 0,
    totalAllocationsValue: 0
  });

  const [compatibilityData] = useState([
    { score: "90-100%", count: 45, color: "bg-green-500" },
    { score: "80-89%", count: 62, color: "bg-blue-500" },
    { score: "70-79%", count: 58, color: "bg-yellow-500" },
    { score: "60-69%", count: 32, color: "bg-orange-500" },
    { score: "Below 60%", count: 18, color: "bg-red-500" },
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { students, totalAllocations } = await getAdminStudents()

      setAllocationStatus({
        ...allocationStatus,
        totalAllocationsValue: totalAllocations || 0,

      })
      if (!totalAllocations) {
        return
      }
      setStats({
        totalStudents: students.length,
        withQuestionnaire: students.filter((s) => s.hasQuestionnaire).length,
        allocated: 156,
        pendingAllocation: students.length - totalAllocations,
        averageCompatibility: 84,
        aiAccuracy: 92,
      });
      console.log(allocationStatus.totalAllocationsValue,)

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);

    } finally {
      setLoading(false)
    }
  };

  const runAllocation = async () => {
    setAllocationStatus({
      ...allocationStatus,
      status: "running",
    });
    const aiTraitsResults = await generateAITraitsForAllUsers()
    await allocateStudentsAction()

    setAllocationStatus({
      ...allocationStatus,
      status: "completed",
      lastRun: new Date().toISOString(),
      estimatedTime: "1 minute",
      matchesGenerated: aiTraitsResults.processed,

    })
    setTimeout(() => { }, 1000)
    console.log(aiTraitsResults)
    fetchDashboardData();
  };

  const getStatusConfig = () => {
    switch (allocationStatus.status) {
      case "running":
        return {
          icon: <RefreshCw className="w-5 h-5 animate-spin" />,
          title: "Allocation in Progress",
          description: "Our AI is currently creating Compatibility scores",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      case "completed":
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          title: "Allocation Complete",
          description: `${allocationStatus.matchesGenerated} new matches generated.`,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "error":
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          title: "Allocation Failed",
          description: "There was an error during allocation.",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      default:
        return {
          icon: <Clock className="w-5 h-5" />,
          title: "Ready for Allocation",
          description:
            "Click 'Run Allocation' to start the AI matching process.",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              AI Matching Dashboard
            </h1>
            <p className="text-gray-600">
              Monitor and control the AI-powered hostel allocation system
            </p>
          </div>
          {/*<div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>*/}
        </div>
      </div>

      {/* Allocation Status Card */}
      <div
        className={`rounded-2xl ${statusConfig.bgColor} border-2 ${statusConfig.borderColor} p-6 mb-8`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl ${statusConfig.bgColor} flex items-center justify-center ${statusConfig.color}`}
            >
              {statusConfig.icon}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {statusConfig.title}
              </h2>
              <p className="text-gray-600">{statusConfig.description}</p>
              {allocationStatus.status === "running" && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full animate-pulse w-3/4"></div>
                  </div>
                  <span className="text-sm text-gray-500">
                    Estimated time: {allocationStatus.estimatedTime}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={runAllocation}
            disabled={allocationStatus.status === "running"}
            className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${allocationStatus.status === "running"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90"
              } text-white`}
          >
            {allocationStatus.status === "running" ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Allocating...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Run AI Allocation
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users className="w-8 h-8" />}
          title="Total Students"
          value={stats.totalStudents}
          change="+12 this week"
          color="blue"
          loading={loading}
        />
        <StatCard
          icon={<Brain className="w-8 h-8" />}
          title="Questionnaires"
          value={stats.withQuestionnaire}
          percentage={`${Math.round((stats.withQuestionnaire / stats.totalStudents) * 100) || 0}%`}
          color="green"
          loading={loading}
        />
        <StatCard
          icon={<Home className="w-8 h-8" />}
          title="Allocated"
          value={allocationStatus.totalAllocationsValue}
          change={`${stats.pendingAllocation} pending`}
          color="purple"
          loading={loading}
        />
        <StatCard
          icon={<TrendingUp className="w-8 h-8" />}
          title="Avg Compatibility"
          value={`${stats.averageCompatibility}%`}
          change="+5% from last batch"
          color="orange"
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Left Column: AI Analysis */}
        <div className="lg:col-span-2 space-y-8">
          {/* Compatibility Distribution */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  Compatibility Score Distribution
                </h3>
                <p className="text-gray-500">How well students are matched</p>
              </div>
              <BarChart3 className="w-6 h-6 text-blue-500" />
            </div>
            <div className="space-y-4">
              {compatibilityData.map((item) => (
                <div
                  key={item.score}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="font-medium text-gray-700">
                      {item.score}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{
                          width: `${(item.count / compatibilityData.reduce((sum, d) => sum + d.count, 0)) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Performance Metrics */}
          {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard
              icon={<Target className="w-6 h-6" />}
              title="AI Matching Accuracy"
              value={`${stats.aiAccuracy}%`}
              description="Based on historical allocation success"
              trend="+2.3%"
              color="green"
            />
            <MetricCard
              icon={<Zap className="w-6 h-6" />}
              title="Processing Speed"
              value="42 sec/match"
              description="Average time per student"
              trend="-15% faster"
              color="blue"
            />
            <MetricCard
              icon={<Shield className="w-6 h-6" />}
              title="Conflict Reduction"
              value="87%"
              description="Compared to manual allocation"
              trend="+12% improvement"
              color="purple"
            />
            <MetricCard
              icon={<Calendar className="w-6 h-6" />}
              title="Last Allocation"
              value={new Date(allocationStatus.lastRun).toLocaleDateString()}
              description={`Generated ${allocationStatus.matchesGenerated} matches`}
              trend=""
              color="orange"
            />
          </div>*/}
        </div>

        {/* Right Column: Quick Actions & Insights */}
        <div className="space-y-8">
          {/* Quick Actions */}
          {/*<div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                href="/admin/students"
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Users className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-800">Manage Students</p>
                  <p className="text-sm text-gray-500">
                    View and edit student profiles
                  </p>
                </div>
              </Link>
              <Link
                href="/admin/hostels"
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Home className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-800">Hostel Management</p>
                  <p className="text-sm text-gray-500">
                    Configure rooms and blocks
                  </p>
                </div>
              </Link>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                <Brain className="w-5 h-5 text-purple-500" />
                <div className="text-left">
                  <p className="font-medium text-gray-800">
                    Configure AI Settings
                  </p>
                  <p className="text-sm text-gray-500">
                    Adjust matching parameters
                  </p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                <BarChart3 className="w-5 h-5 text-orange-500" />
                <div className="text-left">
                  <p className="font-medium text-gray-800">Generate Reports</p>
                  <p className="text-sm text-gray-500">
                    Detailed allocation analysis
                  </p>
                </div>
              </button>
            </div>
          </div>*/}

          {/* System Status */}
          {/*<div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              System Status
            </h3>
            <div className="space-y-4">
              <StatusItem
                label="Database Connection"
                status="online"
                description="Connected to PostgreSQL"
              />
              <StatusItem
                label="AI Service"
                status="online"
                description="OpenAI API operational"
              />
              <StatusItem
                label="Email Service"
                status="online"
                description="Notifications enabled"
              />
              <StatusItem
                label="Backup System"
                status="warning"
                description="Last backup: 2 days ago"
              />
            </div>
          </div>*/}
        </div>
      </div>
    </div>
  );
}

// Component: Stat Card
function StatCard({
  icon,
  title,
  value,
  percentage,
  change,
  color,
  loading,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  percentage?: string;
  change?: string;
  color: string;
  loading: boolean;
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-500",
    green: "bg-green-50 text-green-500",
    purple: "bg-purple-50 text-purple-500",
    orange: "bg-orange-50 text-orange-500",
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}
        >
          {icon}
        </div>
        {percentage && (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${colorClasses[color as keyof typeof colorClasses]}`}
          >
            {percentage}
          </span>
        )}
      </div>
      {loading ? (
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
      ) : (
        <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
      )}
      <p className="text-gray-600 mb-2">{title}</p>
      {change && <p className="text-sm text-gray-500">{change}</p>}
    </div>
  );
}

// Component: Metric Card
function MetricCard({
  icon,
  title,
  value,
  description,
  trend,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  trend: string;
  color: string;
}) {
  const colorClasses = {
    green: "text-green-600 bg-green-50",
    blue: "text-blue-600 bg-blue-50",
    purple: "text-purple-600 bg-purple-50",
    orange: "text-orange-600 bg-orange-50",
  };

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}
        >
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        {trend && (
          <span
            className={`text-sm font-medium ${colorClasses[color as keyof typeof colorClasses]} px-2 py-1 rounded`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

// Component: Status Item
function StatusItem({
  label,
  status,
  description,
}: {
  label: string;
  status: "online" | "warning" | "error";
  description: string;
}) {
  const statusConfig = {
    online: {
      color: "text-green-500",
      bg: "bg-green-100",
      label: "Online",
    },
    warning: {
      color: "text-yellow-500",
      bg: "bg-yellow-100",
      label: "Warning",
    },
    error: {
      color: "text-red-500",
      bg: "bg-red-100",
      label: "Error",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-800">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
      >
        {config.label}
      </span>
    </div>
  );
}
