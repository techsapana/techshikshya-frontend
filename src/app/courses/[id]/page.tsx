"use client";

import { DOMAIN } from "@/src/env";
import EditorViewer from "@/src/components/EditorViewer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FaCheck,
  FaChartLine,
  FaLightbulb,
  FaUserGraduate,
  FaCalendar,
  FaCertificate,
  FaBook,
  FaAward,
} from "react-icons/fa";
import { MdOutlineDescription } from "react-icons/md";

type CourseType = "ONLINE" | "PHYSICAL";

interface Course {
  id: number;
  courseName: string;
  title: string;
  duration: string;
  price: number;
  discountPercentage: number;
  discountedPrice: number;
  description: string;
  content: string;
  category: string;
  features: string[];
  images: string[];
  courseType: CourseType;
  startDate: string;
}

export default function CoursePage() {
  const params = useParams();
  const id = params.id as string;

  const [activeTab, setActiveTab] = useState("description");
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        const res = await fetch(`${DOMAIN}/api/public/courses/${id}`);
        const json = await res.json();

        if (json.success) {
          setCourse(json.data);
        } else {
          setCourse(null);
        }
      } catch (error) {
        console.error("Failed to load course", error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-NP").format(value);

  const formatStartDate = (dateValue: string) => {
    const parsed = new Date(dateValue);

    if (Number.isNaN(parsed.getTime())) {
      return "Date TBA";
    }

    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCourseType = (courseType: CourseType) =>
    courseType === "ONLINE" ? "Online" : "Physical";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 md:pt-28">
        <section className="relative bg-blue-900 text-white pt-28 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-4 w-16 bg-blue-800 rounded animate-pulse" />
                <span>•</span>
                <div className="h-4 w-20 bg-blue-800 rounded animate-pulse" />
                <span>•</span>
                <div className="h-4 w-24 bg-blue-800 rounded animate-pulse" />
              </div>

              <div className="h-8 w-40 bg-blue-800 rounded animate-pulse" />

              <div className="space-y-3">
                <div className="h-12 w-full bg-blue-800 rounded animate-pulse" />
                <div className="h-12 w-5/6 bg-blue-800 rounded animate-pulse" />
              </div>

              <div className="h-6 w-4/5 bg-blue-800 rounded animate-pulse" />

              <div className="space-y-4 pt-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="h-5 w-5 bg-blue-800 rounded animate-pulse mt-1" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-48 bg-blue-800 rounded animate-pulse" />
                      <div className="h-4 w-full bg-blue-800 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <div className="h-12 w-36 bg-blue-800 rounded-lg animate-pulse" />
              </div>
            </div>

            <div className="bg-white text-gray-700 rounded-xl shadow-2xl p-8">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-6" />
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-${idx === 3 ? "20" : "12"} w-full bg-gray-200 rounded-lg animate-pulse`}
                  />
                ))}
                <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse" />
                <div className="h-10 w-24 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
                <div className="h-5 w-32 bg-gray-200 rounded mx-auto animate-pulse" />
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-10 w-3/4 bg-gray-200 rounded mb-4 animate-pulse" />

              <div className="flex gap-4 mb-8 border-b border-gray-200">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-12 w-32 bg-gray-200 rounded-t-lg animate-pulse"
                  />
                ))}
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-11/12 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-10/12 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-9/12 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl border border-gray-200 flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-24 md:pt-28 flex items-center justify-center">
        Course not found
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-sky-50 via-blue-50 to-white pt-24 text-slate-700 md:pt-28">
      <div className="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-sky-200/60 blur-[100px]" />
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-200/60 blur-[110px]" />

      <section className="relative px-4 pb-14 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="rounded-3xl border border-sky-100 bg-white/90 p-6 shadow-sm md:p-8">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <Link href="/" className="transition hover:text-sky-700">
                Home
              </Link>
              <span>/</span>
              <Link href="/#courses" className="transition hover:text-sky-700">
                Courses
              </Link>
              <span>/</span>
              <span className="font-medium text-slate-700">
                {course.courseName}
              </span>
            </nav>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                {formatCourseType(course.courseType)}
              </span>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
                {course.category || "Professional"}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
              {course.courseName}
            </h1>

            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Course Description
            </p>

            {course.description ? (
              <EditorViewer
                content={course.description}
                className="mt-3 -ml-14 text-base leading-relaxed md:text-lg [&_.bn-container]:bg-transparent [&_.bn-editor]:bg-transparent"
              />
            ) : (
              <p className="mt-3 text-slate-600 text-base md:text-lg leading-relaxed">
                Course description will be updated soon.
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/enroll?courseId=${course.id}`}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Enroll in this Course
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-6 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
              >
                Open Dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div
              className="h-52 rounded-2xl bg-cover bg-center md:h-64"
              style={{
                backgroundImage: `linear-gradient(145deg, rgba(15,23,42,0.15), rgba(15,23,42,0.45)), url(${course.images?.[0] || "/placeholder.svg"})`,
              }}
            />

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Duration
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {course.duration || "Flexible"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Start Date
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatStartDate(course.startDate)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Mode
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatCourseType(course.courseType)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Category
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {course.category || "Professional"}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-xs uppercase tracking-wide text-blue-700">
                Course Fee
              </p>
              <div className="mt-1 flex flex-wrap items-end gap-2">
                <p className="text-2xl font-bold text-slate-900">
                  Rs. {formatPrice(course.discountedPrice || course.price)}
                </p>
                {course.discountPercentage > 0 &&
                  course.price > course.discountedPrice && (
                    <span className="text-sm text-slate-500 line-through">
                      Rs. {formatPrice(course.price)}
                    </span>
                  )}
              </div>
              {course.discountPercentage > 0 && (
                <p className="mt-1 text-xs text-blue-700">
                  Save {course.discountPercentage}% on this course
                </p>
              )}
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                Highlights
              </p>
              <ul className="space-y-2">
                {((course.features ?? []).slice(0, 4).length > 0
                  ? (course.features ?? []).slice(0, 4)
                  : [
                      "Hands-on practical sessions",
                      "Mentor guidance and support",
                      "Project-focused learning path",
                    ]
                ).map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-slate-700"
                  >
                    <FaCheck className="text-emerald-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-sky-100 bg-white/70 py-12 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: FaChartLine, value: "1200+", label: "Students Enrolled" },
            { icon: FaLightbulb, value: "50+", label: "Practical Projects" },
            { icon: FaUserGraduate, value: "95%", label: "Placement Rate" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-sky-100 bg-sky-50/80 p-7 text-center transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-sm">
                <stat.icon className="text-white text-2xl" />
              </div>
              <h3 className="mb-2 text-4xl font-bold text-slate-900">
                {stat.value}
              </h3>
              <p className="font-medium text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 md:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Master <span className="text-blue-600">{course.courseName}</span>{" "}
              from Scratch
            </h2>

            <div className="mb-8 flex flex-wrap gap-3">
              {["description", "syllabus"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-5 py-2.5 font-semibold transition-colors ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-700"
                  }`}
                >
                  {tab === "description" ? (
                    <span className="inline-flex items-center gap-2">
                      <MdOutlineDescription className="text-lg" />
                      Description
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <FaBook className="text-base" />
                      Syllabus
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              {activeTab === "description" && (
                <div className="space-y-6">
                  {course.description || course.content ? (
                    <EditorViewer
                      content={course.content}
                      className="text-base -ml-14 md:text-lg leading-relaxed [&_.bn-container]:bg-transparent [&_.bn-editor]:bg-transparent"
                    />
                  ) : (
                    <p className="text-slate-600">
                      Course description will be updated soon.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "syllabus" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(course.features ?? []).map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50/70 p-3"
                    >
                      <FaCheck className="text-emerald-500 mt-1" />
                      <p>{feature}</p>
                    </div>
                  ))}
                  {(course.features ?? []).length === 0 && (
                    <p className="text-slate-500 col-span-full">
                      Curriculum details will be updated soon.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {[
              {
                icon: FaCalendar,
                title: "Duration",
                value: course.duration || "Flexible",
              },
              {
                icon: FaCertificate,
                title: "Mode",
                value: formatCourseType(course.courseType),
              },
              {
                icon: FaBook,
                title: "Starts On",
                value: formatStartDate(course.startDate),
              },
              { icon: FaAward, title: "Level", value: "Beginner to Advanced" },
            ].map((info, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100">
                  <info.icon className="text-sky-600 text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{info.title}</h4>
                  <p className="text-slate-600 text-sm">{info.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
