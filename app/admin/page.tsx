"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { seedStudentsAction } from "@/src/scripts/seed-students";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {

    router.push("/admin/students");

  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
