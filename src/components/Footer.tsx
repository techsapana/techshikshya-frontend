"use client";

import { DOMAIN } from "@/src/env";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";

interface Course {
  id: number;
  title: string;
  courseName?: string;
}

const Footer = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${DOMAIN}/api/public/courses`);
        const json = await res.json();
        if (json?.success) {
          setCourses(json.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch courses for footer:", error);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const visibleCourses = courses.slice(0, 6);

  return (
    <footer
      id="footer"
      className="bg-linear-to-br from-[#d8e7ff] via-[#ecf3ff] to-[#dce9ff] px-6 py-12 text-slate-900 md:py-16"
    >
      <div className="max-w-7xl mx-auto md:px-8 lg:px-10">
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10 md:gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/techshikshya.jpeg"
                  alt="TechShikshya"
                  width={180}
                  height={48}
                  className="w-auto h-12 object-contain rounded-xl"
                />
              </div>
              <p className="text-sm leading-relaxed text-slate-600 md:text-base">
                TechShikshya helps learners build real-world skills through
                practical training, expert mentorship, and career-focused
                guidance. Stay ahead with programs shaped by today&apos;s tech
                landscape.
              </p>
              <p className="text-sm font-medium text-blue-800">
                Building careers with TechShikshya
              </p>
            </div>

            <div>
              <h4 className="text-slate-900 text-lg font-semibold mb-5 uppercase">
                Available Courses
              </h4>
              <ul className="space-y-3 text-sm">
                {coursesLoading &&
                  Array.from({ length: 6 }).map((_, index) => (
                    <li
                      key={`course-skeleton-${index}`}
                      className="h-4 w-3/4 bg-white/10 rounded animate-pulse"
                    />
                  ))}

                {!coursesLoading && visibleCourses.length === 0 && (
                  <li className="text-slate-500">No courses available.</li>
                )}

                {!coursesLoading &&
                  visibleCourses.map((course) => {
                    const label = course.courseName || course.title;
                    return (
                      <li key={course.id}>
                        <Link
                          href={`/courses/${course.id}`}
                          className="text-slate-700 transition-colors hover:text-blue-800"
                        >
                          {label}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 text-lg font-semibold mb-5 uppercase tracking-wide">
                Contact Us
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <FiMail className="mt-1 text-xl text-blue-700" />
                  <div>
                    <a
                      href="mailto:infoTechShikshya07@gmail.com"
                      className="text-slate-700 transition-colors hover:text-blue-800"
                    >
                      infoTechShikshya07@gmail.com
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <FiMapPin className="mt-1 text-xl text-blue-700" />
                  <span className="text-slate-700">
                    Dakshinkali Marg, Lalitpur
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <FiPhone className="mt-1 text-xl text-blue-700" />
                  <div className="space-y-1">
                    <div>
                      <a
                        href="tel:+9779849447862"
                        className="text-slate-700 transition-colors hover:text-blue-800"
                      >
                        +977 984-9447862
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 w-full border-t border-blue-200/80 pt-8 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} TechShikshya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
