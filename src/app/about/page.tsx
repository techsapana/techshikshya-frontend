"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const impactStats = [
  { label: "Learners Guided", value: "2,400+" },
  { label: "Industry Mentors", value: "45+" },
  { label: "Hiring Partners", value: "35+" },
  { label: "Live Projects", value: "180+" },
];

const principles = [
  {
    title: "Learn by building",
    description:
      "Every course is centered around practical builds so you graduate with proof of skill, not just notes.",
  },
  {
    title: "Mentorship with accountability",
    description:
      "Weekly mentor reviews, code feedback, and clear milestones keep learners moving forward confidently.",
  },
  {
    title: "Career-readiness by design",
    description:
      "From portfolio reviews to interview drills, we prepare learners for how hiring works today.",
  },
];

const timeline = [
  {
    year: "2021",
    title: "TechShikshya begins",
    description:
      "Started as a focused mentorship initiative to bridge the gap between classroom learning and real work.",
  },
  {
    year: "2022",
    title: "Cohort-based bootcamps launched",
    description:
      "Introduced structured cohorts in full stack development, UI engineering, and backend systems.",
  },
  {
    year: "2024",
    title: "Industry collaboration expanded",
    description:
      "Built stronger partnerships with companies to align curriculum and project challenges with hiring needs.",
  },
  {
    year: "2026",
    title: "TechShikshya today",
    description:
      "A growing learning community helping aspiring professionals build modern tech careers with confidence.",
  },
];

const differentiators = [
  "Curriculum updated continuously with current toolchains and market expectations.",
  "Mentor office hours for direct support on assignments, projects, and roadblocks.",
  "Portfolio-centric milestones that help learners present real capabilities.",
  "Career support including CV guidance, interview frameworks, and mock sessions.",
  "Community-led growth through peer reviews, networking circles, and alumni sessions.",
  "Balanced focus on technical depth, problem-solving, and professional communication.",
];

const AboutUs = () => {
  return (
    <main
      id="about"
      className="relative overflow-hidden bg-[linear-gradient(160deg,#f8fbff_0%,#eff7ff_48%,#f9fcff_100%)] px-4 py-14 sm:px-6 md:py-20 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute -top-12 -right-16 h-60 w-60 rounded-full bg-cyan-200/50 blur-3xl" />
        <div className="absolute top-1/3 -left-12 h-64 w-64 rounded-full bg-blue-200/45 blur-3xl" />
        <div className="absolute -bottom-16 right-1/3 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-14 md:space-y-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1.08fr_0.92fr]"
        >
          <div className="rounded-3xl border border-sky-100 bg-white/85 p-7 shadow-[0_25px_70px_-35px_rgba(14,116,144,0.42)] backdrop-blur-sm md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
              About TechShikshya
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Building confident tech professionals through practical learning.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              TechShikshya is a career-focused learning company that helps
              aspiring and early-career professionals grow with mentor-led
              training, portfolio projects, and hiring preparation. We believe
              strong careers are built through consistent practice,
              accountability, and exposure to real-world challenges.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="rounded-full bg-cyan-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                Explore Programs
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-cyan-200 bg-cyan-50 px-6 py-2.5 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-100"
              >
                Talk to an Advisor
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-100 bg-[linear-gradient(145deg,#fafdff_0%,#ebf8ff_58%,#def4ff_100%)] p-6 shadow-[0_20px_65px_-40px_rgba(3,105,161,0.65)] md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-800">
              Impact Snapshot
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {impactStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/70 bg-white/80 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-100 bg-white/80 p-5">
              <p className="text-sm font-semibold text-slate-900">
                Our Promise
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                At TechShikshya, every learner gets a clear roadmap, practical
                mentorship, and career support that aligns learning with
                measurable outcomes.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="rounded-3xl border border-sky-100 bg-white/90 p-7 md:p-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-700">
            How We Work
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            A structure designed for growth, not guesswork.
          </h2>
          <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
            {principles.map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="rounded-2xl border border-sky-100 bg-[linear-gradient(160deg,#ffffff_0%,#f3fbff_100%)] p-5"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div className="rounded-3xl border border-cyan-100 bg-white/90 p-7 md:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-700">
              Our Journey
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              Evolving with learners and industry.
            </h2>
            <div className="mt-6 space-y-4">
              {timeline.map((item) => (
                <div
                  key={item.year}
                  className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                    {item.year}
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-sky-100 bg-[linear-gradient(180deg,#ffffff_0%,#f2fbff_100%)] p-7 md:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-700">
              What Sets Us Apart
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              Built for outcomes that matter.
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {differentiators.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-xl border border-cyan-100 bg-white/90 p-3"
                >
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-500" />
                  <p className="text-sm leading-relaxed text-slate-700">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-cyan-200 bg-[linear-gradient(135deg,#dbf4ff_0%,#e8fbff_50%,#f4feff_100%)] p-8 text-center md:p-11"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-800">
            Join TechShikshya
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Start your next learning chapter with a team that supports your
            career goals.
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Whether you are upskilling, switching careers, or preparing for your
            first role in tech, TechShikshya helps you move from intention to
            impact.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/enroll"
              className="rounded-full bg-sky-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800"
            >
              Enroll Now
            </Link>
            <Link
              href="/courses"
              className="rounded-full border border-sky-300 bg-white px-6 py-2.5 text-sm font-semibold text-sky-800 transition hover:bg-sky-50"
            >
              Browse Courses
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default AboutUs;
