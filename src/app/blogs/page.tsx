"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { DOMAIN } from "@/src/env";

interface Blog {
  id: number;
  title: string;
  description: string;
  content: string;
  images: string[];
  createdAt: string;
}

const API_BASE = DOMAIN?.replace(/\/$/, "") || "";
const API_URL = `${API_BASE}/api/public/blogs`;

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await axios.get(API_URL, { timeout: 10000 });
      const blogList = Array.isArray(res?.data?.data) ? res.data.data : [];
      setBlogs(blogList);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
      setBlogs([]);
      setErrorMessage("Could not load blogs right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden pt-24 md:pt-28 pb-16">
      <div className="absolute -top-24 -right-20 h-80 w-80 rounded-full bg-blue-200/50 blur-[120px]" />
      <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-sky-200/50 blur-[110px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-600">
            Blogs
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">
            Insights & Stories
          </h1>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Explore practical guides, updates, and tech insights from TechGuru.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`blog-skeleton-${index}`}
                className="rounded-2xl border border-blue-100 bg-white/90 shadow-sm overflow-hidden"
              >
                <div className="h-48 bg-blue-100" />
                <div className="p-6 space-y-3">
                  <div className="h-4 w-24 bg-blue-100 rounded" />
                  <div className="h-6 w-10/12 bg-blue-100 rounded" />
                  <div className="h-4 w-full bg-blue-100 rounded" />
                  <div className="h-4 w-4/5 bg-blue-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-white/85 p-8 text-center">
            <p className="text-rose-600">{errorMessage}</p>
            <button
              onClick={fetchBlogs}
              className="mt-4 inline-flex items-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
            >
              Retry
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white/85 p-8 text-center text-slate-600">
            No blogs available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div key={blog.id} className="group">
                <Link
                  href={`/blogs/${blog.id}`}
                  className="block rounded-2xl border border-slate-200 bg-white/95 shadow-md overflow-hidden"
                >
                  <div className="relative h-52 bg-sky-50 overflow-hidden">
                    {blog.images?.[0] ? (
                      <Image
                        src={blog.images[0]}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-50" />
                    )}
                  </div>

                  <div className="p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-sky-600 mb-2">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-slate-600 line-clamp-3">
                      {blog.description}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
