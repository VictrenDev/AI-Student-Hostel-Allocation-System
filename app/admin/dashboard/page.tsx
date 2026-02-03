// app/admin/page.tsx - Updated version
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
import { getCompatibilityStats } from "@/src/actions/admin/compatibility";
import { seedStudentsAction } from "@/src/scripts/seed-students";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    withQuestionnaire: 0,
    allocated: 0,
    pendingAllocation: 0,
    averageCompatibility: 0,
    aiAccuracy: 92,
  });

  const [allocationStatus, setAllocationStatus] = useState({
    status: "ready",
    lastRun: new Date().toISOString(),
    estimatedTime: "15-20 minutes",
    matchesGenerated: 0,
    totalAllocationsValue: 0
  });

  const [compatibilityData, setCompatibilityData] = useState([
    { score: "90-100%", count: 0, color: "bg-green-500" },
    { score: "80-89%", count: 0, color: "bg-blue-500" },
    { score: "70-79%", count: 0, color: "bg-yellow-500" },
    { score: "60-69%", count: 0, color: "bg-orange-500" },
    { score: "Below 60%", count: 0, color: "bg-red-500" },
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch students and allocations count
      const studentsResult = await getAdminStudents();

      if (!studentsResult.success || !studentsResult.students) {
        throw new Error("Failed to fetch students");
      }

      const { students, totalAllocations } = studentsResult;

      // Fetch compatibility statistics
      const compatibilityStats = (await getCompatibilityStats()) ?? {
        averageCompatibility: 0,
        totalAllocations: 0,
        distribution: {
          "90-100%": 0,
          "80-89%": 0,
          "70-79%": 0,
          "60-69%": 0,
          "Below 60%": 0,
        },
      };
      const safeDistribution = compatibilityStats.distribution ?? {
        "90-100%": 0,
        "80-89%": 0,
        "70-79%": 0,
        "60-69%": 0,
        "Below 60%": 0,
      };

      const distributionData = [
        { score: "90-100%", count: safeDistribution["90-100%"], color: "bg-green-500" },
        { score: "80-89%", count: safeDistribution["80-89%"], color: "bg-blue-500" },
        { score: "70-79%", count: safeDistribution["70-79%"], color: "bg-yellow-500" },
        { score: "60-69%", count: safeDistribution["60-69%"], color: "bg-orange-500" },
        { score: "Below 60%", count: safeDistribution["Below 60%"], color: "bg-red-500" },
      ];
      console.log("compatibilityStats:", compatibilityStats);

      // Calculate students with questionnaire
      const withQuestionnaire = students.filter(s => s.hasQuestionnaire).length;



      setCompatibilityData(distributionData);

      // Update stats
      setStats({
        totalStudents: students.length,
        withQuestionnaire,
        allocated: totalAllocations || 0,
        pendingAllocation: Math.max(0, students.length - (totalAllocations || 0)),
        averageCompatibility: compatibilityStats.averageCompatibility,
        aiAccuracy: 92,
      });

      // Update allocation status
      setAllocationStatus(prev => ({
        ...prev,
        totalAllocationsValue: totalAllocations || 0,
        matchesGenerated: compatibilityStats.totalAllocations,
      }));

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const runAllocation = async () => {
    setAllocationStatus({
      ...allocationStatus,
      status: "running",
    });

    try {
      // Run AI traits generation and allocation
      const aiTraitsResults = await generateAITraitsForAllUsers();
      const allocationResult = await allocateStudentsAction();

      setAllocationStatus(prev => ({
        ...prev,
        status: "completed",
        lastRun: new Date().toISOString(),
        estimatedTime: "1 minute",
        matchesGenerated: aiTraitsResults?.processed || 0,
      }));

      // Refresh dashboard data after allocation
      setTimeout(() => {
        fetchDashboardData();
      }, 1000);

    } catch (error) {
      console.error("Allocation failed:", error);
      setAllocationStatus(prev => ({
        ...prev,
        status: "error",
      }));
    }
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

  // Calculate total count for percentage calculation
  const totalCompatibilityCount = compatibilityData.reduce((sum, item) => sum + item.count, 0);

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
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
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
          change="Based on registered users"
          color="blue"
          loading={loading}
        />
        <StatCard
          icon={<Brain className="w-8 h-8" />}
          title="Questionnaires"
          value={stats.withQuestionnaire}
          percentage={`${stats.totalStudents > 0 ? Math.round((stats.withQuestionnaire / stats.totalStudents) * 100) : 0}%`}
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
          change={stats.allocated > 0 ? `${stats.allocated} allocations` : "No allocations yet"}
          color="orange"
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
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
            {compatibilityData.map((item) => {
              const percentage = totalCompatibilityCount > 0
                ? (item.count / totalCompatibilityCount) * 100
                : 0;

              return (
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
                          width: `${percentage}%`,
                        }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {item.count}
                    </span>
                  </div>
                </div>
              );
            })}
            {totalCompatibilityCount === 0 && (
              <div className="text-center py-4 text-gray-500">
                No compatibility data available. Run allocation first.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component: Stat Card (keep as is from your original)
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
