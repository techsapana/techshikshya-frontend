"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Course, { type CourseCardItem } from "@/src/components/Course";
import { DOMAIN } from "@/src/env";

interface PublicCourseItem {
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
  courseType: "ONLINE" | "PHYSICAL";
  startDate: string;
}

interface PublicCoursesResponse {
  success: boolean;
  message?: string;
  data?: PublicCourseItem[];
}

const toDayStart = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export default function UpcomingCoursesPage() {
  const [courses, setCourses] = useState<CourseCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${DOMAIN}/api/public/courses`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as PublicCoursesResponse;

        if (!payload.success || !Array.isArray(payload.data)) {
          throw new Error(payload.message || "Unable to load courses");
        }

        const normalized: CourseCardItem[] = payload.data.map((course) => ({
          id: course.id,
          courseName: course.courseName,
          title: course.title,
          duration: course.duration,
          price: course.price,
          discountPercentage: course.discountPercentage,
          discountedPrice: course.discountedPrice,
          description: course.description,
          content: course.content,
          category: course.category,
          features: course.features,
          images: course.images,
          courseType: course.courseType,
          startDate: course.startDate,
          bannerLabel: course.courseName || course.title,
          href: `/courses/${course.id}`,
        }));

        setCourses(normalized);
      } catch (fetchError) {
        if (fetchError instanceof Error && fetchError.name === "AbortError") {
          return;
        }

        setError("Unable to load upcoming courses right now.");
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();

    return () => controller.abort();
  }, []);

  const upcomingCourses = useMemo(() => {
    const today = toDayStart(new Date()).getTime();

    return courses
      .filter((course) => {
        if (!course.startDate) {
          return false;
        }

        const parsedDate = new Date(course.startDate);
        if (Number.isNaN(parsedDate.getTime())) {
          return false;
        }

        return toDayStart(parsedDate).getTime() >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(a.startDate as string).getTime();
        const dateB = new Date(b.startDate as string).getTime();
        return dateA - dateB;
      });
  }, [courses]);

  const cardRows = Math.max(1, Math.ceil(upcomingCourses.length / 3));

  return (
    <section className="relative min-h-screen overflow-hidden bg-linear-to-b from-white via-sky-50 to-blue-50 pt-24 md:pt-28 pb-16">
      <div className="absolute -top-28 -right-24 h-80 w-80 rounded-full bg-sky-200/60 blur-[120px]" />
      <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-200/55 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-600">
            Upcoming Classes
          </p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
            Upcoming Courses
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Check out the next intakes and reserve your seat in our upcoming
            mentor-led programs.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`upcoming-skeleton-${index}`}
                className="h-96 animate-pulse rounded-3xl border border-blue-100 bg-white/85"
              />
            ))}
          </div>
        ) : upcomingCourses.length > 0 ? (
          <Course
            courses={upcomingCourses}
            upcoming
            rows={cardRows}
            columns={3}
            showViewAllButton={false}
          />
        ) : (
          <div className="mx-auto max-w-3xl rounded-2xl border border-blue-200/80 bg-white/90 p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-900">
              No upcoming courses are listed yet.
            </p>
            <p className="mt-2 text-slate-600">
              New batches are announced regularly. Please check again soon.
            </p>
            <Link
              href="/courses"
              className="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Browse All Courses
            </Link>
          </div>
        )}

        {error ? (
          <p className="mt-8 text-center text-sm font-medium text-rose-600">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
