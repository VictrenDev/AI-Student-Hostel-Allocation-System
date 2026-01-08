"use client"
import { getAllocationStatus } from "@/src/actions/get-allocation-status";
import {
  Brain,
  Clock,
  ShieldHalf,
  CheckCircle,
  AlertCircle,
  Hourglass,
  Users,
  Home,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function StatusPage() {
  // Example status data - you can fetch this from your API
  const [allocationStatus, setAllocationStatus] = useState<any>(null);
  useEffect(() => {
    getAllocationStatus().then(setAllocationStatus);
  }, []);

  if (!allocationStatus) return null;

  // const allocationStatus = {
  //   status: "pending", // "pending", "processing", "completed", "failed"
  //   estimatedCompletion: "2024-03-15",
  //   positionInQueue: 12,
  //   totalStudents: 150,
  //   allocatedRoom: null, // or "Room 301 - Block A"
  //   roommate: null, // or "John Doe"
  //   lastUpdated: "2024-03-10 14:30",
  // };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          title: "Allocation Complete",
          description: "Your hostel room has been assigned successfully.",
          color: "text-green-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "processing":
        return {
          icon: <Brain className="w-6 h-6" />,
          title: "Processing Allocation",
          description:
            "Our AI is analyzing preferences to find the best match.",
          color: "text-blue-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      case "failed":
        return {
          icon: <AlertCircle className="w-6 h-6" />,
          title: "Allocation Pending",
          description: "Waiting for more students to complete questionnaires.",
          color: "text-yellow-500",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        };
      default:
        return {
          icon: <Hourglass className="w-6 h-6" />,
          title: "Questionnaire Submitted",
          description:
            "Your preferences have been saved. Allocation will begin soon.",
          color: "text-purple-500",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
        };
    }
  };

  const statusConfig = getStatusConfig(allocationStatus.status);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Status Panel */}
      <section className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="relative z-10 max-w-2xl w-full">
          {/* Main Status Card */}
          <div
            className={`rounded-2xl bg-[var(--color-primary-50)] border-2 border-[var(--color-primary-200)] shadow-xl p-8 mb-8`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-14 h-14 rounded-xl ${statusConfig.bgColor} flex items-center justify-center ${statusConfig.color}`}
              >
                {statusConfig.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {statusConfig.title}
                </h1>
                <p className="text-slate-600 mt-1">
                  {statusConfig.description}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-slate-500 mb-2">
                <span>Allocation Progress</span>
                <span>
                  {allocationStatus.status === "completed"
                    ? "100%"
                    : allocationStatus.status === "processing"
                      ? "65%"
                      : allocationStatus.status === "failed"
                        ? "40%"
                        : "25%"}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${allocationStatus.status === "completed"
                    ? "bg-green-500"
                    : allocationStatus.status === "processing"
                      ? "bg-blue-500"
                      : allocationStatus.status === "failed"
                        ? "bg-yellow-500"
                        : "bg-purple-500"
                    }`}
                  style={{
                    width:
                      allocationStatus.status === "completed"
                        ? "100%"
                        : allocationStatus.status === "processing"
                          ? "65%"
                          : allocationStatus.status === "failed"
                            ? "40%"
                            : "25%",
                  }}
                />
              </div>
            </div>

            {/* Status Details Grid */}
            <div className="grid grid-cols-2 gap-6">
              <DetailCard
                icon={<Users className="w-5 h-5" />}
                label="Position in Queue"
                value={
                  allocationStatus.positionInQueue
                    ? `#${allocationStatus.positionInQueue}`
                    : "N/A"
                }
                subtext={`of ${allocationStatus.totalStudents} students`}
              />

              <DetailCard
                icon={<Calendar className="w-5 h-5" />}
                label="Estimated Completion"
                value={new Date(
                  allocationStatus.estimatedCompletion,
                ).toLocaleDateString()}
                subtext="Allocation batch date"
              />

              <DetailCard
                icon={<Home className="w-5 h-5" />}
                label="Allocated Room"
                value={allocationStatus.allocatedRoom || "Pending"}
                subtext={
                  allocationStatus.allocatedRoom
                    ? "Your assigned room"
                    : "Will be assigned soon"
                }
              />

              <DetailCard
                icon={<Users className="w-5 h-5" />}
                label="Roommate"
                value={allocationStatus.roommate || "Pending"}
                subtext={
                  allocationStatus.roommate
                    ? "Your roommate"
                    : "Will be matched soon"
                }
              />
            </div>

            {/* Last Updated */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                Last updated:{" "}
                {new Date(allocationStatus.lastUpdated).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
        </div>

        {/* Background Shapes */}
      </section>
    </main>
  );
}

/* ---------- Components ---------- */

function DetailCard({
  icon,
  label,
  value,
  subtext,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-white/80 border border-slate-200">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="font-semibold text-slate-800">{value}</p>
        </div>
      </div>
      <p className="text-xs text-slate-400">{subtext}</p>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-5 rounded-xl bg-white/60 border border-slate-200 backdrop-blur-sm">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 text-blue-500 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}

function Circle({ size, position }: { size: string; position: string }) {
  return (
    <div
      className={`absolute ${size} ${position} rounded-full bg-gradient-to-br from-blue-200/20 to-slate-200/10`}
    />
  );
}
