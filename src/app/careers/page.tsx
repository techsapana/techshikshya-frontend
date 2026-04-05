"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface JobListing {
  id: number;
  title: string;
  date: string;
  status: "active" | "expired";
  image: string;
  description: string;
}

const jobListings: JobListing[] = [
  {
    id: 1,
    title: "Software Support Intern (Remote)",
    date: "Dec 22, 2024",
    status: "expired",
    image: "/file.svg",
    description:
      "Gain hands-on experience providing technical support as a Software Support Intern.",
  },
  {
    id: 2,
    title: "Senior MEAN Stack Developer",
    date: "Jan 15, 2025",
    status: "active",
    image: "/globe.svg",
    description:
      "Join our team as a Senior MEAN Stack Developer and work on cutting-edge projects.",
  },
  {
    id: 3,
    title: "Assistant IT System Administrator",
    date: "Feb 1, 2025",
    status: "active",
    image: "/next.svg",
    description:
      "Support IT infrastructure management and maintenance as an Assistant System Administrator.",
  },
  {
    id: 4,
    title: "IT Executive",
    date: "Jan 20, 2025",
    status: "active",
    image: "/vercel.svg",
    description:
      "Lead IT initiatives and strategic planning as an IT Executive in Vedu.",
  },
];

const testimonials = [
  {
    name: "Bishan Mahat",
    role: "Digital Marketing Expert",
    image: "/file.svg",
    feedback:
      "Vedu's Digital Marketing course was outstanding! The hands-on projects and expert guidance gave me real-world skills. Highly recommend!",
  },
  {
    name: "Ganesh Thapa",
    role: "Graphic Designer",
    image: "/globe.svg",
    feedback:
      "Vedu's Photoshop course boosted my design skills tremendously. The instructors were supportive and highly knowledgeable.",
  },
];

export default function CareersPage() {
  const [hoveredJob, setHoveredJob] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
            Join Vedu
          </h1>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Explore career opportunities with Vedu and be a part of a team that
            is transforming education through technology.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-bold text-blue-900 mb-6">
              Current Openings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobListings.map((job) => (
                <div
                  key={job.id}
                  className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer border border-gray-200"
                  onMouseEnter={() => setHoveredJob(job.id)}
                  onMouseLeave={() => setHoveredJob(null)}
                >
                  <div className="relative h-48 bg-linear-to-br from-blue-50 to-blue-100">
                    <Image
                      src={job.image}
                      alt={job.title}
                      fill
                      className="object-cover"
                    />
                    <div
                      className={`absolute inset-0 bg-blue-900/90 flex flex-col items-center justify-center gap-3 text-center transition-opacity duration-300 ${
                        hoveredJob === job.id
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
                    >
                      <div className="text-white font-semibold">{job.date}</div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          job.status === "expired"
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      >
                        {job.status === "expired" ? "Expired" : "Active"}
                      </div>
                      <Link href="/">
                        <button className="cursor-pointer mt-2 bg-white text-blue-900 font-semibold px-5 py-2 rounded-lg hover:bg-gray-100 transition">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                  <div className="bg-orange-500 p-4 text-center">
                    <h3 className="text-white font-bold">{job.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
              <p className="text-sm text-orange-500 font-semibold mb-2">
                Student Feedback
              </p>
              <h3 className="text-2xl font-bold text-blue-900 mb-6">
                What They Say About Vedu
              </h3>
              <div className="space-y-6">
                {testimonials.map((t, idx) => (
                  <div key={idx} className="space-y-3">
                    <p className="text-gray-700 text-sm">{t.feedback}</p>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                        <Image
                          src={t.image}
                          alt={t.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{t.name}</h4>
                        <p className="text-sm text-gray-600">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-900 text-white rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold mb-3">Be Part of Vedu</h3>
              <p className="text-sm mb-4">
                We are always looking for passionate individuals to join our
                team. If you love technology and education, let&apos;s connect!
              </p>
              <a
                href="/contact-us"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
