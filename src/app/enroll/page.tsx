"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DOMAIN } from "@/src/env";
import { BookOpen, CircleCheckBig, ShieldCheck } from "lucide-react";
import {
  getLearnerAuthHeaders,
  upsertStoredEnrollment,
} from "@/src/utils/learner";
import { useAuth } from "@/src/hooks/useAuth";

interface Course {
  id: number;
  courseName?: string;
  title?: string;
}

const EDUCATION_LEVELS = [
  "High School",
  "Diploma",
  "Bachelor's",
  "Master's",
  "Other",
];

const LEARNING_FORMATS = [
  { label: "Online", value: "ONLINE" },
  { label: "Physical", value: "PHYSICAL" },
  { label: "Hybrid", value: "HYBRID" },
];

export default function EnrollPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [courseId, setCourseId] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [preferredLearningPlatform, setPreferredLearningPlatform] =
    useState("");
  const [hasLaptop, setHasLaptop] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [lastEnrollmentId, setLastEnrollmentId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [submittingPayment, setSubmittingPayment] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setFullName((current) => current || user.fullName || "");
    setEmail((current) => current || user.email || "");
  }, [user]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${DOMAIN}/api/public/courses`);
        const json = await res.json();
        if (json?.success) {
          setCourses(json.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (coursesLoading) {
      return;
    }

    const preselectedCourseId = searchParams.get("courseId");
    if (!preselectedCourseId) {
      return;
    }

    const courseExists = courses.some(
      (course) => String(course.id) === preselectedCourseId,
    );

    if (courseExists) {
      setCourseId(preselectedCourseId);
    }
  }, [courses, coursesLoading, searchParams]);

  const selectedCourse = useMemo(
    () => courses.find((course) => String(course.id) === courseId),
    [courses, courseId],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitMessage(null);

    if (!isAuthenticated) {
      setSubmitMessage("Please login first to submit your enrollment.");
      router.push("/login");
      return;
    }

    if (
      !fullName.trim() ||
      !phoneNumber.trim() ||
      !email.trim() ||
      !courseId ||
      !educationLevel ||
      !preferredLearningPlatform ||
      !hasLaptop
    ) {
      setSubmitMessage("Please complete all fields before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const enrollmentPayload = {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        course:
          selectedCourse?.title ||
          selectedCourse?.courseName ||
          String(courseId),
        educationLevel,
        preferredLearningPlatform,
        hasLaptop,
      };

      const response = await fetch(`${DOMAIN}/api/enrollments/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enrollmentPayload),
      });

      const data = await response.json();

      if (response.ok) {
        await fetch("https://formspree.io/f/xnjbevyn", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            subject: "New Enrollment Submission",
            ...enrollmentPayload,
          }),
        });

        const maybeEnrollmentId = Number(
          data?.data?.enrollmentId ?? data?.data?.id,
        );

        if (Number.isFinite(maybeEnrollmentId) && maybeEnrollmentId > 0) {
          upsertStoredEnrollment({
            enrollmentId: maybeEnrollmentId,
            courseId: Number(courseId),
            courseName:
              selectedCourse?.title || selectedCourse?.courseName || "Course",
          });

          setLastEnrollmentId(maybeEnrollmentId);
          setShowPaymentForm(true);
        }

        setSubmitMessage(
          Number.isFinite(maybeEnrollmentId) && maybeEnrollmentId > 0
            ? "Enrollment submitted successfully. Please submit your payment screenshot below."
            : "Enrollment submitted successfully.",
        );
        setFullName("");
        setPhoneNumber("");
        setEmail("");
        setCourseId("");
        setEducationLevel("");
        setPreferredLearningPlatform("");
        setHasLaptop("");
      } else {
        setSubmitMessage(data?.message || "Failed to submit enrollment.");
      }
    } catch (error) {
      console.error("Error submitting enrollment:", error);
      setSubmitMessage("An error occurred while submitting your enrollment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPaymentMessage(null);

    if (!paymentMethod.trim()) {
      setPaymentMessage("Please select a payment method.");
      return;
    }

    if (!paymentScreenshot) {
      setPaymentMessage("Please upload a payment screenshot.");
      return;
    }

    if (!lastEnrollmentId) {
      setPaymentMessage(
        "Enrollment ID not found. Please refresh and try again.",
      );
      return;
    }

    setSubmittingPayment(true);

    try {
      const formData = new FormData();
      formData.append("payment", paymentMethod);
      formData.append("screenshot", paymentScreenshot);

      const response = await fetch(`${DOMAIN}/api/user/payments`, {
        method: "POST",
        headers: {
          ...getLearnerAuthHeaders(),
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setPaymentMessage("Payment screenshot submitted successfully!");
        setPaymentMethod("");
        setPaymentScreenshot(null);
        setShowPaymentForm(false);
        setLastEnrollmentId(null);
      } else {
        setPaymentMessage(
          data?.message || "Failed to submit payment screenshot.",
        );
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      setPaymentMessage("An error occurred while submitting your payment.");
    } finally {
      setSubmittingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-50 via-white to-slate-50">
      <section className="relative overflow-hidden pb-10 pt-24 md:pt-28">
        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-blue-200/60 blur-[120px]" />
        <div className="absolute -bottom-20 -left-24 h-72 w-72 rounded-full bg-sky-200/65 blur-[120px]" />

        <div className="relative mx-auto grid max-w-6xl gap-5 px-4 sm:px-6 lg:grid-cols-12 lg:items-stretch lg:px-8">
          <div className="rounded-3xl bg-linear-to-br from-blue-700 via-sky-600 to-cyan-500 p-8 text-white shadow-lg sm:p-10 lg:col-span-8">
            <p className="text-xs uppercase tracking-[0.35em] text-blue-100">
              Enrollment
            </p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">
              Build your next skill with confidence.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-blue-100 sm:text-lg">
              Fill in your details, choose your program, and we will help you
              start the right batch at the right time.
            </p>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-white/85 p-6 shadow-sm backdrop-blur lg:col-span-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
              What happens next
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CircleCheckBig className="mt-0.5 h-4 w-4 text-blue-600" />
                We review your submission and confirm your seat.
              </li>
              <li className="flex items-start gap-2">
                <BookOpen className="mt-0.5 h-4 w-4 text-blue-600" />
                You receive onboarding details and class schedule.
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-600" />
                Support team assists you through admission and payment.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="rounded-3xl border border-blue-100/80 bg-white/90 p-6 shadow-xl backdrop-blur sm:p-10 lg:col-span-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="rounded-2xl border border-blue-100 bg-sky-50/60 p-5 sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
                  Your Information
                </p>
                <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">
                      Full name
                    </span>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Enter your full name"
                      className="mt-2 w-full rounded-xl border border-blue-100 bg-white px-4 py-3 text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">
                      Phone number
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(event) => setPhoneNumber(event.target.value)}
                      placeholder="Enter your phone number"
                      className="mt-2 w-full rounded-xl border border-blue-100 bg-white px-4 py-3 text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      required
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Email
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter your email"
                      className="mt-2 w-full rounded-xl border border-blue-100 bg-white px-4 py-3 text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      required
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-white p-5 sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
                  Course Preferences
                </p>
                <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <label className="block md:col-span-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Course
                    </span>
                    <select
                      value={courseId}
                      onChange={(event) => setCourseId(event.target.value)}
                      className="mt-2 w-full rounded-xl border border-blue-100 bg-slate-50 px-4 py-3 text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      required
                    >
                      <option value="" disabled>
                        {coursesLoading
                          ? "Loading courses..."
                          : "Select a course"}
                      </option>
                      {!coursesLoading &&
                        courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.title || course.courseName || "Course"}
                          </option>
                        ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">
                      Education level
                    </span>
                    <select
                      value={educationLevel}
                      onChange={(event) =>
                        setEducationLevel(event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-blue-100 bg-slate-50 px-4 py-3 text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      required
                    >
                      <option value="" disabled>
                        Select your education level
                      </option>
                      {EDUCATION_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">
                      Preferred learning platform
                    </span>
                    <select
                      value={preferredLearningPlatform}
                      onChange={(event) =>
                        setPreferredLearningPlatform(event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-blue-100 bg-slate-50 px-4 py-3 text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      required
                    >
                      <option value="" disabled>
                        Select a platform
                      </option>
                      {LEARNING_FORMATS.map((platform) => (
                        <option key={platform.value} value={platform.value}>
                          {platform.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
                <p className="text-sm font-semibold text-slate-700">
                  Do you have a laptop?
                </p>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {["YES", "NO"].map((value) => (
                    <label
                      key={value}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        hasLaptop === value
                          ? "border-blue-500 bg-blue-600 text-white"
                          : "border-blue-100 bg-white text-slate-700 hover:border-blue-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="hasLaptop"
                        value={value}
                        checked={hasLaptop === value}
                        onChange={(event) => setHasLaptop(event.target.value)}
                        className="sr-only"
                        required
                      />
                      {value === "YES" ? "Yes, I have one" : "No, I need one"}
                    </label>
                  ))}
                </div>
              </div>

              {submitMessage && (
                <div className="cursor-pointer rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                  {submitMessage}
                </div>
              )}

              {!authLoading && !isAuthenticated && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  You need to login before submitting this enrollment form.
                </div>
              )}

              <div className="flex flex-col gap-4 border-t border-blue-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  We will contact you within 24 hours after receiving your
                  enrollment request.
                </p>
                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={submitting || authLoading || !isAuthenticated}
                    className="enroll-ripple-btn inline-flex cursor-pointer items-center justify-center rounded-full bg-linear-to-r from-blue-600 via-sky-500 to-cyan-500 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span className="relative z-10">
                      {submitting
                        ? "Submitting..."
                        : !isAuthenticated
                          ? "Login to enroll"
                          : "Submit enrollment"}
                    </span>
                  </button>

                  <Link
                    href={isAuthenticated ? "/dashboard" : "/login"}
                    className="inline-flex items-center justify-center rounded-full border border-blue-200 px-8 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                  >
                    {isAuthenticated ? "Open Dashboard" : "Login"}
                  </Link>
                </div>
              </div>
            </form>
          </div>

          <aside className="h-fit rounded-3xl border border-blue-100/80 bg-white/85 p-6 shadow-sm lg:sticky lg:top-28 lg:col-span-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
              Enrollment Notes
            </p>
            <div className="mt-4 space-y-4 text-sm text-slate-700">
              <p>
                Select your preferred learning mode and we will recommend the
                best batch timing based on availability.
              </p>
              <p>
                If you came from a course detail page, your selected course
                stays prefilled for faster enrollment.
              </p>
              <p>
                Need help choosing a course? Submit the form and our advisor can
                assist before payment.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {showPaymentForm && (
        <section className="pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-xl sm:p-10 md:p-12">
              <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
                <div className="lg:col-span-8">
                  <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    Submit Payment Screenshot
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Upload your payment proof to complete enrollment approval.
                  </p>

                  <form
                    onSubmit={handlePaymentSubmit}
                    className="mt-8 space-y-6"
                  >
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">
                        Payment Method
                      </span>
                      <select
                        value={paymentMethod}
                        onChange={(event) =>
                          setPaymentMethod(event.target.value)
                        }
                        className="mt-2 w-full rounded-xl border border-blue-100 bg-slate-50 px-4 py-3 text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        required
                      >
                        <option value="" disabled>
                          Select payment method
                        </option>
                        <option value="ONLINE">Online Payment</option>
                        <option value="QR">QR Code Payment</option>
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">
                        Payment Screenshot
                      </span>
                      <div className="mt-2 flex items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/60 px-6 py-10 transition hover:border-blue-300 hover:bg-blue-50">
                        <div className="text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) {
                                setPaymentScreenshot(file);
                              }
                            }}
                            className="sr-only"
                            id="screenshot-upload"
                            required
                          />
                          <label
                            htmlFor="screenshot-upload"
                            className="cursor-pointer"
                          >
                            {paymentScreenshot ? (
                              <div className="flex flex-col items-center">
                                <p className="text-sm font-semibold text-green-600">
                                  ✓ {paymentScreenshot.name}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  Click to change
                                </p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <p className="text-sm font-semibold text-slate-700">
                                  Drag and drop your screenshot here
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  or click to browse
                                </p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </label>

                    {paymentMessage && (
                      <div
                        className={`rounded-xl border px-4 py-3 text-sm ${
                          paymentMessage.includes("successfully")
                            ? "border-green-100 bg-green-50 text-green-700"
                            : "border-red-100 bg-red-50 text-red-700"
                        }`}
                      >
                        {paymentMessage}
                      </div>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPaymentForm(false);
                          setPaymentMethod("");
                          setPaymentScreenshot(null);
                          setPaymentMessage(null);
                        }}
                        className="inline-flex items-center justify-center rounded-full border border-slate-300 px-8 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                      >
                        Skip for now
                      </button>
                      <button
                        type="submit"
                        disabled={submittingPayment}
                        className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-sky-500 px-8 py-3 text-sm font-semibold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {submittingPayment ? "Uploading..." : "Submit Payment"}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-sky-50/70 p-5 lg:col-span-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">
                    Payment Tips
                  </p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-700">
                    <li>
                      Use a clear screenshot that shows transaction status.
                    </li>
                    <li>Keep amount and payment reference visible.</li>
                    <li>
                      Approval usually completes shortly after verification.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
