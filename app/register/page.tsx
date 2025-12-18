"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { UserCheck, Lock, Bolt, Edit2, CheckCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "@/src/zod/register-student";
import z from "zod";
import registerStudent from "@/src/actions/register-students";

type FormValues = z.infer<typeof registrationSchema>;

export default function RegistrationPage() {
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      gender: "male",
      level: "freshman",
      matricNo: "U2021/339992",
      email: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    setShowPreview(true);
    setTimeout(() => {
      document.getElementById("previewSection")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  const handleConfirm = async (data: FormValues) => {
    try {
      setLoading(true);
      // Map level before sending
      const payload = { ...data };
      console.log(payload);
      const newStudentResponse = await registerStudent(payload);
      if (!newStudentResponse.success) {
        throw new Error(newStudentResponse.error);
      }

      // Call API route to set cookie
      const res = await fetch("/api/set-student-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentUuid: newStudentResponse.studentUuid }),
      });

      const cookieResult = await res.json();

      if (!cookieResult.success) {
        toast.error("Failed to set session cookie.");
        return;
      }

      toast.success(`Registration successful for ${data.name}!`);
      reset();
      setShowPreview(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      router.push("/questionaire");
    } catch (err) {
      toast.error("Registration failed. Please try again.");
      throw new Error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLevelText = (val: FormValues["level"]) => {
    const levels: Record<FormValues["level"], string> = {
      freshman: "Freshman (Year 1)",
      sophomore: "Sophomore (Year 2)",
      junior: "Junior (Year 3)",
      senior: "Senior (Year 4)",
      postgrad: "Postgraduate",
    };
    return levels[val];
  };

  return (
    <>
      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-50 p-6 transition-all bg-transparent">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center font-bold rounded-lg w-10 h-10 text-white"
              style={{ background: "var(--gradient-primary)" }}
            >
              H
            </div>
            <div className="text-2xl font-bold text-[var(--color-primary-700)]">
              Hostel
              <span className="text-[var(--color-primary-500)]">Ease</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <section
        className="min-h-screen flex items-center relative overflow-hidden"
        style={{ background: "var(--gradient-light)" }}
      >
        <div className="max-w-7xl mx-auto w-full px-5 flex flex-col lg:flex-row justify-center gap-12 items-center lg:items-start pt-24">
          {/* Hero */}
          <div className="flex-1 max-w-lg mb-12 lg:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-[var(--color-primary-700)]">
              Complete Your{" "}
              <span className="relative text-[var(--color-primary-500)]">
                Registration
                <span
                  className="absolute left-0 bottom-1 w-full h-2"
                  style={{ background: "var(--color-underline)" }}
                />
              </span>
            </h1>
            <p className="text-[var(--color-text-light)] mb-10">
              Fill in your details to get started with HostelEase. We'll use
              this information to match you with the perfect hostel
              accommodation.
            </p>

            <div className="flex flex-wrap gap-6">
              {[
                { icon: UserCheck, text: "Quick & Easy Registration" },
                { icon: Lock, text: "Secure Data Protection" },
                { icon: Bolt, text: "Fast Allocation Process" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-lg text-[var(--color-primary-500)]"
                    style={{ background: "var(--gradient-element)" }}
                  >
                    <feature.icon size={24} />
                  </div>
                  <span className="font-medium text-[var(--color-primary-700)]">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-[var(--color-white)] rounded-2xl shadow-[0_20px_60px_rgba(74,111,165,0.15)] p-10 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-2 text-[var(--color-primary-700)]">
              Student Information
            </h2>
            <p className="text-[var(--color-text-light)] mb-6">
              Please fill in all required fields
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <Controller
                name="name"
                control={control}
                rules={{ required: "Full name is required" }}
                render={({ field }) => (
                  <div>
                    <label className="block mb-1 font-semibold text-[var(--color-primary-700)]">
                      Full Name *
                    </label>
                    <input
                      {...field}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl border-[2px] border-[var(--color-border)] bg-[var(--color-input-bg)] focus:border-[var(--color-primary-500)] focus:outline-none"
                    />
                    {errors.name && (
                      <span className="text-red-500 text-sm">
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                )}
              />

              {/* Gender */}
              <Controller
                name="gender"
                control={control}
                rules={{ required: "Gender is required" }}
                render={({ field }) => (
                  <div>
                    <label className="block mb-1 font-semibold text-[var(--color-primary-700)]">
                      Gender *
                    </label>
                    <div className="flex gap-6">
                      {["male", "female"].map((g) => (
                        <label
                          key={g}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            value={g}
                            checked={field.value === g}
                            onChange={() => field.onChange(g)}
                            className="hidden"
                          />
                          <span
                            className={`w-5 h-5 rounded-full border-2 border-[var(--color-border)] flex-shrink-0 relative ${
                              field.value === g
                                ? "border-[var(--color-primary-500)]"
                                : ""
                            }`}
                          >
                            {field.value === g && (
                              <span className="w-2.5 h-2.5 bg-[var(--color-primary-500)] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            )}
                          </span>
                          <span className="text-[var(--color-primary-700)] capitalize">
                            {g}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.gender && (
                      <span className="text-red-500 text-sm">
                        {errors.gender.message}
                      </span>
                    )}
                  </div>
                )}
              />
              {/* Matriculation Number */}
              <Controller
                name="matricNo"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block mb-1 font-semibold text-[var(--color-primary-700)]">
                      Matriculation Number *
                    </label>
                    <input
                      {...field}
                      placeholder="Enter your Matric Number"
                      className="w-full px-4 py-3 rounded-xl border-[2px] border-[var(--color-border)] bg-[var(--color-input-bg)] focus:border-[var(--color-primary-500)] focus:outline-none"
                    />
                    {errors.matricNo && (
                      <span className="text-red-500 text-sm">
                        {errors.matricNo.message}
                      </span>
                    )}
                  </div>
                )}
              />
              {/*Email*/}
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block mb-1 font-semibold text-[var(--color-primary-700)]">
                      Email Address *
                    </label>
                    <input
                      {...field}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 rounded-xl border-[2px] border-[var(--color-border)] bg-[var(--color-input-bg)] focus:border-[var(--color-primary-500)] focus:outline-none"
                    />
                    {errors.email && (
                      <span className="text-red-500 text-sm">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                )}
              />
              {/* Level */}
              <Controller
                name="level"
                control={control}
                rules={{ required: "Level is required" }}
                render={({ field }) => (
                  <div>
                    <label className="block mb-1 font-semibold text-[var(--color-primary-700)]">
                      Academic Level *
                    </label>
                    <select
                      {...field}
                      className="w-full px-4 py-3 rounded-xl border-[2px] border-[var(--color-border)] bg-[var(--color-input-bg)] focus:border-[var(--color-primary-500)] focus:outline-none"
                    >
                      <option value="" disabled>
                        Select your level
                      </option>
                      <option value="freshman">Freshman (Year 1)</option>
                      <option value="sophomore">Sophomore (Year 2)</option>
                      <option value="junior">Junior (Year 3)</option>
                      <option value="senior">Senior (Year 4)</option>
                      <option value="postgrad">Postgraduate</option>
                    </select>
                    {errors.level && (
                      <span className="text-red-500 text-sm">
                        {errors.level.message}
                      </span>
                    )}
                  </div>
                )}
              />

              <button
                type="submit"
                className="w-full py-4 rounded-full text-white font-semibold flex items-center justify-center gap-2"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Send size={18} /> Preview Registration
              </button>
            </form>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div
            id="previewSection"
            className="absolute top-[50%] left-[50%] -translate-[50%] bg-[var(--color-white)] rounded-2xl shadow-[0_20px_60px_900px_rgba(74,111,165,0.15)] p-10 w-full max-w-4xl mx-auto mt-10 animate-fadeIn"
          >
            <h3 className="text-2xl font-bold mb-2 text-[var(--color-primary-700)]">
              Registration Preview
            </h3>
            <p className="text-[var(--color-text-light)] mb-6">
              Review your information before final submission
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Full Name", value: watch("name") },
                { label: "Gender", value: watch("gender") },
                { label: "Matriculation Number", value: watch("matricNo") },
                { label: "Email Address", value: watch("email") },
                {
                  label: "Academic Level",
                  value: getLevelText(watch("level")),
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="border-l-4 border-[var(--color-primary-500)] bg-[var(--color-neutral-50)] p-4 rounded"
                >
                  <div className="text-[var(--color-neutral-400)] font-semibold uppercase text-sm">
                    {item.label}
                  </div>
                  <div className="text-[var(--color-primary-700)]">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowPreview(false)}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Edit2 size={18} /> Edit Information
              </button>
              <button
                onClick={handleSubmit(handleConfirm)}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold"
                style={{
                  background: "linear-gradient(135deg,#10b981,#047857)",
                }}
                disabled={loading}
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <CheckCircle size={18} /> Confirm & Submit
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
