"use client"

import { loginStudent } from "@/src/actions/login-student";
import { ArrowRight, Mail } from "lucide-react"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginFormComponent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    // stops form normal proceess for validation
    e.preventDefault();
    // checks if the email exists and if it contains the @ symbol as it should
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      // submit the email to login the user
      const loginData = await loginStudent(email);
      // if the email doesn't exists, throw the relivant error
      if (!loginData.success) {
        toast.error(loginData.error);
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

  return <form onSubmit={handleSubmit} className="space-y-6">
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


}
