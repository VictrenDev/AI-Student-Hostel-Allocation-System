// app/admin/hostels/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building,
  Home,
  Users,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Plus,
  MoreVertical,
  CheckCircle,
  XCircle,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

type Hostel = {
  id: number;
  name: string;
  code: string;
  location: string;
  gender: string;
  totalRooms: number;
  occupiedRooms: number;
  totalCapacity: number;
  occupiedCapacity: number;
  status: "active" | "maintenance" | "full";
  amenities: string[];
  wardenName: string;
};

export default function ManageHostelsPage() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/hostels");
      const data = await response.json();
      if (data.success) {
        setHostels(data.hostels);
      }
    } catch (error) {
      toast.error("Failed to load hostels");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (hostelId: number) => {
    try {
      const response = await fetch(`/api/admin/hostels/${hostelId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Hostel deleted successfully");
        setHostels(hostels.filter((h) => h.id !== hostelId));
        setDeleteConfirm(null);
      } else {
        toast.error(data.error || "Failed to delete hostel");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const filteredHostels = hostels.filter((hostel) => {
    const matchesSearch =
      hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hostel.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hostel.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && hostel.status === "active") ||
      (filter === "maintenance" && hostel.status === "maintenance") ||
      (filter === "full" && hostel.status === "full");

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "maintenance":
        return "bg-yellow-100 text-yellow-700";
      case "full":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "maintenance":
        return <MoreVertical className="w-4 h-4" />;
      case "full":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const calculateOccupancy = (hostel: Hostel) => {
    return Math.round((hostel.occupiedCapacity / hostel.totalCapacity) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-primary-700)]">
            Manage Hostels
          </h1>
          <p className="text-[var(--color-text-light)]">
            View and manage all hostel buildings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/hostels/create"
            className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Plus size={18} />
            Add Hostel
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_var(--color-shadow)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Hostels</p>
              <p className="text-2xl font-bold text-blue-600">
                {hostels.length}
              </p>
            </div>
            <Building className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_var(--color-shadow)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Rooms</p>
              <p className="text-2xl font-bold text-green-600">
                {hostels.reduce((sum, h) => sum + h.totalRooms, 0)}
              </p>
            </div>
            <Home className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_var(--color-shadow)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Occupancy Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {hostels.length > 0
                  ? Math.round(
                      (hostels.reduce((sum, h) => sum + h.occupiedCapacity, 0) /
                        hostels.reduce((sum, h) => sum + h.totalCapacity, 0)) *
                        100,
                    ) + "%"
                  : "0%"}
              </p>
            </div>
            <BarChart3 className="w-10 h-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_var(--color-shadow)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Available Capacity</p>
              <p className="text-2xl font-bold text-orange-600">
                {hostels.reduce(
                  (sum, h) => sum + (h.totalCapacity - h.occupiedCapacity),
                  0,
                )}
              </p>
            </div>
            <Users className="w-10 h-10 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_var(--color-shadow)] p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search hostels by name, code, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-[2px] border-[var(--color-border)] bg-[var(--color-input-bg)] focus:border-[var(--color-primary-500)] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border-[2px] border-[var(--color-border)] bg-[var(--color-input-bg)] focus:border-[var(--color-primary-500)] focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="full">Full</option>
            </select>

            <button
              onClick={fetchHostels}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-[var(--color-primary-700)] hover:bg-[var(--color-primary-50)]"
            >
              <Filter className="w-5 h-5" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Hostels Table */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_var(--color-shadow)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-[var(--color-primary-500)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[var(--color-text-light)]">Loading hostels...</p>
          </div>
        ) : filteredHostels.length === 0 ? (
          <div className="p-12 text-center">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-[var(--color-text-light)] text-lg">
              No hostels found
            </p>
            <p className="text-gray-400 mt-2">
              {searchTerm
                ? "Try a different search term"
                : "Add your first hostel to get started"}
            </p>
            <Link
              href="/admin/hostels/create"
              className="inline-block mt-4 px-6 py-2 text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] font-medium"
            >
              Create Hostel →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left p-6 font-semibold text-[var(--color-primary-700)]">
                    Hostel Details
                  </th>
                  <th className="text-left p-6 font-semibold text-[var(--color-primary-700)]">
                    Capacity
                  </th>
                  <th className="text-left p-6 font-semibold text-[var(--color-primary-700)]">
                    Occupancy
                  </th>
                  <th className="text-left p-6 font-semibold text-[var(--color-primary-700)]">
                    Status
                  </th>
                  <th className="text-left p-6 font-semibold text-[var(--color-primary-700)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredHostels.map((hostel) => (
                  <tr
                    key={hostel.id}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-primary-50)]"
                  >
                    <td className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                          <Building size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--color-primary-700)]">
                            {hostel.name}
                          </h3>
                          <p className="text-sm text-[var(--color-text-light)]">
                            {hostel.code} • {hostel.location}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {hostel.gender === "mixed"
                              ? "Mixed Gender"
                              : hostel.gender + " Only"}{" "}
                            • Warden: {hostel.wardenName}
                          </p>
                          {hostel.amenities && hostel.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {hostel.amenities
                                .slice(0, 3)
                                .map((amenity, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                                  >
                                    {amenity}
                                  </span>
                                ))}
                              {hostel.amenities.length > 3 && (
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                  +{hostel.amenities.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="space-y-1">
                        <p className="text-sm text-[var(--color-primary-700)]">
                          {hostel.occupiedCapacity} / {hostel.totalCapacity}{" "}
                          students
                        </p>
                        <p className="text-sm text-gray-500">
                          {hostel.occupiedRooms} / {hostel.totalRooms} rooms
                        </p>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Occupancy</span>
                          <span className="font-semibold text-[var(--color-primary-700)]">
                            {calculateOccupancy(hostel)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                            style={{ width: `${calculateOccupancy(hostel)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(hostel.status)}`}
                      >
                        {getStatusIcon(hostel.status)}
                        {hostel.status.charAt(0).toUpperCase() +
                          hostel.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/hostels/${hostel.id}`}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/admin/hostels/${hostel.id}/edit`}
                          className="p-2 rounded-lg text-green-600 hover:bg-green-50"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        {deleteConfirm === hostel.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDelete(hostel.id)}
                              className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(hostel.id)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {filteredHostels.length > 0 && (
        <div className="text-center text-sm text-[var(--color-text-light)]">
          Showing {filteredHostels.length} of {hostels.length} hostels
          {searchTerm && ` • Filtered by: "${searchTerm}"`}
          {filter !== "all" && ` • Status: ${filter}`}
        </div>
      )}
    </div>
  );
}
