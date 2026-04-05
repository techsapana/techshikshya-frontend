"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/xnjbevyn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...formData,
          subject: formData.subject || "New Contact Form Submission",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit contact form.");
      }

      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-blue-50 to-cyan-50 pt-24 md:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-12 text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-sky-950 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-sky-800/80">
            Feel free to reach out for academic collaborations, consultations,
            or inquiries
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Contact Form */}
          <motion.div variants={fadeUpItem}>
            <div className="bg-white/90 backdrop-blur-sm border border-sky-100 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-sky-950 mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="w-full px-4 py-2.5 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 bg-white text-sky-950 placeholder-sky-500 transition"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    className="w-full px-4 py-2.5 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 bg-white text-sky-950 placeholder-sky-500 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    required
                    className="w-full px-4 py-2.5 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 bg-white text-sky-950 placeholder-sky-500 transition"
                  />
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    required
                    className="w-full px-4 py-2.5 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 bg-white text-sky-950 placeholder-sky-500 transition"
                  />
                </div>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows={5}
                  required
                  className="w-full px-4 py-2.5 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 bg-white text-sky-950 placeholder-sky-500 resize-none transition"
                ></textarea>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Map/Iframe */}
          <motion.div
            variants={fadeUpItem}
            className="bg-white/90 backdrop-blur-sm border border-sky-100 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full min-h-96 md:min-h-auto"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28263.248515294326!2d85.31393965974019!3d27.689298031604388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1900696324c5%3A0xc5fd2be54bf5863b!2sTech%20Guru%20pvt.ltd!5e0!3m2!1sen!2snp!4v1770894265257!5m2!1sen!2snp"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-96"
            />
          </motion.div>
        </motion.div>

        {/* Contact Information Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            variants={fadeUpItem}
            className="bg-white/90 backdrop-blur-sm border border-sky-100 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center shrink-0">
                <FiMapPin className="text-sky-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-sky-950 mb-2">
                  Office Location
                </h3>
                <p className="text-sky-900/80 leading-relaxed">
                  Dakshinkali Marg
                  <br />
                  Lalitpur, Nepal
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUpItem}
            className="bg-white/90 backdrop-blur-sm border border-sky-100 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center shrink-0">
                <FiMail className="text-sky-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-sky-950 mb-2">Email</h3>
                <a
                  href="mailto:infotechguru07@gmail.com"
                  className="text-sky-900/80 hover:text-sky-700 transition"
                >
                  infotechguru07@gmail.com
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUpItem}
            className="bg-white/90 backdrop-blur-sm border border-sky-100 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center shrink-0">
                <FiPhone className="text-sky-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-sky-950 mb-3">Phone</h3>
                <div className="space-y-2">
                  <div>
                    <a
                      href="tel:+9779849447862"
                      className="text-sky-900/80 hover:text-sky-700 transition"
                    >
                      +977 984-9447862
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
