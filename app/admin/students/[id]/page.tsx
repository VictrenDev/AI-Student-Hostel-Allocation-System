// app/admin/students/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Home,
  Users,
  Shield,
  Star,
  Target,
  Brain,
  Volume2,
  User,
  BookOpen,
  Mail,
  Calendar,
  MapPin,
  BarChart3,
} from "lucide-react";
import { getAdminStudentById } from "@/src/actions/admin/get-student-details";

type StudentDetails = {
  id: number;
  name: string;
  email: string;
  gender: string;
  level: string;
  matricNo: string;
  createdAt: string;
  hasQuestionnaire: boolean;
  room?: {
    number: string;
    hostel: string;
    block: string;
    warden: string;
    wardenContact: string;
  };
  roommates?: Array<{
    id: number;
    name: string;
    email: string;
    aiTraits?: {
      chronotype: number;
      noiseSensitivity: number;
      sociability: number;
      studyFocus: number;
    };
  }>;

  aiTraits?: {
    chronotype: number;
    noiseSensitivity: number;
    sociability: number;
    studyFocus: number;
  };
  compatibilityScores?: Array<{
    roommateId: number;
    roommateName: string;
    overallScore: number;
    breakdown: {
      sleepCompatibility: number;
      studyCompatibility: number;
      socialCompatibility: number;
      noiseCompatibility: number;
    };
  }>;
};

export default function StudentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const studentId = params.id;

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

  const fetchStudentDetails = async () => {
    setLoading(true);
    try {
      // Replace with your actual API call
      // const response = await fetch(`/api/admin/students/${studentId}`);
      const data = await getAdminStudentById(Number(studentId));
      setStudent(data.student);
    } catch (error) {
      console.error("Error fetching student details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Student Not Found
          </h2>
          <button
            onClick={() => router.push("/admin/students")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/admin/students")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Students
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {student.name}
            </h1>
            <p className="text-gray-600">
              Student ID: {student.id} • {student.matricNo}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Edit Profile
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Allocate Room
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Student Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Personal Information
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <InfoItem
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                value={student.email}
              />
              <InfoItem
                icon={<Calendar className="w-4 h-4" />}
                label="Registered"
                value={new Date(student.createdAt).toLocaleDateString()}
              />
              <InfoItem
                icon={<Users className="w-4 h-4" />}
                label="Gender"
                value={student.gender}
              />
              <InfoItem
                icon={<BookOpen className="w-4 h-4" />}
                label="Level"
                value={student.level}
              />
            </div>
          </div>

          {/* Room Allocation Card */}
          {student.room && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-green-500" />
                Room Allocation
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <InfoItem
                  icon={<Home className="w-4 h-4" />}
                  label="Room Number"
                  value={student.room.roomNumber}
                />
                <InfoItem
                  icon={<MapPin className="w-4 h-4" />}
                  label="Hostel"
                  value={student.room.hostel}
                />
                <InfoItem
                  icon={<Home className="w-4 h-4" />}
                  label="Block"
                  value={student.room.block}
                />
                <InfoItem
                  icon={<Shield className="w-4 h-4" />}
                  label="Warden"
                  value={student.room.warden}
                />
                <InfoItem
                  icon={<Mail className="w-4 h-4" />}
                  label="Warden Contact"
                  value={student.room.wardenContact}
                />
              </div>
            </div>
          )}

          {/* Roommate Compatibility Card */}
          {student.roommates && student.roommates.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Roommates
              </h2>

              <div className="space-y-4">
                {student.roommates.map((mate) => (
                  <div key={mate.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800">{mate.name}</h3>
                    <p className="text-sm text-gray-500">{mate.email}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="space-y-6">
          {/* AI Traits Card */}
          {student.aiTraits && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-500" />
                AI Personality Traits
              </h2>
              <div className="space-y-4">
                <TraitBar
                  label="Chronotype"
                  value={student.aiTraits.chronotype}
                  max={7}
                  icon={<Target className="w-4 h-4" />}
                />
                <TraitBar
                  label="Noise Sensitivity"
                  value={student.aiTraits.noiseSensitivity}
                  max={7}
                  icon={<Volume2 className="w-4 h-4" />}
                />
                <TraitBar
                  label="Sociability"
                  value={student.aiTraits.sociability}
                  max={7}
                  icon={<Users className="w-4 h-4" />}
                />
                <TraitBar
                  label="Study Focus"
                  value={student.aiTraits.studyFocus}
                  max={7}
                  icon={<BookOpen className="w-4 h-4" />}
                />
              </div>
            </div>
          )}

          {/* Compatibility Scores */}
          {student.compatibilityScores &&
            student.compatibilityScores.length > 0 && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  Top Compatible Roommates
                </h2>
                <div className="space-y-3">
                  {student.compatibilityScores.map((score) => (
                    <div
                      key={score.roommateId}
                      className="border rounded-lg p-3 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">
                          {score.roommateName}
                        </span>
                        <span className="font-bold text-green-600">
                          {score.overallScore}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-500">
                        <span>
                          Sleep: {score.breakdown.sleepCompatibility}%
                        </span>
                        <span>
                          Study: {score.breakdown.studyCompatibility}%
                        </span>
                        <span>
                          Social: {score.breakdown.socialCompatibility}%
                        </span>
                        <span>
                          Noise: {score.breakdown.noiseCompatibility}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50">
                View Full Questionnaire
              </button>
              <button className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50">
                Generate Compatibility Report
              </button>
              <button className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50">
                Send Reminder Email
              </button>
              <button className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 text-red-600">
                Reassign Roommate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}

function TraitBar({
  label,
  value,
  max,
  icon,
}: {
  label: string;
  value: number;
  max: number;
  icon: React.ReactNode;
}) {
  const percentage = (value / max) * 100;
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-sm font-bold text-gray-800">
          {value}/{max}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function TraitComparison({
  label,
  studentValue,
  roommateValue,
}: {
  label: string;
  studentValue: number;
  roommateValue: number;
}) {
  const diff = Math.abs(studentValue - roommateValue);
  const compatibility = 100 - (diff / 7) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm text-gray-700 mb-1">
        <span>{label}</span>
        <span className="font-medium">{compatibility.toFixed(0)}% match</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="w-1/2 pr-2">
          <div className="text-xs text-gray-500 mb-1">Student</div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(studentValue / 7) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-700 mt-1">{studentValue}/7</div>
        </div>
        <div className="w-1/2 pl-2">
          <div className="text-xs text-gray-500 mb-1">Roommate</div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${(roommateValue / 7) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-700 mt-1">{roommateValue}/7</div>
        </div>
      </div>
    </div>
  );
}
