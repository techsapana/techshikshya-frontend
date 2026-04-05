"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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

interface PublicBannerResponse {
  success: boolean;
  message?: string;
  data?: { id: number; imageUrl: string } | { id: number; imageUrl: string }[];
}

// function resolveImageUrl(imageUrl?: string) {
//   if (!imageUrl) {
//     return null;
//   }

//   if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
//     return imageUrl;
//   }

//   return `${DOMAIN}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
// }

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export default function HeroSection() {
  const [courses, setCourses] = useState<CourseCardItem[]>([]);
  const [bannerUrls, setBannerUrls] = useState<string[]>([]);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const autoAdvanceRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchLatestCourses = async () => {
      try {
        setCoursesLoading(true);
        setCoursesError(null);

        const res = await fetch(`${DOMAIN}/api/public/courses`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const json = (await res.json()) as PublicCoursesResponse;

        if (!json.success || !Array.isArray(json.data)) {
          throw new Error(json.message || "Failed to load courses");
        }

        const normalized = json.data.map((course) => ({
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
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setCoursesError("Unable to load courses at the moment.");
      } finally {
        setCoursesLoading(false);
      }
    };

    const fetchHeroBanner = async () => {
      try {
        const res = await fetch(`${DOMAIN}/api/public/banner`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const json = (await res.json()) as PublicBannerResponse;

        if (!json.success) {
          throw new Error(json.message || "Failed to load banner");
        }

        const raw = json.data;
        if (Array.isArray(raw)) {
          setBannerUrls(raw.map((b) => b.imageUrl).filter(Boolean));
        } else if (raw?.imageUrl) {
          setBannerUrls([raw.imageUrl]);
        } else {
          setBannerUrls([]);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setBannerUrls([]);
      }
    };

    fetchLatestCourses();
    fetchHeroBanner();

    return () => controller.abort();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (bannerUrls.length <= 1) return;
    autoAdvanceRef.current = setInterval(() => {
      setCurrentBannerIdx((i) => (i + 1) % bannerUrls.length);
    }, 5000);
    return () => {
      if (autoAdvanceRef.current) clearInterval(autoAdvanceRef.current);
    };
  }, [bannerUrls.length]);

  const featuredCourses = useMemo(() => {
    return [...courses]
      .sort((a, b) => {
        const aTime = a.startDate ? new Date(a.startDate).getTime() : Infinity;
        const bTime = b.startDate ? new Date(b.startDate).getTime() : Infinity;
        return aTime - bTime;
      })
      .slice(0, 8);
  }, [courses]);

  return (
    <div className="relative overflow-hidden text-slate-900">
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
        {/* Background banner image */}
        {bannerUrls.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBannerIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <Image
                src={bannerUrls[currentBannerIdx]}
                alt="TechShikshya hero background"
                fill
                priority
                unoptimized
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        )}
        {/* Neutral tint over banner image for text readability */}
        <div className="pointer-events-none absolute inset-0 bg-white/35" />

        {/* Carousel controls */}
        {bannerUrls.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentBannerIdx((i) =>
                  i === 0 ? bannerUrls.length - 1 : i - 1,
                )
              }
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-blue-200 bg-white/75 p-2 text-blue-800 shadow-md transition hover:bg-white"
              aria-label="Previous banner"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={() =>
                setCurrentBannerIdx((i) =>
                  i === bannerUrls.length - 1 ? 0 : i + 1,
                )
              }
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-blue-200 bg-white/75 p-2 text-blue-800 shadow-md transition hover:bg-white"
              aria-label="Next banner"
            >
              <ChevronRight size={22} />
            </button>
            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {bannerUrls.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentBannerIdx(i)}
                  aria-label={`Go to banner ${i + 1}`}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === currentBannerIdx
                      ? "scale-125 bg-blue-700"
                      : "bg-blue-300/60 hover:bg-blue-500/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="home-surface mx-auto w-full max-w-6xl rounded-4xl p-7 md:p-12">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center rounded-full border border-blue-300/70 bg-blue-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-800"
          >
            New Cohort Open
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="mt-6 font-(--font-space) text-4xl leading-[1.08] text-slate-900 sm:text-5xl lg:text-7xl"
          >
            Learn Inside a Real IT Company itself.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-6 max-w-3xl text-base font-medium text-slate-700 sm:text-xl"
          >
            Industry-Based MERN, Python, UI/UX &amp; Digital Marketing Programs
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/enroll"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-300/40 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Enroll Now
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-xl border border-blue-400/40 bg-white/75 px-7 py-3.5 font-semibold text-blue-900 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50"
            >
              View Courses
            </Link>
          </motion.div>
        </div>
      </section>

      <div
        className="pointer-events-none h-10 w-full bg-linear-to-b from-blue-800/16 via-blue-500/8 to-transparent"
        aria-hidden="true"
      />

      <section id="why-techshikshya" className="relative px-6 pb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mx-auto max-w-6xl"
        >
          <h2 className="font-(--font-space) mt-5 text-3xl sm:text-4xl md:text-5xl">
            Why TechSikshya?
          </h2>
          <p className="mt-4 max-w-3xl text-slate-600">
            We combine project-based classes, in-house mentorship, and career
            support so students can move from learning to earning with
            confidence.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Live Industry Training",
                description:
                  "Learn inside a real IT workflow with hands-on projects, code reviews, and team collaboration.",
                icon: BriefcaseBusiness,
              },
              {
                title: "Internship + Portfolio",
                description:
                  "Build portfolio-ready work with mentor feedback so your profile is ready for internships and jobs.",
                icon: Building2,
              },
              {
                title: "Career-Ready Path",
                description:
                  "Structured roadmap, interview prep, and practical assignments aligned with current market demand.",
                icon: ShieldCheck,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-blue-200/70 bg-white/82 p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300/80 hover:shadow-md"
              >
                <item.icon className="mb-3 h-6 w-6 text-blue-700" />
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
      <section id="upcoming-courses" className="relative px-6 pb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mx-auto max-w-6xl"
        >
          <h2 className="font-(--font-space) text-3xl sm:text-4xl md:text-5xl">
            Latest Courses
          </h2>

          <p className="mt-3 text-slate-600">
            Upcoming and trending programs from our public catalog.
          </p>

          <div className="mt-8">
            {coursesLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`hero-course-skeleton-${index}`}
                    className="h-96 animate-pulse rounded-3xl border border-blue-200/70 bg-white/80"
                  />
                ))}
              </div>
            ) : featuredCourses.length > 0 ? (
              <Course courses={featuredCourses} upcoming rows={2} columns={3} />
            ) : (
              <div className="home-surface rounded-2xl p-8 text-center">
                <p className="text-slate-700">
                  {coursesError || "No courses are available right now."}
                </p>
                <Link
                  href="/courses"
                  className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Browse All Courses
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
