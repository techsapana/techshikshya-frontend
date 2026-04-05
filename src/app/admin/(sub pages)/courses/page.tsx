"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { DOMAIN } from "@/src/env";
import Editor from "@/src/components/Editor";

interface Course {
  id: number;
  courseName: string;
  title: string;
  duration: string;
  price: number;
  discountPercentage: number;
  discountedPrice: number;
  description: string;
  content: string;
  category: string;
  features: string[];
  images: string[];
  courseType: string;
  startDate: string;
}

interface CourseForm {
  courseName: string;
  title: string;
  duration: string;
  price: number | "";
  discountPercentage: number | "";
  description: string;
  content: string;
  category: string;
  features: string[];
  courseType: string;
  startDate: string;
}

interface Category {
  id: number;
  name: string;
}

const API_URL = `${DOMAIN}/api/admin/courses`;

function getAxiosError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const msg =
      err.response?.data?.message || err.response?.data?.error || err.message;
    return status ? `${msg} (HTTP ${status})` : msg;
  }
  return String(err);
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [images, setImages] = useState<File[]>([]);

  const [form, setForm] = useState<CourseForm>({
    courseName: "",
    title: "",
    duration: "",
    price: "",
    discountPercentage: "",
    description: "",
    content: "",
    category: "",
    features: [] as string[],
    courseType: "ONLINE",
    startDate: "",
  });

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${DOMAIN}/api/public/categories`);
      setCategories(res.data.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("adminToken");

      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourses(res.data.data || []);
    } catch (err) {
      setError(`Failed to load courses: ${getAxiosError(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const resetForm = () => {
    setEditingCourse(null);
    setShowForm(false);
    setImages([]);
    setForm({
      courseName: "",
      title: "",
      duration: "",
      price: "",
      discountPercentage: "",
      description: "",
      content: "",
      category: "",
      features: [],
      courseType: "ONLINE",
      startDate: "",
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const token = Cookies.get("adminToken");

      const formData = new FormData();

      const payload = {
        ...form,
        price: form.price === "" ? 0 : form.price,
        discountPercentage:
          form.discountPercentage === "" ? 0 : form.discountPercentage,
      };

      formData.append("course", JSON.stringify(payload));

      images.forEach((img) => {
        formData.append("images", img);
      });

      if (editingCourse) {
        await axios.put(`${API_URL}/${editingCourse.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Course updated successfully!");
      } else {
        await axios.post(API_URL, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Course created successfully!");
      }

      resetForm();
      fetchCourses();
    } catch (err) {
      alert(getAxiosError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCourse = async (id: number) => {
    if (!confirm("Delete this course?")) return;

    try {
      const token = Cookies.get("adminToken");

      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Course deleted.");
      fetchCourses();
    } catch (err) {
      setError(getAxiosError(err));
    }
  };

  const openEdit = (course: Course) => {
    setEditingCourse(course);
    setShowForm(true);

    setForm({
      courseName: course.courseName,
      title: course.title,
      duration: course.duration,
      price: course.price,
      discountPercentage: course.discountPercentage,
      description: course.description,
      content: course.content,
      category: course.category,
      features: course.features || [],
      courseType: course.courseType,
      startDate: course.startDate,
    });
  };

  const addFeature = () => {
    setForm((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const updateFeature = (value: string, index: number) => {
    const updated = [...form.features];
    updated[index] = value;
    setForm((prev) => ({ ...prev, features: updated }));
  };

  const removeFeature = (index: number) => {
    const updated = form.features.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, features: updated }));
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Course Management</h1>
        <p className="text-gray-500 mb-8">
          Create and manage all courses available on the platform.
        </p>

        {error && (
          <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-100 text-green-700 p-3 rounded">
            {success}
          </div>
        )}

        {/* FORM */}
        {showForm && (
          <div className="border p-6 rounded-xl mb-8 bg-gray-50">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">
                {editingCourse ? "Edit Course" : "Create Course"}
              </h2>

              <button className="cursor-pointer" onClick={resetForm}>
                <X />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                placeholder="Course Name"
                value={form.courseName}
                onChange={(e) =>
                  setForm({ ...form, courseName: e.target.value })
                }
                className="border p-2 rounded"
              />

              <input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border p-2 rounded"
              />

              <input
                placeholder="Duration"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="border p-2 rounded"
              />

              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="border p-2 rounded"
              />

              <input
                type="number"
                placeholder="Discount %"
                value={form.discountPercentage}
                onChange={(e) =>
                  setForm({
                    ...form,
                    discountPercentage:
                      e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                className="border p-2 rounded"
              />

              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="border-2 border-gray-300 p-4 text-lg rounded focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DESCRIPTION EDITOR */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Description</h3>

              <Editor
                value={form.description}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, description: value }))
                }
              />
            </div>

            {/* CONTENT EDITOR */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Course Content</h3>

              <Editor
                value={form.content}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, content: value }))
                }
              />
            </div>

            {/* FEATURES */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Features</h3>

              {form.features.map((f, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    value={f}
                    onChange={(e) => updateFeature(e.target.value, i)}
                    className="border p-2 flex-1 rounded"
                  />

                  <button
                    onClick={() => removeFeature(i)}
                    className="bg-red-500 cursor-pointer hover:bg-red-600 font-bold transition-colors duration-200 text-white px-3 rounded"
                  >
                    X
                  </button>
                </div>
              ))}

              <button
                onClick={addFeature}
                className="cursor-pointer bg-blue-500 hover:bg-blue-600 transition-colors duration-200 font-bold text-white px-4 py-2 rounded text-sm"
              >
                Add Feature
              </button>
            </div>

            {/* IMAGE UPLOAD */}
            <div className="mb-6 border p-2">
              <input
                type="file"
                multiple
                onChange={(e) => setImages(Array.from(e.target.files || []))}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="cursor-pointer bg-blue-500 hover:bg-blue-600 transition-colors duration-200 font-bold text-white px-6 py-2 rounded disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {editingCourse
                ? isSubmitting
                  ? "Updating..."
                  : "Update Course"
                : isSubmitting
                  ? "Creating..."
                  : "Create Course"}
            </button>
          </div>
        )}

        {/* COURSE LIST */}

        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">All Courses</h2>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 cursor-pointer bg-blue-500 font-bold hover:bg-blue-600 transition-colors duration-200 text-white px-4 py-2 rounded"
            >
              <Plus size={16} />
              Add Course
            </button>
          )}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <div className="space-y-3">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="border p-4 rounded-lg flex items-center gap-4 bg-gray-50"
                >
                  {c.images?.[0] && (
                    <div className="relative w-28 h-16 rounded overflow-hidden">
                      <Image
                        src={c.images[0]}
                        alt={c.courseName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="font-semibold">{c.courseName}</p>
                    <p className="text-sm text-gray-500">{c.duration}</p>
                  </div>

                  <button
                    onClick={() => openEdit(c)}
                    className="bg-yellow-500 text-white p-2 rounded"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => deleteCourse(c.id)}
                    className="bg-red-600 text-white p-2 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Link
                href="/admin/courses/module"
                className="inline-flex items-center gap-2 cursor-pointer bg-green-600 font-bold hover:bg-green-700 transition-colors duration-200 text-white px-4 py-2 rounded"
              >
                <Plus size={16} />
                Add Module / Lessons
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
