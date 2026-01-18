// app/admin/hostels/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building,
  Home,
  Users,
  Search,
  Plus,
  Trash2,
} from "lucide-react";
import { getAllHostelsWithRooms } from "@/src/actions/admin/get-hostels";
import { allocateStudentsAction } from "@/src/actions/admin/allocation";
import GenerateAITraitsButton from "../ai-traits-button";

type Room = {
  id: number;
  capacity: number;
  occupied: number; // or whatever field tracks students
};

type Hostel = {
  id: number;
  name: string;
  gender: "male" | "female" | "mixed";
  location: string;
  warden: string | null;
  rooms: Room[];

  // derived (for UI)
  totalRooms: number;
  occupiedRooms: number;
  totalCapacity: number;
  occupiedCapacity: number;
};

export default function HostelsPage() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const res = await getAllHostelsWithRooms();

      if (!res.success) {
        console.error(res.error);
        return;
      }
      if (!res.data) {
        return
      }
      const transformed: Hostel[] = res.data.map((hostel) => {
        const totalRooms = hostel.rooms.length;
        const occupiedRooms = hostel.rooms.filter(
          (room) => room.occupied > 0,
        ).length;
        const totalCapacity = hostel.rooms.reduce(
          (sum, room) => sum + room.capacity,
          0,
        );
        const occupiedCapacity = hostel.rooms.reduce(
          (sum, room) => sum + room.occupied,
          0,
        );

        return {
          ...hostel,
          totalRooms,
          occupiedRooms,
          totalCapacity,
          occupiedCapacity,
        };
      });

      setHostels(transformed);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHostels = hostels.filter(
    (hostel) =>
      hostel.name.toLowerCase().includes(search.toLowerCase()) ||
      hostel.location.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this hostel?")) {
      try {
        const res = await fetch(`/api/admin/hostels/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchHostels();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hostels</h1>
          <p className="text-gray-600">Manage hostel buildings and rooms</p>
        </div>
        <GenerateAITraitsButton />
        <form action={allocateStudentsAction}>
          <button type="submit" className="p-2 bg-blue-500 text-white">
            Run Allocation
          </button>
        </form>
        <Link
          href="/admin/hostels/create"
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus size={18} />
          Add Hostel
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search hostels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Hostels Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hostels...</p>
        </div>
      ) : filteredHostels.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No hostels found
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first hostel to get started
          </p>
          <Link
            href="/admin/hostels/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={18} />
            Create Hostel
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHostels.map((hostel) => {
            const occupancy = Math.round(
              (hostel.occupiedCapacity / hostel.totalCapacity) * 100,
            );

            return (
              <div
                key={hostel.id}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {hostel.name}
                      </h3>
                      <p className="text-gray-600">{hostel.location}</p>
                    </div>
                    <Building className="w-10 h-10 text-blue-500" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Occupancy</span>
                        <span className="font-semibold text-gray-800">
                          {occupancy}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${occupancy}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Rooms</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Home className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold text-gray-800">
                            {hostel.occupiedRooms}/{hostel.totalRooms}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Capacity</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold text-gray-800">
                            {hostel.occupiedCapacity}/{hostel.totalCapacity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6 pt-6 border-t">
                    <Link
                      href={`/admin/hostels/${hostel.id}`}
                      className="flex-1 py-2 text-center bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(hostel.id)}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
