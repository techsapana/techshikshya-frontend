export interface StoredEnrollment {
  enrollmentId: number;
  courseId: number;
  courseName: string;
  addedAt: string;
}

const LEARNER_TOKEN_KEY = "userToken";
const LEARNER_ENROLLMENTS_KEY = "learnerEnrollments";

const isClient = () => typeof window !== "undefined";

export const getLearnerToken = () => {
  if (!isClient()) {
    return "";
  }

  return localStorage.getItem(LEARNER_TOKEN_KEY) || "";
};

export const setLearnerToken = (token: string) => {
  if (!isClient()) {
    return;
  }

  if (token.trim()) {
    localStorage.setItem(LEARNER_TOKEN_KEY, token.trim());
    return;
  }

  localStorage.removeItem(LEARNER_TOKEN_KEY);
};

export const getLearnerAuthHeaders = (): HeadersInit => {
  const token = getLearnerToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const getStoredEnrollments = (): StoredEnrollment[] => {
  if (!isClient()) {
    return [];
  }

  const raw = localStorage.getItem(LEARNER_ENROLLMENTS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is StoredEnrollment => {
      return (
        typeof item?.enrollmentId === "number" &&
        Number.isFinite(item.enrollmentId) &&
        typeof item?.courseId === "number" &&
        Number.isFinite(item.courseId) &&
        typeof item?.courseName === "string" &&
        typeof item?.addedAt === "string"
      );
    });
  } catch {
    return [];
  }
};

const saveStoredEnrollments = (enrollments: StoredEnrollment[]) => {
  if (!isClient()) {
    return;
  }

  localStorage.setItem(LEARNER_ENROLLMENTS_KEY, JSON.stringify(enrollments));
};

export const upsertStoredEnrollment = (
  enrollment: Omit<StoredEnrollment, "addedAt">,
) => {
  const existing = getStoredEnrollments();
  const updated = [
    {
      ...enrollment,
      addedAt: new Date().toISOString(),
    },
    ...existing.filter((item) => item.enrollmentId !== enrollment.enrollmentId),
  ];

  saveStoredEnrollments(updated);
};

export const removeStoredEnrollment = (enrollmentId: number) => {
  const existing = getStoredEnrollments();
  const updated = existing.filter((item) => item.enrollmentId !== enrollmentId);
  saveStoredEnrollments(updated);
};
