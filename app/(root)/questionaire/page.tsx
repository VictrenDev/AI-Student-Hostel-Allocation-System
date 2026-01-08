"use client";

import { useEffect, useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { submitQuestionnaire } from "@/src/actions/submit-questionaire";
import { useRouter } from "next/navigation";
import { steps } from "./steps";
import { toast } from "sonner";
import Link from "next/link";

export default function HostelQuestionnaire() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  // const [blocked, setBlocked] = useState(false);

  // useEffect(() => {
  //   console.log("=== DEBUG COOKIE CHECK ===");
  //   console.log("All cookies:", document.cookie);
  //   console.log(
  //     "Has questionnaire_submitted cookie:",
  //     document.cookie.includes("questionnaire_submitted"),
  //   );

  //   // Check specific cookie
  //   const cookieValue = document.cookie
  //     .split("; ")
  //     .find((row) => row.startsWith("questionnaire_submitted="))
  //     ?.split("=")[1];

  //   console.log("Cookie value:", cookieValue);

  //   if (cookieValue === "true") {
  //     console.log("✅ Cookie found! Redirecting...");
  //     router.push("/status");
  //   } else {
  //     console.log("❌ Cookie not found or not 'true'");

  //     // Check API as backup
  //     fetch("/api/check-questionnaire", { credentials: "include" })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log("API response:", data);
  //         if (data.hasSubmitted) {
  //           router.push("/status");
  //         }
  //       });
  //   }
  // }, [router]);
  const [formData, setFormData] = useState({
    // Habits
    sleepSchedule: "",
    studyHours: "",
    cleanliness: "",
    socialPreference: "",

    // Personality
    personalityType: "",
    noiseTolerance: "",
    conflictResolution: "",

    // Routine
    morningPerson: "",
    studyLocation: "",
    weekendActivity: "",

    // Hobbies
    hobbies: [] as string[],
    musicPreference: "",
    sportsInterest: "",

    // Academic Focus
    major: "",
    studyStyle: "",
    academicGoals: "",
    libraryFrequency: "",
  });



  const handleInputChange = (field: string, value: any) => {
    if (field === "hobbies") {
      const currentHobbies = [...formData.hobbies];
      if (currentHobbies.includes(value)) {
        // Remove if already selected
        setFormData({
          ...formData,
          hobbies: currentHobbies.filter((h) => h !== value),
        });
      } else {
        // Add if not selected
        setFormData({
          ...formData,
          hobbies: [...currentHobbies, value],
        });
      }
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = await submitQuestionnaire({
        habits: {
          sleepSchedule: formData.sleepSchedule,
          studyHours: formData.studyHours,
          cleanliness: formData.cleanliness,
          socialPreference: formData.socialPreference,
        },
        personality: {
          personalityType: formData.personalityType,
          noiseTolerance: formData.noiseTolerance,
        },
        routine: {
          morningPerson: formData.morningPerson,
          studyLocation: formData.studyLocation,
          weekendActivity: formData.weekendActivity,
        },
        hobbies: {
          hobbies: formData.hobbies,
          musicPreference: formData.musicPreference,
          sportsInterest: formData.sportsInterest,
        },
        academic: {
          major: formData.major,
          studyStyle: formData.studyStyle,
          academicGoals: formData.academicGoals,
          libraryFrequency: formData.libraryFrequency,
          // level: formData.level || "300", // example
        },
      });

      if (data.success) {
        setSubmitted(true);
        toast.success("Questionnaire submitted successfully!");
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field: any) => {
    switch (field.type) {
      case "radio":
        return (
          <div className="space-y-3">
            {field.options.map((option: any, idx: number) => (
              <label
                key={idx}
                className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${formData[field.id as keyof typeof formData] === option.value
                  ? "bg-[var(--color-primary-50)] border-[2px] border-[var(--color-primary-200)]"
                  : "bg-[var(--color-input-bg)] border-[2px] border-[var(--color-border)] hover:border-[var(--color-primary-300)]"
                  }`}
              >
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={
                    formData[field.id as keyof typeof formData] === option.value
                  }
                  onChange={() => handleInputChange(field.id, option.value)}
                  className="hidden"
                />
                <span
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${formData[field.id as keyof typeof formData] === option.value
                    ? "border-[var(--color-primary-500)]"
                    : "border-[var(--color-border)]"
                    }`}
                >
                  {formData[field.id as keyof typeof formData] ===
                    option.value && (
                      <span className="w-2 h-2 bg-[var(--color-primary-500)] rounded-full" />
                    )}
                </span>
                <div className="flex items-center gap-2">
                  {option.icon && (
                    <span className="text-[var(--color-primary-500)]">
                      {option.icon}
                    </span>
                  )}
                  <span className="text-[var(--color-primary-700)]">
                    {option.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {field.options.map((option: any, idx: number) => (
              <label
                key={idx}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer transition-all ${formData.hobbies.includes(option.id)
                  ? "bg-[var(--color-primary-50)] border-[2px] border-[var(--color-primary-200)]"
                  : "bg-[var(--color-input-bg)] border-[2px] border-[var(--color-border)] hover:border-[var(--color-primary-300)]"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={formData.hobbies.includes(option.id)}
                  onChange={() => handleInputChange("hobbies", option.id)}
                  className="hidden"
                />
                <span
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.hobbies.includes(option.id)
                    ? "bg-[var(--color-primary-500)] text-white"
                    : "bg-[var(--color-primary-100)] text-[var(--color-primary-500)]"
                    }`}
                >
                  {option.icon}
                </span>
                <span className="text-sm font-medium text-[var(--color-primary-700)] text-center">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        );

      case "input":
        return (
          <input
            type="text"
            value={formData[field.id as keyof typeof formData] as string}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 rounded-xl border-[2px] border-[var(--color-border)] bg-[var(--color-input-bg)] focus:border-[var(--color-primary-500)] focus:outline-none"
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Main Section */}
      <section
        className="min-h-screen flex items-center relative overflow-hidden pt-24"
        style={{ background: "var(--gradient-light)" }}
      >
        <div className="max-w-4xl mx-auto w-full px-5">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4 text-[var(--color-primary-700)]">
              AI Roommate Matching
              <span className="relative text-[var(--color-primary-500)] ml-2">
                Questionnaire
                <span
                  className="absolute left-0 bottom-1 w-full h-2"
                  style={{ background: "var(--color-underline)" }}
                />
              </span>
            </h1>
            <p className="text-[var(--color-text-light)] max-w-2xl mx-auto">
              Help our AI match you with compatible roommates by sharing your
              habits, personality, and preferences. This ensures a harmonious
              living experience.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-[var(--color-primary-600)]">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm font-medium text-[var(--color-primary-600)]">
                {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                  background: "var(--gradient-primary)",
                }}
              />
            </div>
          </div>

          {/* Steps Indicator */}
          <div className="grid grid-cols-4 gap-4 mb-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${index === currentStep
                  ? "bg-[var(--color-primary-50)] border-[2px] border-[var(--color-primary-200)]"
                  : index < currentStep
                    ? "bg-[var(--color-primary-100)]"
                    : "bg-[var(--color-input-bg)]"
                  }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${index === currentStep
                    ? "bg-[var(--color-primary-500)] text-white"
                    : index < currentStep
                      ? "bg-[var(--color-primary-400)] text-white"
                      : "bg-[var(--color-primary-100)] text-[var(--color-primary-500)]"
                    }`}
                >
                  {step.icon}
                </div>
                <span
                  className={`text-sm font-medium text-center ${index === currentStep
                    ? "text-[var(--color-primary-700)]"
                    : "text-[var(--color-neutral-500)]"
                    }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="bg-[var(--color-white)] rounded-2xl shadow-[0_20px_60px_rgba(74,111,165,0.15)] p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[var(--color-primary-700)]">
                  Questionnaire Submitted!
                </h3>
                <p className="text-[var(--color-text-light)] mb-8 max-w-md mx-auto">
                  Your preferences have been saved. Our AI is now analyzing your
                  profile to find the perfect roommate matches. You'll receive
                  your matches soon.
                </p>
                <Link
                  href={"/status"}
                  className="px-8 py-3 rounded-full text-white font-semibold"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  Check Allocation Status
                </Link>
              </div>
            ) : (
              <>
                {/* Current Step Header */}
                <div className="flex items-center gap-3 mb-8">
                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-lg text-[var(--color-primary-500)]"
                    style={{ background: "var(--gradient-element)" }}
                  >
                    {steps[currentStep].icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-primary-700)]">
                      {steps[currentStep].title}
                    </h2>
                    <p className="text-[var(--color-text-light)]">
                      {currentStep + 1}/{steps.length} sections
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-8">
                  {steps[currentStep].fields.map((field, index) => (
                    <div key={index} className="space-y-3">
                      <label className="block font-semibold text-[var(--color-primary-700)]">
                        {field.label}
                      </label>
                      {field.description && (
                        <p className="text-sm text-[var(--color-text-light)] mb-3">
                          {field.description}
                        </p>
                      )}
                      {renderField(field)}
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-12">
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 ${currentStep === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:opacity-90"
                      }`}
                    style={{
                      background:
                        currentStep === 0
                          ? "var(--color-border)"
                          : "var(--gradient-light)",
                      color: "var(--color-primary-700)",
                    }}
                  >
                    ← Previous
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={loading}
                    className="px-8 py-3 rounded-full text-white font-semibold flex items-center gap-2"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    {loading ? (
                      "Processing..."
                    ) : currentStep === steps.length - 1 ? (
                      <>
                        <CheckCircle size={18} /> Submit Questionnaire
                      </>
                    ) : (
                      <>
                        Next Step <Send size={18} />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Info Section */}
          {/*<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <UserCheck size={20} />,
                title: "Better Matches",
                desc: "AI analyzes compatibility for harmonious living",
              },
              {
                icon: <Lock size={20} />,
                title: "Privacy Protected",
                desc: "Your data is secure and only used for matching",
              },
              {
                icon: <Bolt size={20} />,
                title: "Fast Results",
                desc: "Get your matches within 24 hours",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-white)] border border-[var(--color-border)]"
              >
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-lg text-[var(--color-primary-500)]"
                  style={{ background: "var(--gradient-element)" }}
                >
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--color-primary-700)]">
                    {item.title}
                  </h4>
                  <p className="text-sm text-[var(--color-text-light)]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>*/}
        </div>
      </section>
    </>
  );
}
