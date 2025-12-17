"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

type Student = {
  id: number;
  name: string;
  gender: string;
  level: string;
  bio?: string;
  createdAt: string;
};

export default function UsersPreview() {
  const [users, setUsers] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/get-students")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen p-10 bg-[var(--gradient-light)]">
      <h1 className="text-4xl font-bold text-[var(--color-primary-700)] mb-8">
        Registered Users
      </h1>

      {loading ? (
        <div>Loading...</div>
      ) : users.length === 0 ? (
        <div>No users found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-[var(--color-white)] rounded-2xl shadow-lg p-6 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[var(--color-primary-700)]">
                  {user.name}
                </h2>
                <CheckCircle className="text-green-500 w-6 h-6" />
              </div>
              <div className="text-[var(--color-primary-500)]">
                Gender: {user.gender}
              </div>
              <div className="text-[var(--color-primary-500)]">
                Level: {user.level}
              </div>
              <div className="text-[var(--color-neutral-400)]">
                Bio: {user.bio || "No bio provided"}
              </div>
              <div className="text-[var(--color-neutral-400)] text-sm">
                Registered at: {new Date(user.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
