// app/admin/layout.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building,
  Home,
  Menu,
  X,
  LogOut,
  Settings,
  BarChart3,
  PlusCircle,
  List,
  UserCog,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "All Students",
      path: "/admin/students",
      icon: <Users size={20} />,
    },
    {
      name: "Create Hostel",
      path: "/admin/hostels/create",
      icon: <PlusCircle size={20} />,
    },
    {
      name: "Manage Hostels",
      path: "/admin/hostels",
      icon: <Building size={20} />,
    },
    {
      name: "Room Allocation",
      path: "/admin/allocation",
      icon: <Home size={20} />,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: <BarChart3 size={20} />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings size={20} />,
    },
  ];

  const handleLogout = () => {
    // Clear admin session
    document.cookie = "admin_token=; path=/; max-age=0";
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-50)] to-white">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-lg"
          style={{
            background: "var(--gradient-element)",
          }}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-xl z-40
          transition-all duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${collapsed ? "w-20" : "w-64"}
          lg:w-64
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: "var(--gradient-primary)" }}
              >
                <UserCog className="w-6 h-6 text-white" />
              </div>
              {!collapsed && (
                <div>
                  <h1 className="text-xl font-bold text-[var(--color-primary-700)]">
                    Admin Portal
                  </h1>
                  <p className="text-xs text-[var(--color-text-light)]">
                    HostelEase Management
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl transition-all
                    ${
                      isActive
                        ? "text-white"
                        : "text-[var(--color-primary-700)] hover:bg-[var(--color-primary-50)]"
                    }
                    ${collapsed ? "justify-center" : ""}
                  `}
                  style={{
                    background: isActive
                      ? "var(--gradient-primary)"
                      : "transparent",
                  }}
                >
                  <span
                    className={
                      isActive
                        ? "text-white"
                        : "text-[var(--color-primary-500)]"
                    }
                  >
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Collapse Toggle & Logout */}
          <div className="p-4 border-t border-[var(--color-border)] space-y-4">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex items-center gap-3 p-3 rounded-xl w-full text-[var(--color-primary-700)] hover:bg-[var(--color-primary-50)]"
            >
              <Settings size={20} />
              {!collapsed && <span>Toggle Sidebar</span>}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 rounded-xl w-full text-red-600 hover:bg-red-50"
            >
              <LogOut size={20} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`
        transition-all duration-300
        lg:pl-64
        pt-20 lg:pt-0
      `}
      >
        {/* Top Bar */}
        <header className="fixed top-0 right-0 left-0 lg:left-64 bg-white/80 backdrop-blur-sm border-b border-[var(--color-border)] z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[var(--color-primary-700)]">
                Admin Dashboard
              </h1>
              <p className="text-sm text-[var(--color-text-light)]">
                Welcome back, Administrator
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-[var(--color-primary-700)]">
                  Admin User
                </p>
                <p className="text-xs text-[var(--color-text-light)]">
                  administrator@hostelease.edu
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)] flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 mt-16">{children}</div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
