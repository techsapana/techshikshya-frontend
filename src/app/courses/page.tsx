"use client";

import { DOMAIN } from "@/src/env";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

interface Category {
  id: number;
  name: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRes = await fetch(`${DOMAIN}/api/public/categories`);
        const categoriesJson = await categoriesRes.json();

        if (categoriesJson.success) {
          setCategories([
            "All",
            ...categoriesJson.data.map((c: Category) => c.name),
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const coursesRes = await fetch(`${DOMAIN}/api/public/courses`);
        const coursesJson = await coursesRes.json();

        if (coursesJson.success) {
          setCourses(coursesJson.data ?? []);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const filteredCourses =
    activeCategory === "All"
      ? courses
      : courses.filter((course) => course.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-white via-sky-50 to-blue-50 pt-24 md:pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 md:h-12 w-64 md:w-96 bg-blue-100 rounded mx-auto animate-pulse" />
            <div className="mt-4 space-y-3">
              <div className="h-4 bg-blue-100 rounded w-11/12 md:w-2/3 mx-auto animate-pulse" />
              <div className="h-4 bg-blue-100 rounded w-10/12 md:w-1/2 mx-auto animate-pulse" />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`cat-skeleton-${index}`}
                className="h-10 w-24 bg-sky-100 rounded-full animate-pulse"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`course-skeleton-${index}`}
                className="bg-white/90 border border-blue-100 rounded-xl shadow-md overflow-hidden"
              >
                <div className="h-48 bg-blue-100 animate-pulse" />
                <div className="p-6 space-y-4">
                  <div className="h-5 w-3/4 bg-blue-100 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-blue-100 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-blue-100 rounded animate-pulse" />
                  <div className="h-10 w-32 bg-sky-100 rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-linear-to-b from-white via-sky-50 to-blue-50 pt-24 md:pt-28 pb-16">
      <div className="absolute -top-28 -right-24 h-80 w-80 rounded-full bg-sky-200/60 blur-[120px]" />
      <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-200/55 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-600">
            Courses
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">
            Explore Our Courses
          </h1>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Discover a wide range of courses across different categories. Learn
            at your own pace, gain industry-ready skills, and take your career
            to the next level.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 cursor-pointer py-2 rounded-full text-sm font-semibold shadow-sm ${
                activeCategory === cat
                  ? "bg-linear-to-r from-blue-600 to-sky-500 text-white shadow-md"
                  : "bg-white/85 border border-blue-100 text-slate-700 hover:bg-sky-50 hover:border-sky-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-zcols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group rounded-2xl border border-blue-100 bg-white/95 shadow-md overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(14,116,196,0.15)]"
            >
              <div className="relative h-48 bg-sky-50">
                <Image
                  src={course.images?.[0] || "/placeholder.svg"}
                  alt={course.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
                    {course.category}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                    {course.courseType === "ONLINE" ? "Online" : "Physical"}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {course.title}
                </h3>

                <p className="text-slate-600 mb-1">
                  <span className="font-semibold text-slate-700">
                    Duration:
                  </span>{" "}
                  {course.duration}
                </p>

                <p className="text-slate-600 mb-3">
                  <span className="font-semibold text-slate-700">Starts:</span>{" "}
                  {formatStartDate(course.startDate)}
                </p>

                <div className="mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xl font-bold text-slate-900">
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
                    <span className="mt-1 inline-flex rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      {course.discountPercentage}% off
                    </span>
                  )}
                </div>

                <Link
                  href={`/courses/${course.id}`}
                  className="inline-flex items-center justify-center bg-linear-to-r from-blue-500 to-sky-500 text-white font-semibold px-5 py-2 rounded-lg transition shadow-sm hover:from-blue-600 hover:to-sky-600 hover:shadow-md"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <p className="text-center text-slate-500 col-span-full mt-8">
              No courses found in this category.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
