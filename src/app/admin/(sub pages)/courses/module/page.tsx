"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { DOMAIN } from "@/src/env";

interface CourseOption {
  id: number;
  courseName?: string;
  title?: string;
}

interface Lesson {
  id: number;
  title: string;
  orderIndex: number;
  durationInSeconds: number;
  videoUrl: string;
}

interface ModuleItem {
  id: number;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const COURSES_API = `${DOMAIN}/api/admin/courses`;
const COURSE_CONTENT_API = `${DOMAIN}/api/admin/course-content`;

function getAxiosError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const msg =
      err.response?.data?.message || err.response?.data?.error || err.message;
    return status ? `${msg} (HTTP ${status})` : msg;
  }

  return String(err);
}

function getCourseDisplayName(course: CourseOption): string {
  return course.courseName || course.title || `Course ${course.id}`;
}

export default function AdminCourseModulesPage() {
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleOrderIndex, setModuleOrderIndex] = useState<number | "">("");

  const [courseModules, setCourseModules] = useState<
    Record<number, ModuleItem[]>
  >({});

  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [manualModuleId, setManualModuleId] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonVideo, setLessonVideo] = useState<File | null>(null);
  const [videoInputKey, setVideoInputKey] = useState(0);

  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const authHeaders = () => {
    const token = Cookies.get("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const run = async () => {
      setLoadingCourses(true);
      setError("");

      try {
        const res = await axios.get<ApiResponse<CourseOption[]>>(COURSES_API, {
          headers: authHeaders(),
        });
        setCourses(res.data.data || []);
      } catch (err) {
        setError(`Failed to load courses: ${getAxiosError(err)}`);
      } finally {
        setLoadingCourses(false);
      }
    };

    run();
  }, []);

  const modulesForSelectedCourse = useMemo(() => {
    const id = Number(selectedCourseId);
    if (!id) return [];
    return courseModules[id] || [];
  }, [selectedCourseId, courseModules]);

  const handleCreateModule = async () => {
    if (isCreatingModule) return;

    const normalizedTitle = moduleTitle.trim();
    const courseId = Number(selectedCourseId);

    if (!courseId) {
      setError("Please select a course.");
      return;
    }

    if (!normalizedTitle) {
      setError("Please enter module title.");
      return;
    }

    if (moduleOrderIndex === "") {
      setError("Please enter module order index.");
      return;
    }

    setError("");
    setSuccess("");
    setIsCreatingModule(true);

    try {
      const res = await axios.post<ApiResponse<ModuleItem>>(
        `${COURSE_CONTENT_API}/courses/${courseId}/modules`,
        {
          title: normalizedTitle,
          orderIndex: Number(moduleOrderIndex),
        },
        {
          headers: authHeaders(),
        },
      );

      const createdModule = res.data.data;

      setCourseModules((prev) => {
        const existing = prev[courseId] || [];
        const alreadyExists = existing.some(
          (module) => module.id === createdModule.id,
        );

        const updatedModules = alreadyExists
          ? existing.map((module) =>
              module.id === createdModule.id ? createdModule : module,
            )
          : [...existing, createdModule];

        updatedModules.sort((a, b) => a.orderIndex - b.orderIndex);

        return {
          ...prev,
          [courseId]: updatedModules,
        };
      });

      setSelectedModuleId(String(createdModule.id));
      setManualModuleId(String(createdModule.id));
      setModuleTitle("");
      setModuleOrderIndex("");
      setSuccess("Module created successfully.");
    } catch (err) {
      setError(`Failed to create module: ${getAxiosError(err)}`);
    } finally {
      setIsCreatingModule(false);
    }
  };

  const handleCreateLesson = async () => {
    if (isCreatingLesson) return;

    const normalizedLesson = lessonTitle.trim();
    const moduleId = Number(selectedModuleId || manualModuleId);

    if (!moduleId) {
      setError("Please select a module or enter module ID.");
      return;
    }

    if (!normalizedLesson) {
      setError("Please enter lesson title.");
      return;
    }

    if (!lessonVideo) {
      setError("Please upload a lesson video file.");
      return;
    }

    setError("");
    setSuccess("");
    setIsCreatingLesson(true);

    try {
      const formData = new FormData();
      formData.append("lesson", normalizedLesson);
      formData.append("video", lessonVideo);

      const res = await axios.post<ApiResponse<Lesson>>(
        `${COURSE_CONTENT_API}/modules/${moduleId}/lessons`,
        formData,
        {
          headers: {
            ...authHeaders(),
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const createdLesson = res.data.data;

      setCourseModules((prev) => {
        const updated: Record<number, ModuleItem[]> = {};

        Object.entries(prev).forEach(([courseId, modules]) => {
          updated[Number(courseId)] = modules.map((module) => {
            if (module.id !== moduleId) return module;

            const existingLessons = module.lessons || [];
            const hasLesson = existingLessons.some(
              (lesson) => lesson.id === createdLesson.id,
            );

            const nextLessons = hasLesson
              ? existingLessons.map((lesson) =>
                  lesson.id === createdLesson.id ? createdLesson : lesson,
                )
              : [...existingLessons, createdLesson];

            nextLessons.sort((a, b) => a.orderIndex - b.orderIndex);

            return {
              ...module,
              lessons: nextLessons,
            };
          });
        });

        return updated;
      });

      setLessonTitle("");
      setLessonVideo(null);
      setVideoInputKey((prev) => prev + 1);
      setSuccess("Lesson created successfully.");
    } catch (err) {
      setError(`Failed to create lesson: ${getAxiosError(err)}`);
    } finally {
      setIsCreatingLesson(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Course Modules & Lessons</h1>
            <p className="text-gray-500 mt-1">
              Create modules for a course and upload lesson videos.
            </p>
          </div>

          <Link
            href="/admin/courses"
            className="inline-flex items-center rounded bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900"
          >
            Back to Courses
          </Link>
        </div>

        {error && (
          <div className="rounded bg-red-100 p-3 text-red-700">{error}</div>
        )}
        {success && (
          <div className="rounded bg-green-100 p-3 text-green-700">
            {success}
          </div>
        )}

        <div className="rounded-xl border bg-gray-50 p-6 space-y-4">
          <h2 className="text-xl font-bold">1. Create Module</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-3">
              <label className="mb-1 block text-sm font-semibold">Course</label>
              <select
                value={selectedCourseId}
                onChange={(event) => {
                  setSelectedCourseId(event.target.value);
                  setSelectedModuleId("");
                  setManualModuleId("");
                }}
                className="w-full rounded border border-gray-300 p-2"
              >
                <option value="">
                  {loadingCourses ? "Loading courses..." : "Select a course"}
                </option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {getCourseDisplayName(course)} (ID: {course.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">
                Module Title
              </label>
              <input
                value={moduleTitle}
                onChange={(event) => setModuleTitle(event.target.value)}
                placeholder="Enter module title"
                className="w-full rounded border border-gray-300 p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">
                Order Index
              </label>
              <input
                type="number"
                min={0}
                value={moduleOrderIndex}
                onChange={(event) =>
                  setModuleOrderIndex(
                    event.target.value === "" ? "" : Number(event.target.value),
                  )
                }
                placeholder="0"
                className="w-full rounded border border-gray-300 p-2"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleCreateModule}
                disabled={isCreatingModule}
                className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isCreatingModule ? "Creating Module..." : "Create Module"}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-gray-50 p-6 space-y-4">
          <h2 className="text-xl font-bold">2. Create Lesson (Video Upload)</h2>
          <p className="text-sm text-gray-600">
            The lesson endpoint uses a file upload. The returned videoUrl is
            generated by the backend after uploading your video file.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold">
                Module (from modules created here)
              </label>
              <select
                value={selectedModuleId}
                onChange={(event) => {
                  setSelectedModuleId(event.target.value);
                  setManualModuleId(event.target.value);
                }}
                className="w-full rounded border border-gray-300 p-2"
              >
                <option value="">Select module</option>
                {modulesForSelectedCourse.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.title} (ID: {module.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">
                Or Enter Module ID
              </label>
              <input
                type="number"
                min={1}
                value={manualModuleId}
                onChange={(event) => {
                  setManualModuleId(event.target.value);
                  if (
                    selectedModuleId &&
                    event.target.value !== selectedModuleId
                  ) {
                    setSelectedModuleId("");
                  }
                }}
                placeholder="Module ID"
                className="w-full rounded border border-gray-300 p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">
                Lesson Title
              </label>
              <input
                value={lessonTitle}
                onChange={(event) => setLessonTitle(event.target.value)}
                placeholder="Enter lesson title"
                className="w-full rounded border border-gray-300 p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">
                Video File
              </label>
              <input
                key={videoInputKey}
                type="file"
                accept="video/*"
                onChange={(event) =>
                  setLessonVideo(event.target.files?.[0] || null)
                }
                className="w-full rounded border border-gray-300 bg-white p-2"
              />
            </div>
          </div>

          <button
            onClick={handleCreateLesson}
            disabled={isCreatingLesson}
            className="rounded bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
          >
            {isCreatingLesson ? "Uploading Lesson..." : "Create Lesson"}
          </button>
        </div>

        <div className="rounded-xl border bg-white p-6 space-y-3">
          <h2 className="text-xl font-bold">
            Modules Created For Selected Course
          </h2>

          {!selectedCourseId && (
            <p className="text-sm text-gray-500">
              Select a course to view modules.
            </p>
          )}

          {selectedCourseId && modulesForSelectedCourse.length === 0 && (
            <p className="text-sm text-gray-500">
              No modules created in this session for this course yet.
            </p>
          )}

          {modulesForSelectedCourse.map((module) => (
            <div key={module.id} className="rounded border bg-gray-50 p-4">
              <p className="font-semibold">{module.title}</p>
              <p className="text-sm text-gray-600">ID: {module.id}</p>
              <p className="text-sm text-gray-600">
                Order: {module.orderIndex}
              </p>
              <p className="text-sm text-gray-600">
                Lessons: {module.lessons?.length || 0}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
