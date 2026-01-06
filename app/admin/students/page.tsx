// app/admin/students/page.tsx - UPDATED VERSION
"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  User,
  Mail,
  Calendar,
  CheckCircle,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Home,
  Users,
} from "lucide-react";
import Link from "next/link";
import { getAdminStudents } from "@/src/actions/admin/students";

type Student = {
  id: number;
  name: string;
  email: string;
  gender: string;
  level: string;
  matricNo: string;
  createdAt: string;
  hasQuestionnaire: boolean;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can make this configurable

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await getAdminStudents();
      if (res.success) {
        setStudents(res.students);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter students based on search
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase()) ||
      student.matricNo.toLowerCase().includes(search.toLowerCase()),
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Students</h1>
        <p className="text-gray-600">
          Manage all registered students and their allocations
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or matric number..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-blue-600">
                {students.length}
              </p>
            </div>
            <User className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">With Questionnaire</p>
              <p className="text-2xl font-bold text-green-600">
                {students.filter((s) => s.hasQuestionnaire).length}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {students.filter((s) => !s.hasQuestionnaire).length}
              </p>
            </div>
            <AlertCircle className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Allocated</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.floor(students.length * 0.65)}{" "}
                {/* Replace with actual allocated count */}
              </p>
            </div>
            <Home className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No students found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Student
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Contact
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Details
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {student.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              ID: {student.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{student.email}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Matric: {student.matricNo}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="text-gray-700 capitalize">
                            {student.gender} • {student.level}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-500">
                              {new Date(student.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {student.hasQuestionnaire ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                            <AlertCircle className="w-4 h-4" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {/* View Details Button */}
                          <Link
                            href={`/admin/students/${student.id}`}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </Link>

                          {/* Quick Action Buttons */}
                          {student.hasQuestionnaire && (
                            <button className="px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm">
                              Allocate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredStudents.length)} of{" "}
                  {filteredStudents.length} students
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      // Show first, last, and pages around current
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 &&
                          pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-3 py-1 rounded-lg ${currentPage === pageNumber ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <span key={pageNumber} className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
