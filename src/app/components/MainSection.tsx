"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import Card from "./Card";
import { DOMAIN } from "@/src/env";

interface Course {
  id: number;
  courseName?: string;
  title?: string;
  duration?: string;
  description?: string;
  category?: string;
  images?: string[];
}

const MainSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const featuredCourses = courses.slice(0, 4);

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

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 pb-16 bg-linear-to-b from-[#d4e4ff] via-[#e4eeff] to-[#d8e6ff]">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_12%_15%,rgba(37,99,235,0.18),transparent_40%),radial-gradient(circle_at_82%_80%,rgba(14,165,233,0.14),transparent_40%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="mb-16"
        >
          <motion.h3
            variants={itemVariants}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 text-center lg:text-left"
          >
            Academic Programs
          </motion.h3>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 justify-items-center"
          >
            {coursesLoading &&
              Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={`course-skeleton-${index}`}
                  variants={itemVariants}
                  className="w-64 h-80 rounded-2xl bg-blue-50 animate-pulse border border-blue-100"
                />
              ))}

            {!coursesLoading && featuredCourses.length === 0 && (
              <motion.p
                variants={itemVariants}
                className="text-slate-500 col-span-full text-center"
              >
                No courses available at the moment.
              </motion.p>
            )}

            {!coursesLoading &&
              featuredCourses.map((course) => {
                const title = course.title || course.courseName || "Course";
                const subtitle =
                  course.duration || course.category || "Available now";

                return (
                  <motion.div
                    key={course.id}
                    variants={itemVariants}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    className="w-full"
                  >
                    <Card
                      imageSrc={course.images?.[0] || "/placeholder.svg"}
                      title={title}
                      subtitle={subtitle}
                      href={`/courses/${course.id}`}
                    />
                  </motion.div>
                );
              })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MainSection;
