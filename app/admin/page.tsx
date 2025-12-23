// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Building,
  Home,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  ArrowRight,
  BarChart3,
  UserPlus,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

type DashboardStats = {
  totalStudents: number;
  totalHostels: number;
  allocatedRooms: number;
  availableRooms: number;
  pendingAllocations: number;
  questionnaireCompleted: number;
  aiTraitsGenerated: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalHostels: 0,
    allocatedRooms: 0,
    availableRooms: 0,
    pendingAllocations: 0,
    questionnaireCompleted: 0,
    aiTraitsGenerated: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await fetch("/api/admin/dashboard-stats");
      const statsData = await statsRes.json();

      // Fetch recent activity
      const activityRes = await fetch("/api/admin/recent-activity");
      const activityData = await activityRes.json();

      setStats(statsData);
      setRecentActivity(activityData.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon,
    color,
    change,
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    change?: string;
  }) => (
    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_var(--color-shadow)] hover:shadow-[0_8px_30px_var(--color-shadow)] transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center`}
          style={{ background: color }}
        >
          <div className="text-white">{icon}</div>
        </div>
        {change && (
          <span className="text-sm font-medium text-green-500">{change}</span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-[var(--color-primary-700)] mb-1">
        {loading ? "..." : value.toLocaleString()}
      </h3>
      <p className="text-[var(--color-text-light)]">{title}</p>
    </div>
  );

  const QuickAction = ({
    title,
    description,
    icon,
    link,
    color,
  }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    link: string;
    color: string;
  }) => (
    <Link href={link}>
      <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_var(--color-shadow)] hover:shadow-[0_8px_30px_var(--color-shadow)] transition-all hover:translate-y-[-2px] cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center`}
            style={{ background: color }}
          >
            <div className="text-white">{icon}</div>
          </div>
          <ArrowRight className="w-5 h-5 text-[var(--color-text-light)]" />
        </div>
        <h4 className="text-lg font-semibold text-[var(--color-primary-700)] mb-2">
          {title}
        </h4>
        <p className="text-sm text-[var(--color-text-light)]">{description}</p>
      </div>
    </Link>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-primary-700)]">
            Dashboard Overview
          </h1>
          <p className="text-[var(--color-text-light)]">
            Welcome to the HostelEase administration panel
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[var(--color-primary-700)] hover:bg-[var(--color-primary-50)] transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <div className="text-sm text-[var(--color-text-light)]">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<Users size={24} />}
          color="linear-gradient(135deg, #4a6fa5, #2c3e50)"
          change="+12%"
        />
        <StatCard
          title="Hostels"
          value={stats.totalHostels}
          icon={<Building size={24} />}
          color="linear-gradient(135deg, #10b981, #047857)"
        />
        <StatCard
          title="Allocated Rooms"
          value={stats.allocatedRooms}
          icon={<Home size={24} />}
          color="linear-gradient(135deg, #8b5cf6, #6d28d9)"
          change="+8%"
        />
        <StatCard
          title="Pending Allocations"
          value={stats.pendingAllocations}
          icon={<Clock size={24} />}
          color="linear-gradient(135deg, #f59e0b, #d97706)"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Questionnaire Completed"
          value={stats.questionnaireCompleted}
          icon={<CheckCircle size={24} />}
          color="linear-gradient(135deg, #3b82f6, #1d4ed8)"
        />
        <StatCard
          title="AI Traits Generated"
          value={stats.aiTraitsGenerated}
          icon={<TrendingUp size={24} />}
          color="linear-gradient(135deg, #ec4899, #be185d)"
        />
        <StatCard
          title="Available Rooms"
          value={stats.availableRooms}
          icon={<Home size={24} />}
          color="linear-gradient(135deg, #14b8a6, #0d9488)"
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-[var(--color-primary-700)] mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickAction
              title="Create Hostel"
              description="Add new hostel building with rooms"
              icon={<Building size={24} />}
              link="/admin/hostels/create"
              color="linear-gradient(135deg, #4a6fa5, #2c3e50)"
            />
            <QuickAction
              title="Allocate Rooms"
              description="Start room allocation process"
              icon={<Home size={24} />}
              link="/admin/allocation"
              color="linear-gradient(135deg, #10b981, #047857)"
            />
            <QuickAction
              title="View Students"
              description="Manage all registered students"
              icon={<Users size={24} />}
              link="/admin/students"
              color="linear-gradient(135deg, #8b5cf6, #6d28d9)"
            />
            <QuickAction
              title="Generate Reports"
              description="Create allocation reports"
              icon={<BarChart3 size={24} />}
              link="/admin/reports"
              color="linear-gradient(135deg, #f59e0b, #d97706)"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_var(--color-shadow)]">
          <h2 className="text-xl font-bold text-[var(--color-primary-700)] mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-primary-50)] transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === "allocation"
                        ? "bg-green-100"
                        : activity.type === "registration"
                          ? "bg-blue-100"
                          : activity.type === "update"
                            ? "bg-yellow-100"
                            : "bg-gray-100"
                    }`}
                  >
                    {activity.type === "allocation" ? (
                      <Home className="w-5 h-5 text-green-600" />
                    ) : activity.type === "registration" ? (
                      <UserPlus className="w-5 h-5 text-blue-600" />
                    ) : (
                      <RefreshCw className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--color-primary-700)]">
                      {activity.description}
                    </p>
                    <p className="text-xs text-[var(--color-text-light)]">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-[var(--color-text-light)] mx-auto mb-4" />
                <p className="text-[var(--color-text-light)]">
                  No recent activity
                </p>
              </div>
            )}
          </div>
          {recentActivity.length > 0 && (
            <Link
              href="/admin/activity"
              className="block mt-6 text-center text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] font-medium"
            >
              View All Activity →
            </Link>
          )}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_var(--color-shadow)]">
        <h2 className="text-xl font-bold text-[var(--color-primary-700)] mb-6">
          System Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-green-50 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-700">AI Matching</span>
            </div>
            <p className="text-sm text-green-600 mt-2">Running normally</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-blue-700">Database</span>
            </div>
            <p className="text-sm text-blue-600 mt-2">Connected</p>
          </div>
          <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="font-medium text-yellow-700">Allocation</span>
            </div>
            <p className="text-sm text-yellow-600 mt-2">
              {stats.pendingAllocations > 0
                ? `${stats.pendingAllocations} pending`
                : "Up to date"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
