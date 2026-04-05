"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DOMAIN } from "@/src/env";
import { useAuth } from "@/src/hooks/useAuth";

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

interface UserEnrollment {
  id: number;
  userId: number;
  courseId: number;
  courseName: string;
  enrolledAt: string;
  completed: boolean;
}

interface UserEnrollmentsApiResponse {
  success: boolean;
  message: string;
  data: UserEnrollment[];
}

interface EnrollmentProgressState {
  loading: boolean;
  error: string;
  data: ProgressData | null;
}

const defaultProgressState = (): EnrollmentProgressState => ({
  loading: true,
  error: "",
  data: null,
});

async function fetchUserEnrollments(): Promise<UserEnrollment[]> {
  const response = await fetch(`${DOMAIN}/api/user/enrollments`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  const json = (await response.json()) as UserEnrollmentsApiResponse;

  if (!response.ok || !json.success) {
    throw new Error(json?.message || "Failed to fetch enrollments");
  }

  return json.data || [];
}

async function fetchProgressByEnrollment(
  enrollmentId: number,
): Promise<ProgressData> {
  const response = await fetch(`${DOMAIN}/api/user/progress/${enrollmentId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  const json = (await response.json()) as ProgressApiResponse;

  if (!response.ok || !json.success) {
    throw new Error(json?.message || "Failed to fetch progress");
  }

  return json.data;
}

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [enrollments, setEnrollments] = useState<UserEnrollment[]>([]);
  const [progressMap, setProgressMap] = useState<
    Record<number, EnrollmentProgressState>
  >({});
  const [loadingPage, setLoadingPage] = useState(true);
  const [inlineError, setInlineError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const hydrateProgress = useCallback(async (items: UserEnrollment[]) => {
    if (items.length === 0) {
      setProgressMap({});
      return;
    }

    setProgressMap(
      items.reduce<Record<number, EnrollmentProgressState>>((acc, item) => {
        acc[item.id] = defaultProgressState();
        return acc;
      }, {}),
    );

    const progressResults = await Promise.all(
      items.map(async (item) => {
        try {
          const data = await fetchProgressByEnrollment(item.id);
          return {
            enrollmentId: item.id,
            state: {
              loading: false,
              error: "",
              data,
            } satisfies EnrollmentProgressState,
          };
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to fetch progress";

          return {
            enrollmentId: item.id,
            state: {
              loading: false,
              error: message,
              data: null,
            } satisfies EnrollmentProgressState,
          };
        }
      }),
    );

    setProgressMap(
      progressResults.reduce<Record<number, EnrollmentProgressState>>(
        (acc, entry) => {
          acc[entry.enrollmentId] = entry.state;
          return acc;
        },
        {},
      ),
    );
  }, []);

  const loadDashboard = useCallback(async () => {
    setInlineError("");
    setLoadingPage(true);

    try {
      const items = await fetchUserEnrollments();
      setEnrollments(items);
      await hydrateProgress(items);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load dashboard";
      setInlineError(message);
      setEnrollments([]);
      setProgressMap({});
    } finally {
      setLoadingPage(false);
    }
  }, [hydrateProgress]);

  const refreshProgress = useCallback(async () => {
    if (enrollments.length === 0) {
      return;
    }

    setRefreshing(true);
    setInlineError("");

    try {
      await hydrateProgress(enrollments);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to refresh progress";
      setInlineError(message);
    } finally {
      setRefreshing(false);
    }
  }, [enrollments, hydrateProgress]);

  useEffect(() => {
    if (!isAuthenticated || authLoading) {
      return;
    }

    void loadDashboard();
  }, [authLoading, isAuthenticated, loadDashboard]);

  const overview = useMemo(() => {
    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(
      (item) => item.completed,
    ).length;

    let completedLessons = 0;
    let totalLessons = 0;

    Object.values(progressMap).forEach((entry) => {
      if (!entry.data) {
        return;
      }

      completedLessons += entry.data.completedLessons;
      totalLessons += entry.data.totalLessons;
    });

    const percent =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return {
      totalCourses,
      completedCourses,
      completedLessons,
      totalLessons,
      percent,
    };
  }, [enrollments, progressMap]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 pt-28 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
          Checking your account...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 pt-28 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
          <p className="font-semibold">
            Please login to access your learning dashboard.
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

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 via-white to-cyan-50 px-4 pt-28 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
            Learning Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
            Keep learning where you left off
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Your courses and progress are synced automatically from your
            account. No manual token setup needed.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Enrolled Courses
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {overview.totalCourses}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                Completed Courses
              </p>
              <p className="mt-2 text-2xl font-bold text-emerald-900">
                {overview.completedCourses}
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
                Lessons Done
              </p>
              <p className="mt-2 text-2xl font-bold text-cyan-900">
                {overview.completedLessons}/{overview.totalLessons}
              </p>
            </div>
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">
                Overall Progress
              </p>
              <p className="mt-2 text-2xl font-bold text-indigo-900">
                {overview.percent}%
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void refreshProgress()}
              disabled={refreshing || loadingPage}
              className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {refreshing ? "Refreshing..." : "Refresh Progress"}
            </button>
            <Link
              href="/courses"
              className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
            >
              Explore More Courses
            </Link>
          </div>

          {inlineError ? (
            <p className="mt-4 rounded-lg border border-rose-100 bg-rose-50 px-4 py-2 text-sm text-rose-700">
              {inlineError}
            </p>
          ) : null}
        </section>

        {loadingPage ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-slate-600">Loading your courses...</p>
          </section>
        ) : enrollments.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
            You are not enrolled in any courses yet.
            <div className="mt-3">
              <Link
                href="/courses"
                className="font-semibold text-cyan-700 hover:text-cyan-800"
              >
                Browse courses
              </Link>
            </div>
          </section>
        ) : (
          <section className="grid gap-4 lg:grid-cols-2">
            {enrollments.map((enrollment) => {
              const progressState = progressMap[enrollment.id];
              const progress = progressState?.data;

              const percent = Math.min(
                Math.max(
                  Math.round(
                    progress?.completionPercentage ??
                      (enrollment.completed ? 100 : 0),
                  ),
                  0,
                ),
                100,
              );

              const nextLesson = progress?.lessons?.find(
                (lesson) => !lesson.completed,
              );

              const courseId = progress?.courseId || enrollment.courseId;
              const courseName = progress?.courseName || enrollment.courseName;

              return (
                <article
                  key={enrollment.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        Enrollment #{enrollment.id}
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-slate-900">
                        {courseName}
                      </h2>
                    </div>
                    {enrollment.completed && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Completed
                      </span>
                    )}
                  </div>

                  {progressState?.loading ? (
                    <p className="mt-4 text-sm text-slate-600">
                      Loading progress...
                    </p>
                  ) : progressState?.error ? (
                    <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                      {progressState.error}
                    </p>
                  ) : (
                    <>
                      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-cyan-500 to-blue-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <p className="mt-2 text-sm font-medium text-slate-700">
                        {progress?.completedLessons || 0}/
                        {progress?.totalLessons || 0} lessons completed (
                        {percent}%)
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        {nextLesson
                          ? `Next up: ${nextLesson.lessonTitle}`
                          : "You have completed all available lessons."}
                      </p>
                    </>
                  )}

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={`/dashboard/learn/${enrollment.id}/${courseId}`}
                      className="rounded-full bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
                    >
                      Continue Learning
                    </Link>
                    <Link
                      href={`/courses/${courseId}`}
                      className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
                    >
                      View Course
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}
