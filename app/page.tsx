import { Brain, Clock, Shield, ShieldHalf, ShieldHalfIcon } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gray-50 text-slate-800">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-slate-800 text-white flex items-center justify-center font-bold text-xl">
              H
            </div>
            <span className="text-2xl font-bold">
              Hostel<span className="text-blue-600">Ease</span>
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex items-center min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Simplify Your{" "}
              <span className="relative text-(--color-primary-500)">
                Hostel Allocation
                <span className="absolute left-0 bottom-1 w-full h-2 bg-blue-200 -z-10" />
              </span>{" "}
              Process
            </h1>

            <p className="mt-6 text-lg text-slate-600 max-w-xl">
              An intelligent platform designed to streamline hostel room
              assignments for students and administrators. Save time, reduce
              conflicts, and ensure fair allocation.
            </p>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 mt-10 px-10 py-4 rounded-full text-white font-semibold bg-gradient-to-r from-(--color-primary-500) to-(--color-primary-700) shadow-lg hover:opacity-90 transition"
            >
              Register Now
            </Link>

            {/* Features */}
            <div className="mt-14 flex flex-wrap gap-10">
              <Feature
                text="Smart Algorithmic Allocation"
                icon={<Brain className="" />}
              />
              <Feature text="Save Time & Reduce Conflicts" icon={<Clock />} />
              <Feature
                text="Secure & Transparent Process"
                icon={<ShieldHalf />}
              />
            </div>
          </div>
        </div>

        {/* Background Shapes */}
        <div className="absolute inset-y-0 right-0 w-1/2 hidden lg:block">
          <Circle size="w-96 h-96" position="top-16 right-16" />
          <Circle size="w-72 h-72" position="bottom-20 right-32" />
          <Circle size="w-52 h-52" position="top-40 right-56" />
        </div>
      </section>
    </main>
  );
}

/* ---------- Components ---------- */

function Feature({ text, icon }: { text: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-(--color-primary-100) text-(--color-primary-500) flex items-center justify-center font-bold">
        {icon}
      </div>
      <span className="font-medium">{text}</span>
    </div>
  );
}

function Circle({ size, position }: { size: string; position: string }) {
  return (
    <div
      className={`absolute ${size} ${position} rounded-full bg-gradient-to-br from-blue-200/40 to-slate-200/20`}
    />
  );
}
