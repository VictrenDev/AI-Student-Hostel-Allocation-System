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
  Phone,
  Mail,
  Wifi,
  Dumbbell,
  Utensils,
  ArrowLeft,
  Edit,
  Calendar,
  Bed,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";

type HostelDetails = {
  id: number;
  name: string;
  code: string;
  location: string;
  description: string;
  gender: string;
  totalFloors: number;
  totalRooms: number;
  totalCapacity: number;
  occupiedCapacity: number;
  wardenName: string;
  wardenContact: string;
  wardenEmail: string;
  amenities: string[];
  rules: string;
  status: string;
  rooms: {
    id: number;
    number: string;
    floor: number;
    capacity: number;
    type: string;
    occupied: number;
    students: {
      id: number;
      name: string;
      email: string;
    }[];
  }[];
};

export default function HostelDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [hostel, setHostel] = useState<HostelDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchHostelDetails();
  }, [params.id]);

  const fetchHostelDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/hostels/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setHostel(data.hostel);
      }
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
          <div className="w-12 h-12 border-4 border-[var(--color-primary-500)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--color-text-light)]">
            Loading hostel details...
          </p>
        </div>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Hostel Not Found
          </h3>
          <p className="text-gray-600 mb-6">
            The hostel you're looking for doesn't exist.
          </p>
          <Link
            href="/admin/hostels"
            className="px-6 py-3 rounded-full text-white font-semibold"
            style={{ background: "var(--gradient-primary)" }}
          >
            ← Back to Hostels
          </Link>
        </div>
      </div>
    );
  }

  const calculateOccupancy = () => {
    return Math.round((hostel.occupiedCapacity / hostel.totalCapacity) * 100);
  };

  const availableRooms = hostel.rooms.filter(
    (room) => room.occupied < room.capacity,
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/hostels"
            className="flex items-center gap-2 text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)]"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-primary-700)]">
              {hostel.name}
            </h1>
            <p className="text-[var(--color-text-light)]">
              {hostel.code} • {hostel.location}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/hostels/${hostel.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[var(--color-primary-700)] hover:bg-[var(--color-primary-50)]"
          >
            <Edit size={16} />
            Edit Hostel
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_var(--color-shadow)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Capacity</p>
              <p className="text-2xl font-bold text-blue-600">
                {hostel.totalCapacity}
              </p>
            </div>
            <Users className="w-10 h-10 text-blue-500" />
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              {hostel.occupiedCapacity} occupied
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_var(--color-shadow)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Rooms</p>
              <p className="text-2xl font-bold text-green-600">
                {hostel.totalRooms}
              </p>
            </div>
            <Home className="w-10 h-10 text-green-500" />
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              {availableRooms} rooms available
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_var(--color-shadow)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Occupancy Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {calculateOccupancy()}%
              </p>
            </div>
            <Building className="w-10 h-10 text-purple-500" />
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                style={{ width: `${calculateOccupancy()}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_var(--color-shadow)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Floors</p>
              <p className="text-2xl font-bold text-orange-600">
                {hostel.totalFloors}
              </p>
            </div>
            <Bed className="w-10 h-10 text-orange-500" />
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600 capitalize">
              {hostel.gender} hostel
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_var(--color-shadow)] overflow-hidden">
        <div className="border-b border-[var(--color-border)]">
          <div className="flex overflow-x-auto">
            {["overview", "rooms", "students", "amenities", "rules"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                  px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors
                  ${
                    activeTab === tab
                      ? "border-[var(--color-primary-500)] text-[var(--color-primary-700)]"
                      : "border-transparent text-[var(--color-text-light)] hover:text-[var(--color-primary-500)]"
                  }
                `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="p-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-primary-700)] mb-4">
                    Hostel Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[var(--color-primary-500)] mt-0.5" />
                      <div>
                        <p className="font-medium text-[var(--color-primary-700)]">
                          Location
                        </p>
                        <p className="text-[var(--color-text-light)]">
                          {hostel.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building className="w-5 h-5 text-[var(--color-primary-500)] mt-0.5" />
                      <div>
                        <p className="font-medium text-[var(--color-primary-700)]">
                          Building Type
                        </p>
                        <p className="text-[var(--color-text-light)] capitalize">
                          {hostel.gender === "mixed"
                            ? "Mixed Gender (Separate Floors)"
                            : `${hostel.gender} Only`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-[var(--color-primary-500)] mt-0.5" />
                      <div>
                        <p className="font-medium text-[var(--color-primary-700)]">
                          Status
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${hostel.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                        >
                          {hostel.status === "active" ? (
                            <CheckCircle size={14} />
                          ) : (
                            <XCircle size={14} />
                          )}
                          {hostel.status.charAt(0).toUpperCase() +
                            hostel.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-primary-700)] mb-4">
                    Warden Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-[var(--color-primary-500)] mt-0.5" />
                      <div>
                        <p className="font-medium text-[var(--color-primary-700)]">
                          Warden Name
                        </p>
                        <p className="text-[var(--color-text-light)]">
                          {hostel.wardenName}
                        </p>
                      </div>
                    </div>
                    {hostel.wardenContact && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-[var(--color-primary-500)] mt-0.5" />
                        <div>
                          <p className="font-medium text-[var(--color-primary-700)]">
                            Contact
                          </p>
                          <p className="text-[var(--color-text-light)]">
                            {hostel.wardenContact}
                          </p>
                        </div>
                      </div>
                    )}
                    {hostel.wardenEmail && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-[var(--color-primary-500)] mt-0.5" />
                        <div>
                          <p className="font-medium text-[var(--color-primary-700)]">
                            Email
                          </p>
                          <p className="text-[var(--color-text-light)]">
                            {hostel.wardenEmail}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {hostel.description && (
                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-primary-700)] mb-4">
                    Description
                  </h3>
                  <div className="p-4 bg-[var(--color-primary-50)] rounded-xl">
                    <p className="text-[var(--color-primary-700)]">
                      {hostel.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rooms Tab */}
          {activeTab === "rooms" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[var(--color-primary-700)]">
                  Rooms ({hostel.rooms.length})
                </h3>
                <div className="text-sm text-[var(--color-text-light)]">
                  {availableRooms} rooms available
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostel.rooms.map((room) => (
                  <div
                    key={room.id}
                    className="border border-[var(--color-border)] rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-[var(--color-primary-700)]">
                          Room {room.number}
                        </h4>
                        <p className="text-sm text-[var(--color-text-light)]">
                          Floor {room.floor} • {room.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {room.occupied}/{room.capacity}
                        </p>
                        <p className="text-xs text-gray-500">Occupied</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Capacity
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                            style={{
                              width: `${(room.occupied / room.capacity) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      {room.students && room.students.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Occupants ({room.students.length})
                          </p>
                          <div className="space-y-2">
                            {room.students.map((student) => (
                              <div
                                key={student.id}
                                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                              >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm">
                                  {student.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800">
                                    {student.name}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {student.email}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {room.occupied < room.capacity && (
                        <button className="w-full py-2 text-sm text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)] rounded-lg transition-colors">
                          + Assign Student
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-primary-700)] mb-6">
                Students ({hostel.occupiedCapacity})
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]">
                      <th className="text-left p-4 font-semibold text-[var(--color-primary-700)]">
                        Student
                      </th>
                      <th className="text-left p-4 font-semibold text-[var(--color-primary-700)]">
                        Room
                      </th>
                      <th className="text-left p-4 font-semibold text-[var(--color-primary-700)]">
                        Contact
                      </th>
                      <th className="text-left p-4 font-semibold text-[var(--color-primary-700)]">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {hostel.rooms.flatMap((room) =>
                      room.students.map((student) => (
                        <tr
                          key={student.id}
                          className="border-b border-[var(--color-border)] hover:bg-[var(--color-primary-50)]"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                                {student.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-[var(--color-primary-700)]">
                                  {student.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ID: {student.id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-[var(--color-primary-700)]">
                              Room {room.number}
                            </p>
                            <p className="text-sm text-gray-500">
                              Floor {room.floor} • {room.type}
                            </p>
                          </td>
                          <td className="p-4">
                            <p className="text-[var(--color-primary-700)]">
                              {student.email}
                            </p>
                          </td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                              Allocated
                            </span>
                          </td>
                        </tr>
                      )),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Amenities Tab */}
          {activeTab === "amenities" && (
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-primary-700)] mb-6">
                Amenities ({hostel.amenities.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[
                  {
                    id: "wifi",
                    label: "WiFi",
                    icon: <Wifi size={24} />,
                    color: "bg-blue-100 text-blue-600",
                  },
                  {
                    id: "gym",
                    label: "Gym",
                    icon: <Dumbbell size={24} />,
                    color: "bg-red-100 text-red-600",
                  },
                  {
                    id: "cafeteria",
                    label: "Cafeteria",
                    icon: <Utensils size={24} />,
                    color: "bg-green-100 text-green-600",
                  },
                  {
                    id: "laundry",
                    label: "Laundry",
                    icon: <Users size={24} />,
                    color: "bg-purple-100 text-purple-600",
                  },
                  {
                    id: "study_room",
                    label: "Study Room",
                    icon: <Home size={24} />,
                    color: "bg-yellow-100 text-yellow-600",
                  },
                  {
                    id: "common_room",
                    label: "Common Room",
                    icon: <Users size={24} />,
                    color: "bg-indigo-100 text-indigo-600",
                  },
                ].map((amenity) => (
                  <div
                    key={amenity.id}
                    className={`
                      p-6 rounded-xl flex flex-col items-center justify-center
                      ${
                        hostel.amenities.includes(amenity.id)
                          ? amenity.color
                          : "bg-gray-100 text-gray-400"
                      }
                    `}
                  >
                    <div className="mb-3">{amenity.icon}</div>
                    <p className="font-medium">{amenity.label}</p>
                    <p className="text-sm mt-1">
                      {hostel.amenities.includes(amenity.id)
                        ? "Available"
                        : "Not Available"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules Tab */}
          {activeTab === "rules" && (
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-primary-700)] mb-6">
                Hostel Rules & Regulations
              </h3>
              {hostel.rules ? (
                <div className="p-6 bg-[var(--color-primary-50)] rounded-xl whitespace-pre-line">
                  {hostel.rules}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-[var(--color-text-light)]">
                    No rules specified for this hostel.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
