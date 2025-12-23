"use client";

import { getCookie } from "@/src/actions/get-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LayoutHeader() {
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  };

  useEffect(() => {
    const checkAuth = async () => {
      const res = await getCookie();
      setShowLogout(res.isAuthenticated);
    };

    checkAuth();
  }, []);

  return (
    <header className="relative top-0 left-0 w-full z-50 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center font-bold rounded-lg w-10 h-10 text-white"
            style={{ background: "var(--gradient-primary)" }}
          >
            H
          </Link>
          <div className="text-2xl font-bold text-[var(--color-primary-700)]">
            Hostel
            <span className="text-[var(--color-primary-500)]">Ease</span>
          </div>
        </div>

        <div className="flex gap-6 items-center">
          {showLogout && (
            <button
              onClick={logout}
              className="text-[var(--color-primary-500)] font-medium"
            >
              Logout
            </button>
          )}

          <button
            onClick={() => router.back()}
            className="text-[var(--color-primary-500)] font-medium"
          >
            ← Back
          </button>
        </div>
      </div>
    </header>
  );
}
