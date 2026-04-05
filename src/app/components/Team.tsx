"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { DOMAIN } from "@/src/env";
import Image from "next/image";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  description?: string;
  imageUrl?: string;
};

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

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const res = await fetch(`${DOMAIN}/api/public/our-team`);
        const json = await res.json();
        if (json?.success) {
          setTeamMembers(json.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch team members:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  useEffect(() => {
    if (currentIndex > teamMembers.length - 1) {
      setCurrentIndex(0);
    }
  }, [teamMembers.length, currentIndex]);

  const nextSlide = () => {
    if (teamMembers.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    if (teamMembers.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section id="team" className="relative overflow-hidden py-20">
      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="mb-12 text-center"
        >
          <motion.p
            variants={cardVariants}
            className="text-sm uppercase tracking-[0.3em] text-blue-500"
          >
            Meet the people behind TechGuru
          </motion.p>
          <motion.h2
            variants={cardVariants}
            className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900"
          >
            Our <span className="text-blue-700">Team</span>
          </motion.h2>
          <motion.p
            variants={cardVariants}
            className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto"
          >
            Designers, engineers, and mentors who make every learning journey
            feel personal, practical, and future-ready.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="relative"
        >
          <div className="relative h-full overflow-x-hidden">
            {isLoading && (
              <div className="relative isolate overflow-hidden rounded-3xl border border-blue-200/70 bg-white/80  p-8 shadow-[0_22px_72px_rgba(30,64,175,0.16)]">
                <div className="relative flex flex-col md:flex-row items-center gap-6">
                  <div className="h-48 w-48 rounded-2xl bg-blue-50 animate-pulse" />
                  <div className="flex-1 w-full space-y-3">
                    <div className="h-8 w-2/3 rounded bg-blue-50 animate-pulse" />
                    <div className="h-6 w-1/2 rounded bg-blue-50 animate-pulse" />
                    <div className="mt-3 h-20 w-full rounded-2xl bg-blue-50 animate-pulse" />
                  </div>
                </div>
              </div>
            )}

            {!isLoading && teamMembers.length === 0 && (
              <div className="relative isolate overflow-hidden rounded-3xl border border-blue-200/70 bg-white/80  p-8 text-center shadow-[0_22px_72px_rgba(30,64,175,0.16)]">
                <p className="text-slate-600">
                  No team members available right now.
                </p>
              </div>
            )}

            {!isLoading && teamMembers.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  <div className="group">
                    <div className="relative isolate overflow-hidden rounded-3xl border border-blue-200/70 bg-white/80  p-8 shadow-[0_22px_72px_rgba(30,64,175,0.16)] transition duration-300 group-hover:border-blue-300/70 group-hover:shadow-[0_26px_84px_rgba(30,64,175,0.24)]">
                      <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-blue-50/50 via-white/60 to-sky-50/40 opacity-0 transition duration-300 group-hover:opacity-100" />

                      <div className="relative flex flex-col md:flex-row items-center gap-6">
                        <div className="shrink-0">
                          <div className="h-48 w-48 rounded-2xl border-2 border-blue-100 bg-blue-50 flex items-center justify-center shadow-md">
                            {teamMembers[currentIndex].imageUrl ? (
                              <Image
                                src={
                                  teamMembers[currentIndex].imageUrl ||
                                  "/placeholder.svg"
                                }
                                alt={teamMembers[currentIndex].name}
                                width={192}
                                height={192}
                                className="h-full w-full rounded-2xl object-cover"
                              />
                            ) : (
                              <div className="text-center">
                                <svg
                                  className="w-16 h-16 mx-auto text-blue-300 mb-2"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <p className="text-sm text-blue-400 font-medium">
                                  Image Placeholder
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="relative flex-1 text-center md:text-left">
                          <h3 className="text-3xl font-semibold text-slate-900">
                            {teamMembers[currentIndex].name}
                          </h3>
                          <p className="text-lg font-medium text-blue-600 mt-2">
                            {teamMembers[currentIndex].role}
                          </p>

                          <div className="relative mt-6 rounded-2xl border border-blue-100/70 bg-linear-to-r from-blue-50 to-sky-50 px-6 py-4">
                            <p className="text-base text-slate-600">
                              {teamMembers[currentIndex].description ||
                                "Focused on hands-on learning, portfolio-ready projects, and the kind of guidance that helps learners thrive."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {teamMembers.length > 1 && !isLoading && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 md:-translate-x-20 z-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition duration-300"
                aria-label="Previous slide"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 md:translate-x-20 z-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition duration-300"
                aria-label="Next slide"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <div className="flex justify-center gap-2 mt-8">
                {teamMembers.map((member, index) => (
                  <button
                    key={member.id}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-blue-600 w-8"
                        : "bg-blue-200 w-2 hover:bg-blue-400"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
