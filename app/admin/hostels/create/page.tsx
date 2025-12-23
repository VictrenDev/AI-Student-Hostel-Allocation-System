// app/admin/hostels/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building,
  Home,
  Users,
  Wifi,
  Dumbbell,
  Utensils,
  Plus,
  Minus,
  Save,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function CreateHostelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [rooms, setRooms] = useState([
    { number: "", capacity: 2, type: "standard" },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    gender: "mixed",
    totalFloors: 3,
    location: "",
    description: "",
    amenities: [] as string[],
    wardenName: "",
    wardenContact: "",
    rules: "",
  });

  const amenitiesList = [
    { id: "wifi", label: "WiFi", icon: <Wifi size={16} /> },
    { id: "gym", label: "Gym", icon: <Dumbbell size={16} /> },
    { id: "cafeteria", label: "Cafeteria", icon: <Utensils size={16} /> },
    { id: "laundry", label: "Laundry", icon: <Users size={16} /> },
    { id: "study_room", label: "Study Room", icon: <Home size={16} /> },
    { id: "common_room", label: "Common Room", icon: <Users size={16} /> },
  ];

  const handleAmenityToggle = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleAddRoom = () => {
    setRooms([...rooms, { number: "", capacity: 2, type: "standard" }]);
  };

  const handleRemoveRoom = (index: number) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter((_, i) => i !== index));
    }
  };

  const handleRoomChange = (index: number, field: string, value: any) => {
    const updatedRooms = [...rooms];
    updatedRooms[index] = { ...updatedRooms[index], [field]: value };
    setRooms(updatedRooms);
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.code || !formData.location) {
        toast.error("Please fill all required fields");
        return false;
      }
    }
    if (step === 2) {
      for (const room of rooms) {
        if (!room.number) {
          toast.error("All rooms must have a number");
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/admin/hostels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          rooms,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Hostel created successfully!");
        router.push("/admin/hostels");
      } else {
        toast.error(data.error || "Failed to create hostel");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Basic Information" },
    { number: 2, title: "Room Configuration" },
    { number: 3, title: "Review & Create" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] mb-4"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-[var(--color-primary-700)]">
            Create New Hostel
          </h1>
          <p className="text-[var(--color-text-light)]">
            Add a new hostel building to the system
          </p>
        </div>
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center"
          style={{ background: "var(--gradient-element)" }}
        >
          <Building className="w-8 h-8 text-[var(--color-primary-500)]" />
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${
                    s.number <= step
                      ? "text-white"
                      : "text-[var(--color-text-light)] bg-[var(--color-input-bg)]"
                  }
                `}
                style={{
                  background:
                    s.number <= step ? "var(--gradient-primary)" : undefined,
                }}
              >
                {s.number < step ? <CheckCircle size={20} /> : s.number}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-24 h-1 mx-2 ${
                    s.number < step
                      ? "bg-[var(--color-primary-500)]"
                      : "bg-[var(--color-border)]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Steps Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_var(--color-shadow)] sticky top-24">
            <h3 className="text-lg font-semibold text-[var(--color-primary-700)] mb-4">
              Setup Steps
            </h3>
            <div className="space-y-3">
              {steps.map((s) => (
                <div
                  key={s.number}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    s.number === step
                      ? "bg-[var(--color-primary-50)] border-[2px] border-[var(--color-primary-200)]"
                      : "hover:bg-[var(--color-primary-50)]"
                  }`}
                  onClick={() => setStep(s.number)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        s.number === step
                          ? "bg-[var(--color-primary-500)] text-white"
                          : "bg-[var(--color-input-bg)] text-[var(--color-text-light)]"
                      }`}
                    >
                      {s.number}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-primary-700)]">
                        {s.title}
                      </p>
                      <p className="text-xs text-[var(--color-text-light)]">
                        Step {s.number} of 3
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_var(--color-shadow)] overflow-hidden">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-[var(--color-primary-700)] mb-6">
                  Hostel Details
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-semibold text-[var(--color-primary-700)]">
                        Hostel Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="e.g., Unity Hall"
                        className="w-full px-4 py-3 rounded-xl border-[2px] border-[var(--color-border)] bg-[var(--color-input-bg)] focus:border-[var(--color-primary-500)] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold text-[var(--color-primary-700)]">
                        Hostel Code *
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData({ ...formData, code: e.target.value })
                        }
                        placeholder="e.g., UNI-001"
                        className="w-full px-4 py-3 rounded-xl border-[2px] border-[var(--color-border)] bg-[var(--color-input-bg)] focus:border-[var(--color-primary-500)] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-[var(--color-primary-700)]">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="e.g., North Campus, Block A"
                      className="w-full px-4 py-3 rounded-xl border-[2px] border-[var(--color-border)] bg-[var(--color-input-bg)] focus:border-[var(--color-primary-500)] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-semibold text-[var(--color-primary-700)]">
                        Gender
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border-[2px] border-[var(--color-border)] bg-[var(--color-input-bg)] focus:border-[var(--color-primary-500)] focus:outline-none"
                      >
                        <option value="male">Male Only</option>
                        <option value="female">Female Only</option>
                        <option value="mixed">Mixed (Separate Floors)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold text-[var(--color-primary-700)]">
                        Number of Floors
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setFormData({
                              ...formData,
                              totalFloors: Math.max(
                                1,
                                formData.totalFloors - 1,
                              ),
                            })
                          }
                          className="w-10 h-10 rounded-lg flex items-center justify-center border border-[var(--color-border)] hover:bg-[var(--color-primary-50)]"
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={formData.totalFloors}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              totalFloors: parseInt(e.target.value) || 1,
                            })
                          }
                          className="w-20 px-3 py-2 text-center rounded-lg border-[2px] border-[var(--color-border)] bg-[var(--color-input-bg)] focus:border-[var(--color-primary-500)] focus:outline-none"
                        />
                        <button
                          onClick={() =>
                            setFormData({
                              ...formData,
                              totalFloors: Math.min(
                                20,
                                formData.totalFloors + 1,
                              ),
                            })
                          }
                          className="w-10 h-10 rounded-lg flex items-center justify-center border border-[var(--color-border)] hover:bg-[var(--color-primary-50)]"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-[var(--color-primary-700)]">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe the hostel facilities, location advantages, etc."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-[2px] border-[var(--color-border)] bg-[var(--color-input-bg)] focus:border-[var(--color-primary-500)] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Room Configuration */}
            {step === 2 && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[var(--color-primary-700)]">
                    Room Configuration
                  </h2>
                  <button
                    onClick={handleAddRoom}
                    className="flex items-center gap-2 px-4 py-2 text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)]"
                  >
                    <Plus size={16} />
                    Add Room
                  </button>
                </div>

                <div className="space-y-6">
                  {rooms.map((room, index) => (
                    <div
                      key={index}
                      className="p-6 border border-[var(--color-border)] rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-[var(--color-primary-700)]">
                          Room #{index + 1}
                        </h3>
                        {rooms.length > 1 && (
                          <button
                            onClick={() => handleRemoveRoom(index)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Minus size={16} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block mb-2 text-sm font-semibold text-[var(--color-primary-700)]">
                            Room Number *
                          </label>
                          <input
                            type="text"
                            value={room.number}
                            onChange={(e) =>
                              handleRoomChange(index, "number", e.target.value)
                            }
                            placeholder="e.g., 101"
                            className="w-full px-4 py-2 rounded-lg border-[2px] border-[var(--color-border)] bg-[var(--color-input-bg)] focus:border-[var(--color-primary-500)] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-semibold text-[var(--color-primary-700)]">
                            Capacity
                          </label>
                          <select
                            value={room.capacity}
                            onChange={(e) =>
                              handleRoomChange(
                                index,
                                "capacity",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full px-4 py-2 rounded-lg border-[2px] border-[var(--color-border)] bg-[var(--color-input-bg)] focus:border-[var(--color-primary-500)] focus:outline-none"
                          >
                            <option value={1}>Single (1 person)</option>
                            <option value={2}>Double (2 persons)</option>
                            <option value={3}>Triple (3 persons)</option>
                            <option value={4}>Quad (4 persons)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-semibold text-[var(--color-primary-700)]">
                            Room Type
                          </label>
                          <select
                            value={room.type}
                            onChange={(e) =>
                              handleRoomChange(index, "type", e.target.value)
                            }
                            className="w-full px-4 py-2 rounded-lg border-[2px] border-[var(--color-border)] bg-[var(--color-input-bg)] focus:border-[var(--color-primary-500)] focus:outline-none"
                          >
                            <option value="standard">Standard</option>
                            <option value="premium">Premium</option>
                            <option value="deluxe">Deluxe</option>
                            <option value="suite">Suite</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-[var(--color-primary-50)] rounded-xl">
                  <p className="text-[var(--color-primary-700)]">
                    <strong>Total Rooms:</strong> {rooms.length}
                  </p>
                  <p className="text-[var(--color-primary-700)]">
                    <strong>Total Capacity:</strong>{" "}
                    {rooms.reduce((sum, room) => sum + room.capacity, 0)}{" "}
                    students
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Review & Amenities */}
            {step === 3 && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-[var(--color-primary-700)] mb-6">
                  Review & Finalize
                </h2>

                <div className="space-y-8">
                  {/* Hostel Summary */}
                  <div className="p-6 border border-[var(--color-border)] rounded-xl">
                    <h3 className="text-lg font-semibold text-[var(--color-primary-700)] mb-4">
                      Hostel Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[var(--color-text-light)]">
                          Name
                        </p>
                        <p className="font-semibold text-[var(--color-primary-700)]">
                          {formData.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--color-text-light)]">
                          Code
                        </p>
                        <p className="font-semibold text-[var(--color-primary-700)]">
                          {formData.code}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--color-text-light)]">
                          Location
                        </p>
                        <p className="font-semibold text-[var(--color-primary-700)]">
                          {formData.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--color-text-light)]">
                          Gender
                        </p>
                        <p className="font-semibold text-[var(--color-primary-700)] capitalize">
                          {formData.gender}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--color-text-light)]">
                          Floors
                        </p>
                        <p className="font-semibold text-[var(--color-primary-700)]">
                          {formData.totalFloors}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--color-text-light)]">
                          Total Rooms
                        </p>
                        <p className="font-semibold text-[var(--color-primary-700)]">
                          {rooms.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-primary-700)] mb-4">
                      Select Amenities
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {amenitiesList.map((amenity) => (
                        <label
                          key={amenity.id}
                          className={`
                            flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all
                            ${
                              formData.amenities.includes(amenity.id)
                                ? "bg-[var(--color-primary-50)] border-[2px] border-[var(--color-primary-200)]"
                                : "bg-[var(--color-input-bg)] border-[2px] border-[var(--color-border)] hover:border-[var(--color-primary-300)]"
                            }
                          `}
                        >
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity.id)}
                            onChange={() => handleAmenityToggle(amenity.id)}
                            className="hidden"
                          />
                          <span
                            className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                              formData.amenities.includes(amenity.id)
                                ? "bg-[var(--color-primary-500)] text-white"
                                : "bg-[var(--color-primary-100)] text-[var(--color-primary-500)]"
                            }`}
                          >
                            {amenity.icon}
                          </span>
                          <span className="text-sm font-medium text-[var(--color-primary-700)]">
                            {amenity.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Warden Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-semibold text-[var(--color-primary-700)]">
                        Warden Name
                      </label>
                      <input
                        type="text"
                        value={formData.wardenName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            wardenName: e.target.value,
                          })
                        }
                        placeholder="Warden's full name"
                        className="w-full px-4 py-3 rounded-xl border-[2px] border-[var(--color-border)] bg-[var(--color-input-bg)] focus:border-[var(--color-primary-500)] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold text-[var(--color-primary-700)]">
                        Warden Contact
                      </label>
                      <input
                        type="text"
                        value={formData.wardenContact}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            wardenContact: e.target.value,
                          })
                        }
                        placeholder="Phone or email"
                        className="w-full px-4 py-3 rounded-xl border-[2px] border-[var(--color-border)] bg-[var(--color-input-bg)] focus:border-[var(--color-primary-500)] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Rules */}
                  <div>
                    <label className="block mb-2 font-semibold text-[var(--color-primary-700)]">
                      Hostel Rules (Optional)
                    </label>
                    <textarea
                      value={formData.rules}
                      onChange={(e) =>
                        setFormData({ ...formData, rules: e.target.value })
                      }
                      placeholder="Enter hostel rules and regulations..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-[2px] border-[var(--color-border)] bg-[var(--color-input-bg)] focus:border-[var(--color-primary-500)] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="p-8 border-t border-[var(--color-border)]">
              <div className="flex justify-between">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 rounded-full text-[var(--color-primary-700)] hover:bg-[var(--color-primary-50)] transition-colors"
                  >
                    ← Previous
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 3 ? (
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 rounded-full text-white font-semibold"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-3 rounded-full text-white font-semibold flex items-center gap-2"
                    style={{ background: "var(--gradient-primary)" }}
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
