"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DOMAIN } from "@/src/env";
import { useAuth } from "@/src/hooks/useAuth";

interface Lesson {
  id: number;
  title: string;
  orderIndex: number;
  durationInSeconds: number;
  videoUrl: string;
}

interface CourseModule {
  id: number;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
}

interface ModulesApiResponse {
  success: boolean;
  message: string;
  data: CourseModule[];
}

interface ProgressLesson {
  lessonId: number;
  lessonTitle: string;
  completed: boolean;
  completedAt: string | null;
}

interface ProgressData {
  enrollmentId: number;
  courseId: number;
  courseName: string;
  totalLessons: number;
  completedLessons: number;
  completionPercentage: number;
  lessons: ProgressLesson[];
}

interface ProgressApiResponse {
  success: boolean;
  message: string;
  data: ProgressData;
}

interface CompleteLessonApiResponse {
  success: boolean;
  message: string;
  data: {
    lessonId: number;
    lessonTitle: string;
    completed: boolean;
    completedAt: string | null;
  };
}

interface LessonReference {
  moduleId: number;
  moduleTitle: string;
  moduleOrder: number;
  lesson: Lesson;
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}m ${remainingSeconds.toString().padStart(2, "0")}s`;
};

const getYoutubeEmbedUrl = (url: string) => {
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);

    if (parsed.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      if (parsed.pathname.includes("/embed/")) {
        return url;
      }
    }
  } catch {
    return "";
  }

  return "";
};

export default function LearningPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const params = useParams();

  const enrollmentId = Number(params.enrollmentId);
  const courseId = Number(params.courseId);

  const [modules, setModules] = useState<CourseModule[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [completing, setCompleting] = useState(false);

  const fetchModules = useCallback(async () => {
    const response = await fetch(
      `${DOMAIN}/api/user/course-content/courses/${courseId}/modules`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      },
    );

    const json = (await response.json()) as ModulesApiResponse;

    if (!response.ok || !json.success) {
      throw new Error(json?.message || "Failed to load modules");
    }

    return json.data || [];
  }, [courseId]);

  const fetchProgress = useCallback(async () => {
    const response = await fetch(
      `${DOMAIN}/api/user/progress/${enrollmentId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      },
    );

    const json = (await response.json()) as ProgressApiResponse;

    if (!response.ok || !json.success) {
      throw new Error(json?.message || "Failed to load progress");
    }

    return json.data;
  }, [enrollmentId]);

  const loadData = useCallback(async () => {
    if (
      !Number.isFinite(courseId) ||
      !Number.isFinite(enrollmentId) ||
      courseId <= 0 ||
      enrollmentId <= 0
    ) {
      setError("Invalid course or enrollment ID.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [modulesData, progressData] = await Promise.all([
        fetchModules(),
        fetchProgress(),
      ]);

      const orderedModules = [...modulesData]
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((module) => ({
          ...module,
          lessons: [...module.lessons].sort(
            (a, b) => a.orderIndex - b.orderIndex,
          ),
        }));

      setModules(orderedModules);
      setProgress(progressData);

      const firstLesson = orderedModules[0]?.lessons[0];
      if (firstLesson) {
        setActiveLessonId(firstLesson.id);
        setExpandedModules([orderedModules[0].id]);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load content";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [courseId, enrollmentId, fetchModules, fetchProgress]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return;
    }

    void loadData();
  }, [authLoading, isAuthenticated, loadData]);

  const lessonProgressMap = useMemo(() => {
    const map = new Map<number, ProgressLesson>();

    (progress?.lessons || []).forEach((lesson) => {
      map.set(lesson.lessonId, lesson);
    });

    return map;
  }, [progress]);

  const lessonReferences = useMemo<LessonReference[]>(
    () =>
      modules.flatMap((module) =>
        module.lessons.map((lesson) => ({
          moduleId: module.id,
          moduleTitle: module.title,
          moduleOrder: module.orderIndex,
          lesson,
        })),
      ),
    [modules],
  );

  useEffect(() => {
    if (lessonReferences.length === 0) {
      return;
    }

    if (!activeLessonId) {
      setActiveLessonId(lessonReferences[0].lesson.id);
      return;
    }

    const exists = lessonReferences.some(
      (entry) => entry.lesson.id === activeLessonId,
    );
    if (!exists) {
      setActiveLessonId(lessonReferences[0].lesson.id);
    }
  }, [activeLessonId, lessonReferences]);

  const selectedLessonRef = useMemo(
    () =>
      lessonReferences.find((entry) => entry.lesson.id === activeLessonId) ||
      null,
    [activeLessonId, lessonReferences],
  );

  useEffect(() => {
    if (!selectedLessonRef) {
      return;
    }

    setExpandedModules((current) =>
      current.includes(selectedLessonRef.moduleId)
        ? current
        : [...current, selectedLessonRef.moduleId],
    );
  }, [selectedLessonRef]);

  const selectedIndex = useMemo(() => {
    if (!selectedLessonRef) {
      return -1;
    }

    return lessonReferences.findIndex(
      (entry) => entry.lesson.id === selectedLessonRef.lesson.id,
    );
  }, [lessonReferences, selectedLessonRef]);

  const previousLesson =
    selectedIndex > 0 ? lessonReferences[selectedIndex - 1] : null;
  const nextLesson =
    selectedIndex >= 0 && selectedIndex < lessonReferences.length - 1
      ? lessonReferences[selectedIndex + 1]
      : null;

  const selectedLessonProgress = selectedLessonRef
    ? lessonProgressMap.get(selectedLessonRef.lesson.id)
    : null;

  const youtubeEmbed = selectedLessonRef
    ? getYoutubeEmbedUrl(selectedLessonRef.lesson.videoUrl)
    : "";

  const toggleModule = (moduleId: number) => {
    setExpandedModules((current) =>
      current.includes(moduleId)
        ? current.filter((id) => id !== moduleId)
        : [...current, moduleId],
    );
  };

  const selectLesson = (lessonId: number, moduleId: number) => {
    setActiveLessonId(lessonId);
    setExpandedModules((current) =>
      current.includes(moduleId) ? current : [...current, moduleId],
    );
  };

  const handleMarkComplete = async () => {
    if (!selectedLessonRef) {
      return;
    }

    setCompleting(true);
    setError("");

    try {
      const query = new URLSearchParams({
        enrollmentId: String(enrollmentId),
        lessonId: String(selectedLessonRef.lesson.id),
      });

      const response = await fetch(
        `${DOMAIN}/api/user/progress/complete?${query}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        },
      );

      const json = (await response.json()) as CompleteLessonApiResponse;

      if (!response.ok || !json.success) {
        throw new Error(json?.message || "Failed to complete lesson");
      }

      const latestProgress = await fetchProgress();
      setProgress(latestProgress);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to complete lesson";
      setError(message);
    } finally {
      setCompleting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 pt-28 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-6">
          Checking your account...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 pt-28 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
          <p className="font-semibold">
            Please login to access this learning dashboard.
          </p>
          <div className="mt-3">
            <Link
              href="/login"
              className="inline-flex rounded-full bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 pt-28 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-6">
          Loading course content...
        </div>
      </div>
    );
  }

  if (error && !selectedLessonRef) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 pt-28 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          <p className="font-semibold">{error}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void loadData()}
              className="rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Retry
            </button>
            <Link
              href="/dashboard"
              className="rounded-full border border-rose-300 px-5 py-2 text-sm font-semibold text-rose-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 via-white to-cyan-50 px-4 pt-24 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Course Player
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
                {progress?.courseName || `Course #${courseId}`}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Enrollment #{enrollmentId}
              </p>
            </div>

            <Link
              href="/dashboard"
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
            >
              Back to Dashboard
            </Link>
          </div>

          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-linear-to-r from-cyan-500 to-blue-500"
              style={{
                width: `${Math.min(Math.max(progress?.completionPercentage || 0, 0), 100)}%`,
              }}
            />
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-700">
            {progress?.completedLessons || 0}/{progress?.totalLessons || 0}{" "}
            lessons completed ({Math.round(progress?.completionPercentage || 0)}
            %)
          </p>

          {error ? (
            <p className="mt-3 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}
        </section>

        <section className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              {!selectedLessonRef ? (
                <p className="text-slate-600">
                  No lessons available for this course yet.
                </p>
              ) : (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Module {selectedLessonRef.moduleOrder + 1}:{" "}
                        {selectedLessonRef.moduleTitle}
                      </p>
                      <h2 className="mt-1 text-2xl font-bold text-slate-900">
                        {selectedLessonRef.lesson.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        Duration:{" "}
                        {formatDuration(
                          selectedLessonRef.lesson.durationInSeconds,
                        )}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        selectedLessonProgress?.completed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {selectedLessonProgress?.completed
                        ? "Completed"
                        : "In Progress"}
                    </span>
                  </div>

                  <div className="mt-4">
                    {youtubeEmbed ? (
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black">
                        <iframe
                          src={youtubeEmbed}
                          title={selectedLessonRef.lesson.title}
                          className="aspect-video w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : selectedLessonRef.lesson.videoUrl ? (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-700">
                          Video player is unavailable for this URL format.
                        </p>
                        <a
                          href={selectedLessonRef.lesson.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex rounded-full bg-cyan-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
                        >
                          Open Lesson Video
                        </a>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                        Video URL is not available for this lesson yet.
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled={!previousLesson}
                      onClick={() =>
                        previousLesson &&
                        selectLesson(
                          previousLesson.lesson.id,
                          previousLesson.moduleId,
                        )
                      }
                      className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous Lesson
                    </button>
                    <button
                      type="button"
                      disabled={!nextLesson}
                      onClick={() =>
                        nextLesson &&
                        selectLesson(nextLesson.lesson.id, nextLesson.moduleId)
                      }
                      className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next Lesson
                    </button>
                    <button
                      type="button"
                      onClick={handleMarkComplete}
                      disabled={
                        Boolean(selectedLessonProgress?.completed) || completing
                      }
                      className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {selectedLessonProgress?.completed
                        ? "Lesson Completed"
                        : completing
                          ? "Marking..."
                          : "Mark as Complete"}
                    </button>
                  </div>

                  {selectedLessonProgress?.completedAt ? (
                    <p className="mt-2 text-sm text-slate-600">
                      Completed at{" "}
                      {new Date(
                        selectedLessonProgress.completedAt,
                      ).toLocaleString()}
                    </p>
                  ) : null}
                </>
              )}
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="px-2 pb-2 text-lg font-bold text-slate-900">
                Curriculum
              </h3>
              <p className="px-2 pb-4 text-sm text-slate-600">
                Modules are separated. Expand any module to jump to a lesson
                quickly.
              </p>

              <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
                {modules.map((module) => {
                  const isExpanded = expandedModules.includes(module.id);
                  const completedInModule = module.lessons.filter((lesson) => {
                    return lessonProgressMap.get(lesson.id)?.completed;
                  }).length;

                  return (
                    <div
                      key={module.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70"
                    >
                      <button
                        type="button"
                        onClick={() => toggleModule(module.id)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Module {module.orderIndex + 1}
                          </p>
                          <p className="text-sm text-slate-700">
                            {module.title}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-slate-500">
                            {completedInModule}/{module.lessons.length}
                          </p>
                          <p className="text-xs text-slate-500">
                            {isExpanded ? "Hide" : "Show"}
                          </p>
                        </div>
                      </button>

                      {isExpanded && (
                        <ul className="border-t border-slate-200 px-2 py-2">
                          {module.lessons.map((lesson) => {
                            const isActive =
                              lesson.id === selectedLessonRef?.lesson.id;
                            const lessonProgress = lessonProgressMap.get(
                              lesson.id,
                            );

                            return (
                              <li key={lesson.id}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    selectLesson(lesson.id, module.id)
                                  }
                                  className={`my-1 w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                                    isActive
                                      ? "border-cyan-500 bg-cyan-50 text-cyan-900"
                                      : "border-slate-200 bg-white text-slate-700 hover:border-cyan-200"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="line-clamp-1">
                                      {lesson.title}
                                    </span>
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                        lessonProgress?.completed
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-amber-100 text-amber-700"
                                      }`}
                                    >
                                      {lessonProgress?.completed
                                        ? "Done"
                                        : "Pending"}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-xs text-slate-500">
                                    {formatDuration(lesson.durationInSeconds)}
                                  </p>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
