"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What courses do you offer?",
    answer:
      "We offer a wide range of IT courses including Web Development, Mobile App Development, Data Science, Machine Learning, Cloud Computing, Cybersecurity, and more. Our courses are designed for beginners to advanced learners and are taught by industry experts with practical, hands-on projects.",
  },
  {
    question: "Are the courses suitable for beginners?",
    answer:
      "Absolutely! Our courses cater to all skill levels. We have beginner-friendly courses that start with the fundamentals and gradually progress to advanced topics. Each course includes step-by-step guidance, practice exercises, and mentor support to help you succeed regardless of your starting point.",
  },
  {
    question: "Do you provide certificates upon completion?",
    answer:
      "Yes, we provide industry-recognized certificates upon successful completion of each course. Our certificates demonstrate your skills and knowledge to potential employers. Additionally, you'll have access to real-world projects to build your portfolio and showcase your expertise.",
  },
  {
    question: "What is the duration of the courses?",
    answer:
      "Course durations vary depending on the program. Short courses typically range from 4-8 weeks, while longer courses can span 3-6 months. All courses are designed to fit your schedule with flexible learning options including evening and weekend batches.",
  },
  {
    question: "Do you offer job placement assistance?",
    answer:
      "Yes, we provide comprehensive career support including resume building, interview preparation, portfolio development, and job placement assistance. We have partnerships with leading tech companies and maintain a strong alumni network to help connect our graduates with job opportunities.",
  },
];

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="faqs" className="relative overflow-hidden py-16 md:py-24">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Frequently Asked <span className="text-blue-700">Questions</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Find answers to common questions about our courses,
              certifications, and programs
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants} className="group">
                <motion.div
                  className="rounded-xl border border-blue-200/70 bg-white/80 backdrop-blur shadow-[0_8px_32px_rgba(30,64,175,0.12)] hover:shadow-[0_12px_40px_rgba(30,64,175,0.2)] transition-shadow duration-300 overflow-hidden"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors duration-200 hover:bg-blue-50"
                  >
                    <h3 className="text-lg font-semibold text-slate-900 pr-8">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="shrink-0"
                    >
                      <ChevronDown
                        className={`w-6 h-6 transition-colors duration-200 ${
                          openIndex === index
                            ? "text-blue-600"
                            : "text-slate-400"
                        }`}
                      />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                          transition: {
                            height: {
                              duration: 0.3,
                              ease: "easeInOut",
                            },
                            opacity: {
                              duration: 0.25,
                              delay: 0.05,
                            },
                          },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: {
                            height: {
                              duration: 0.3,
                              ease: "easeInOut",
                            },
                            opacity: {
                              duration: 0.2,
                            },
                          },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pt-2">
                          <p className="text-slate-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="text-center pt-8">
            <p className="text-slate-600 mb-4">Still have questions?</p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-300/40 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Contact Us
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
