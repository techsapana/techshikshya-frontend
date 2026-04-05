import Link from "next/link";
import { CalendarDays, Clock3, MonitorPlay, Star, Tag } from "lucide-react";

export interface CourseCardItem {
  id: number;
  courseName?: string;
  title?: string;
  duration?: string;
  price?: number;
  discountPercentage?: number;
  discountedPrice?: number;
  description?: string;
  content?: string;
  category?: string;
  features?: string[];
  images?: string[];
  courseType?: "ONLINE" | "PHYSICAL" | string;
  // Legacy fields kept for compatibility with static arrays.
  bannerLabel?: string;
  originalPrice?: number;
  rating?: number;
  startDate?: string | Date;
  href?: string;
}

interface CourseProps {
  courses: CourseCardItem[];
  upcoming?: boolean;
  rows?: number;
  columns?: number;
  showViewAllButton?: boolean;
  viewAllHref?: string;
}

const formatPrice = (value: number) => value.toLocaleString("en-IN");

const calculateDiscount = (discountedPrice: number, originalPrice: number) => {
  if (originalPrice <= discountedPrice || originalPrice === 0) {
    return 0;
  }

  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

const formatStartDate = (startDate?: string | Date) => {
  if (!startDate) {
    return "TBA";
  }

  const parsed = new Date(startDate);
  if (Number.isNaN(parsed.getTime())) {
    return "TBA";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getUpcomingLabel = (startDate?: string | Date) => {
  if (!startDate) {
    return "Starts soon";
  }

  const parsedDate = new Date(startDate);
  if (Number.isNaN(parsedDate.getTime())) {
    return "Starts soon";
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const courseStart = new Date(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate(),
  );

  const dayInMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.ceil(
    (courseStart.getTime() - todayStart.getTime()) / dayInMs,
  );

  if (diffDays > 1) {
    return `Starts in ${diffDays} days`;
  }

  if (diffDays === 1) {
    return "Starts in 1 day";
  }

  if (diffDays === 0) {
    return "Starts today";
  }

  return "Started";
};

const Course = ({
  courses,
  upcoming = false,
  rows = 2,
  columns = 3,
  showViewAllButton = true,
  viewAllHref = "/courses",
}: CourseProps) => {
  const visibleCourses = courses.slice(0, rows * columns);

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCourses.map((course) => {
          const courseTitle = course.title || course.courseName || "Course";
          const courseNameLabel =
            course.courseName && course.courseName !== courseTitle
              ? course.courseName
              : null;
          const previewText = course.description || course.content || "";

          const originalPrice = course.price ?? course.originalPrice ?? 0;
          const derivedDiscountedPrice =
            originalPrice > 0 && (course.discountPercentage ?? 0) > 0
              ? Math.round(
                  originalPrice * (1 - (course.discountPercentage ?? 0) / 100),
                )
              : originalPrice;
          const discountedPrice =
            course.discountedPrice ?? derivedDiscountedPrice;

          const discount =
            course.discountPercentage ??
            calculateDiscount(discountedPrice, originalPrice);

          const upcomingLabel = getUpcomingLabel(course.startDate);
          const coverImage = course.images?.[0];
          const topFeatures = course.features?.slice(0, 3) ?? [];

          return (
            <article
              key={course.id}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-blue-200/70 bg-white/90 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-blue-300/80 hover:shadow-xl"
            >
              <div className="relative h-52 overflow-hidden bg-blue-100">
                {coverImage ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `linear-gradient(150deg, rgba(2,6,23,0.45), rgba(15,23,42,0.68)), url(${coverImage})`,
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-blue-700 via-blue-500 to-sky-400" />
                )}

                <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_50%),radial-gradient(circle_at_80%_75%,rgba(0,0,0,0.2),transparent_50%)]" />

                {upcoming ? (
                  <span className="absolute left-4 top-3 rounded-full bg-blue-600/95 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                    {upcomingLabel}
                  </span>
                ) : null}

                <span className="absolute right-4 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-blue-900">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {(course.rating ?? 5).toFixed(1)}
                </span>

                {course.courseType ? (
                  <span className="absolute left-4 top-14 inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    <MonitorPlay className="h-3.5 w-3.5" />
                    {course.courseType}
                  </span>
                ) : null}

                <div className="absolute inset-x-0 bottom-5 px-5">
                  <p className="line-clamp-2 text-2xl font-bold leading-tight tracking-wide text-white drop-shadow-sm md:text-3xl">
                    {course.bannerLabel || courseTitle}
                  </p>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {course.category ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800">
                      <Tag className="h-3.5 w-3.5" />
                      {course.category}
                    </span>
                  ) : null}

                  {course.duration ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50/80 px-2.5 py-1 text-xs font-semibold text-blue-800">
                      <Clock3 className="h-3.5 w-3.5" />
                      {course.duration}
                    </span>
                  ) : null}

                  {course.startDate ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50/80 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatStartDate(course.startDate)}
                    </span>
                  ) : null}
                </div>

                {courseNameLabel ? (
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {courseNameLabel}
                  </p>
                ) : null}

                <h3 className="line-clamp-2 text-2xl font-semibold text-slate-900">
                  {courseTitle}
                </h3>

                <p className="mt-3 line-clamp-3 text-base text-slate-600">
                  {previewText ||
                    "Build practical skills with a structured, mentor-led curriculum."}
                </p>

                {topFeatures.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {topFeatures.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-medium text-blue-800"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-auto border-t border-blue-200/70 pt-4">
                  <p className="text-3xl font-bold text-slate-900">
                    Rs. {formatPrice(discountedPrice)}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    {originalPrice > discountedPrice ? (
                      <span className="text-sm text-slate-500 line-through">
                        Rs. {formatPrice(originalPrice)}
                      </span>
                    ) : null}

                    {discount > 0 ? (
                      <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                        {discount}% off
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <Link
                      href={course.href ?? `/courses/${course.id}`}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {showViewAllButton ? (
        <div className="mt-10 flex justify-center">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            View All Courses
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default Course;
