// app/admin/hostels/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building,
  Home,
  Users,
  MapPin,
  ArrowLeft,
  Edit,
  User,
} from "lucide-react";
import { getHostelWithRooms } from "@/src/actions/admin/get-hostels";
import { toast } from "sonner";

type Hostel = {
  id: number;
  name: string;
  location: string;
  wardenName: string;
  totalRooms: number;
  totalCapacity: number;
  occupiedRooms: number;
  occupiedCapacity: number;
  rooms: any[];
};

export default function HostelDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch hostel if the id exists in the web url
    if (params.id) {
      fetchHostel();
    }
  }, [params.id]);

  const fetchHostel = async () => {
    try {
      // get the hostel information by the id of the hostel
      const res = await getHostelWithRooms({ id: Number(params.id) });
      if (!res.success) {
        console.log(res.error);
        return;
      }
      if (!res.data) {
        toast.error("No Data Found");
        setHostel(null);
        return;
      }
      const raw = res.data;
      // make backend match the frontend
      const adaptedHostel: Hostel = {
        id: raw.id,
        name: raw.name,
        location: raw.location,
        wardenName: raw.warden ?? "",
        totalRooms: raw.rooms.length,
        totalCapacity: raw.rooms.reduce((sum, room) => sum + room.capacity, 0),
        occupiedRooms: raw.rooms.filter((room) => room.occupied > 0).length,
        occupiedCapacity: raw.rooms.reduce(
          (sum, room) => sum + room.occupied,
          0,
        ),
        rooms: raw.rooms.map((room) => ({
          number: room.roomNumber,
          capacity: room.capacity,
          occupied: room.occupied,
          type: "Standard", // or derive later
        })),
      };
      setHostel(adaptedHostel);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hostel details...</p>
        </div>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Hostel Not Found
          </h3>
          <button
            onClick={() => router.push("/admin/hostels")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            ← Back to Hostels
          </button>
        </div>
      </div>
    );
  }

  const occupancy = Math.round(
    (hostel.occupiedCapacity / hostel.totalCapacity) * 100,
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push("/admin/hostels")}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to Hostels
          </button>
          {/*<Link
            href={`/admin/hostels/${hostel.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Edit size={16} />
            Edit
          </Link>*/}
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{hostel.name}</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={16} />
          <span>{hostel.location}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Capacity</p>
              <p className="text-2xl font-bold text-blue-600">
                {hostel.totalCapacity}
              </p>
            </div>
            <Users className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Rooms</p>
              <p className="text-2xl font-bold text-green-600">
                {hostel.totalRooms}
              </p>
            </div>
            <Home className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Occupancy</p>
              <p className="text-2xl font-bold text-purple-600">{occupancy}%</p>
            </div>
            <Building className="w-10 h-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Available</p>
              <p className="text-2xl font-bold text-orange-600">
                {hostel.totalCapacity - hostel.occupiedCapacity}
              </p>
            </div>
            <User className="w-10 h-10 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Warden Info */}
      {hostel.wardenName && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Warden Information
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">{hostel.wardenName}</p>
              <p className="text-gray-600">Hostel Warden</p>
            </div>
          </div>
        </div>
      )}

      {/* Rooms Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Rooms ({hostel.rooms?.length || 0})
        </h2>

        {hostel.rooms && hostel.rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/*{hostel.rooms.slice(0, 6).map((room, index) => (*/}
            {hostel.rooms.map((room, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-800">
                    Room {room.number}
                  </h3>
                  <span className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {room.type}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Capacity</span>
                    <span className="font-medium text-gray-800">
                      {room.occupied}/{room.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: `${(room.occupied / room.capacity) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No rooms configured yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
