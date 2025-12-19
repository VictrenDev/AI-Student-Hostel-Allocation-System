"use client";

import { useState } from "react";
import { Mail, ArrowRight, Shield, Brain, Clock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { loginStudent } from "@/src/actions/login-student";
import { setStudentCookie } from "@/src/helpers/set-cookie";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const loginData = await loginStudent(email);

      if (!loginData.success) {
        toast.error(loginData.error);
        setLoading(false);
        return;
      }

      const cookieData = await setStudentCookie(loginData.studentUuid);

      if (!cookieData.success) {
        toast.error(cookieData.error);
        setLoading(false);
        return;
      }
      setLoading(false);
      toast.success("Logged in successfully");
      router.push("/questionaire");
    } catch (error) {
      toast.error("An error occurred");
      setLoading(false);
    }
  };

  return (
    <>
      <main className="relative min-h-screen overflow-hidden">
        {/* Header */}
        <header className="absolute top-0 left-0 w-full z-50">
          <div className="max-w-6xl mx-auto px-6 py-6 flex justify-end items-center">
            <Link
              href="/"
              className="ml-auto text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section
          className="relative flex items-center min-h-screen"
          style={{ background: "var(--gradient-light)" }}
        >
          <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Hero Content */}
              <div className="max-w-lg">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-[var(--color-primary-700)]">
                  Welcome Back to{" "}
                  <span className="relative text-[var(--color-primary-500)]">
                    HostelEase
                    <span
                      className="absolute left-0 bottom-1 w-full h-2"
                      style={{ background: "var(--color-underline)" }}
                    />
                  </span>
                </h1>

                <p className="mt-6 text-lg text-[var(--color-text-light)]">
                  Sign in to access your personalized hostel allocation
                  dashboard. View your room assignment, roommate details, and
                  manage your preferences.
                </p>

                {/* Features */}
                <div className="mt-12 space-y-6">
                  <Feature
                    text="AI-Powered Roommate Matching"
                    icon={<Brain size={20} />}
                  />
                  <Feature
                    text="Instant Room Assignments"
                    icon={<Clock size={20} />}
                  />
                  <Feature
                    text="Secure Student Portal"
                    icon={<Shield size={20} />}
                  />
                </div>

                <div className="mt-10 p-4 rounded-xl border-l-4 border-[var(--color-primary-500)] bg-[var(--color-primary-50)]">
                  <p className="text-sm text-[var(--color-primary-700)]">
                    <strong>New student?</strong> Please complete your
                    registration first before signing in.
                  </p>
                  <Link
                    href="/register"
                    className="inline-block mt-2 text-sm font-medium text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] transition-colors"
                  >
                    Go to Registration →
                  </Link>
                </div>
              </div>

              {/* Right Column - Sign In Form */}
              <div className="bg-[var(--color-white)] rounded-2xl p-8 shadow-[0_20px_60px_var(--color-shadow)]">
                <div className="text-center mb-8">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "var(--gradient-element)" }}
                  >
                    <Mail className="w-8 h-8 text-[var(--color-primary-500)]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--color-primary-700)]">
                    Sign In to Your Account
                  </h2>
                  <p className="text-[var(--color-text-light)] mt-2">
                    Enter your student email to continue
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block mb-2 font-semibold text-[var(--color-primary-700)]">
                      Student Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-neutral-400)]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@university.edu"
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-[2px] border-[var(--color-border)] bg-[var(--color-input-bg)] focus:border-[var(--color-primary-500)] focus:outline-none"
                      />
                    </div>
                    <p className="text-sm text-[var(--color-neutral-400)] mt-2">
                      Use your university-issued email address
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-full text-white font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-70"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    {loading ? (
                      "Logging you in..."
                    ) : (
                      <>
                        Login to your account <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <div className="text-center text-sm text-[var(--color-neutral-500)]">
                    <p className="mb-2">Don't have an account yet?</p>
                    <Link
                      href="/register"
                      className="font-medium text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] transition-colors"
                    >
                      Complete your registration first →
                    </Link>
                  </div>
                </form>

                {/* Security Note */}
                {/*<div className="mt-8 pt-6 border-t border-[var(--color-border)]">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-[var(--color-primary-500)] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[var(--color-primary-700)]">
                        Secure Authentication
                      </p>
                      <p className="text-xs text-[var(--color-neutral-500)]">
                        We use magic links for passwordless, secure sign-in. No
                        passwords to remember.
                      </p>
                    </div>
                  </div>
                </div>*/}
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
    </>
  );
}

/* ---------- Components ---------- */

function Feature({ text, icon }: { text: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: "var(--gradient-element)" }}
      >
        <div className="text-[var(--color-primary-500)]">{icon}</div>
      </div>
      <span className="font-medium text-[var(--color-primary-700)]">
        {text}
      </span>
    </div>
  );
}

function Circle({ size, position }: { size: string; position: string }) {
  return (
    <div
      className={`absolute ${size} ${position} rounded-full`}
      style={{
        background:
          "linear-gradient(135deg, rgba(74, 111, 165, 0.1), rgba(44, 62, 80, 0.05))",
      }}
    />
  );
}
