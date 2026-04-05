"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { DOMAIN } from "@/src/env";
import EditorViewer from "@/src/components/EditorViewer";

interface Blog {
  id: number;
  title: string;
  description: string;
  content: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export default function BlogPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${DOMAIN}/api/public/blogs/${id}`);
        setBlog(res.data.data);
      } catch (err) {
        console.error("Failed to fetch blog", err);
        setBlog(null);
      }
      setLoading(false);
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <section className="min-h-screen bg-linear-to-b from-[#d9e8ff] via-[#edf4ff] to-[#dfeaff] pt-24 md:pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-36 bg-blue-100 rounded mb-6 animate-pulse" />
          <div className="h-10 w-3/4 bg-blue-100 rounded mb-4 animate-pulse" />
          <div className="h-4 w-40 bg-blue-100 rounded mb-6 animate-pulse" />
          <div className="w-full h-72 md:h-96 bg-blue-100 rounded-2xl mb-8 animate-pulse" />
          <div className="space-y-3 mb-6">
            <div className="h-4 bg-blue-100 rounded w-full animate-pulse" />
            <div className="h-4 bg-blue-100 rounded w-5/6 animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-blue-100 rounded w-full animate-pulse" />
            <div className="h-4 bg-blue-100 rounded w-full animate-pulse" />
            <div className="h-4 bg-blue-100 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-blue-100 rounded w-4/6 animate-pulse" />
            <div className="h-4 bg-blue-100 rounded w-full animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-[#d9e8ff] via-[#edf4ff] to-[#dfeaff] pt-24 md:pt-28 px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Blog not found
        </h1>
        <button
          onClick={() => router.push("/blogs")}
          className="bg-linear-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white px-6 py-3 rounded-lg"
        >
          Go Back to Blogs
        </button>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden pt-24 md:pt-28 pb-16">
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-200/50 blur-[120px]" />
      <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-sky-200/50 blur-[110px]" />

      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={itemVariants}>
          <Link
            href="/blogs"
            className="text-sky-600 hover:text-sky-700 hover:underline mb-6 inline-block"
          >
            &larr; Back to Blogs
          </Link>
        </motion.div>

        <motion.article
          variants={itemVariants}
          className="rounded-2xl border border-slate-200 bg-white/95 shadow-md p-6 md:p-8"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-sky-600 mb-2">
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-5">
            {blog.title}
          </h1>

          {blog.images?.length > 0 && (
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.25 }}
              className="relative w-full h-75 md:h-130 mb-8 rounded-2xl overflow-hidden bg-sky-50"
            >
              <Image
                src={blog.images[0]}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </motion.div>
          )}

          {blog.description && (
            <p className="text-lg text-slate-600 mb-6">{blog.description}</p>
          )}

          <div className="prose max-w-none text-slate-700">
            <EditorViewer
              content={blog?.content || ""}
              className="text-slate-700 -ml-14"
            />
          </div>
        </motion.article>
      </motion.div>
    </section>
  );
}
