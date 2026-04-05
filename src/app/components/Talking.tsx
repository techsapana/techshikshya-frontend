"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
  FaUserCircle,
} from "react-icons/fa";
import { useState } from "react";

const testimonials = [
  {
    name: "Aarav Shrestha",
    role: "Marketing Analyst",
    quote:
      "TechGuru turned complex marketing concepts into practical skills. The projects felt real, and the mentor feedback helped me improve fast.",
    image: "/file.svg",
  },
  {
    name: "Maya Gurung",
    role: "UI Designer",
    quote:
      "The TechGuru design track was super focused. I built a portfolio I am proud of and learned how real design teams work.",
    image: "/file.svg",
  },
  {
    name: "Ritesh Karki",
    role: "Cloud Engineer",
    quote:
      "TechGuru helped me go from theory to deployment. The DevOps labs made CI/CD click and gave me confidence at work.",
    image: "/file.svg",
  },
  {
    name: "Nisha Rana",
    role: "Full Stack Developer",
    quote:
      "The TechGuru full stack path was intense but worth it. The career prep and mock interviews helped me land my first role.",
    image: "/file.svg",
  },
];

const stats = [
  { label: "Average rating", value: "4.9/5" },
  { label: "Career impact", value: "92% placement" },
  { label: "Mentor response", value: "< 24 hours" },
];

const Talking = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-sky-50 to-blue-50 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="absolute -top-20 right-10 h-56 w-56 rounded-full bg-blue-200/40 blur-[110px]" />
      <div className="absolute -bottom-24 left-8 h-64 w-64 rounded-full bg-sky-200/50 blur-[110px]" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 items-start relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <p className="text-sm md:text-base font-semibold text-blue-500 uppercase tracking-[0.35em]">
            Voices of TechGuru
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900">
            Learners who leveled up their careers.
          </h2>
          <p className="text-base md:text-lg text-slate-600 max-w-xl">
            TechGuru is built around outcomes. Here is what learners say about
            the guidance, projects, and support they received.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-blue-100 bg-white/70 px-4 py-4 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {stat.label}
                </p>
                <p className="text-xl font-semibold text-slate-900 mt-2">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {testimonials.map((item, idx) => (
              <button
                key={item.name}
                onClick={() => setCurrentIndex(idx)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition border ${
                  currentIndex === idx
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-blue-100 hover:border-blue-200"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute -inset-2 rounded-[28px] bg-linear-to-br from-blue-200/70 via-white to-blue-100/70 blur-lg" />
          <div className="relative rounded-[28px] border border-blue-100 bg-white p-8 shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonials[currentIndex].name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="text-blue-500 text-4xl">
                    <FaQuoteLeft />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={prevTestimonial}
                      className="rounded-full border border-blue-100 bg-white p-2 text-slate-600 shadow-sm hover:bg-blue-50 transition"
                      aria-label="Previous testimonial"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="rounded-full border border-blue-100 bg-white p-2 text-slate-600 shadow-sm hover:bg-blue-50 transition"
                      aria-label="Next testimonial"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>

                <p className="text-slate-700 text-lg leading-relaxed">
                  {testimonials[currentIndex].quote}
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-blue-100 shrink-0">
                    {testimonials[currentIndex].image === "/file.svg" ? (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-300">
                        <FaUserCircle className="w-10 h-10" />
                      </div>
                    ) : (
                      <Image
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Talking;
