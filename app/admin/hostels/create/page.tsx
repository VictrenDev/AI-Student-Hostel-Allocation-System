// app/admin/hostels/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building, Save, ArrowLeft } from "lucide-react";
import { createHostelWithRooms } from "@/src/actions/admin/create-hostel-with-rooms";
import { toast } from "sonner";
type HostelGender = "male" | "female" | "mixed";

export default function CreateHostelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<{
    name: string;
    location: string;
    gender: HostelGender;
    totalRooms: number;
    capacityPerRoom: number;
    wardenName: string;
  }>({
    name: "",
    location: "",
    gender: "male",
    totalRooms: 10,
    capacityPerRoom: 2,
    wardenName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (
      !formData.name ||
      !formData.location ||
      !formData.totalRooms ||
      !formData.capacityPerRoom ||
      !formData.wardenName
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await createHostelWithRooms({ ...formData });
      if (!res.success) {
        console.log(res.error);
        return;
      }
      console.log("Hostel has been created successfully", res.hostelId);
      toast.success("Hostel created successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create hostel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-4"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Create New Hostel
        </h1>
        <p className="text-gray-600">Add a new hostel building</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6">
        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Hostel Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Unity Hall"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g., North Campus, Block A"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Number of Rooms
              </label>
              <input
                type="number"
                min="1"
                value={formData.totalRooms}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalRooms: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Capacity per Room
              </label>
              <select
                value={formData.capacityPerRoom}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacityPerRoom: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value={1}>Single (1 person)</option>
                <option value={2}>Double (2 persons)</option>
                <option value={3}>Triple (3 persons)</option>
                <option value={4}>Quad (4 persons)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/*<div>
              <label className="block mb-2 font-semibold text-gray-700">
                Number of Rooms
              </label>
              <input
                type="number"
                min="1"
                value={formData.totalRooms}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalRooms: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>*/}

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value as HostelGender,
                  })
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value={"male"}>Male</option>
                <option value={"female"}>Female</option>
                <option value={"mixed"}>Mixedoption</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Warden Name (Optional)
            </label>
            <input
              type="text"
              value={formData.wardenName}
              onChange={(e) =>
                setFormData({ ...formData, wardenName: e.target.value })
              }
              placeholder="Enter warden's name"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-semibold text-gray-800 mb-2">Summary</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Total Rooms: {formData.totalRooms}</p>
              <p>
                Total Capacity: {formData.totalRooms * formData.capacityPerRoom}{" "}
                students
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              "Creating..."
            ) : (
              <>
                <Save size={18} />
                Create Hostel
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
