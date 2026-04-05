"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DOMAIN } from "@/src/env";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface Enrollment {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  course: string;
  educationLevel: string;
  preferredLearningPlatform: string;
  hasLaptop: string;
  status: string;
  submittedAt: string;
}

interface UserEnrollment {
  id: number;
  userId: number;
  courseId: number;
  courseName: string;
  enrolledAt: string;
  completed: boolean;
}

type EnrollmentStatus = "PENDING" | "APPROVED" | "REJECTED";
type EnrollmentFilter = "ALL" | EnrollmentStatus;

const ENROLLMENTS_API = `${DOMAIN}/api/enrollments`;
const ADMIN_ENROLLMENTS_API = `${DOMAIN}/api/admin/enrollments`;

function getAxiosError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || err.message || "Request failed";
  }

  return "Unexpected error";
}

function getAuthHeaders() {
  const token = Cookies.get("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<EnrollmentFilter>("ALL");
  const [userIdInput, setUserIdInput] = useState("");
  const [userEnrollments, setUserEnrollments] = useState<UserEnrollment[]>([]);
  const [loadingUserEnrollments, setLoadingUserEnrollments] = useState(false);
  const [userEnrollmentError, setUserEnrollmentError] = useState("");
  const [hasSearchedUserEnrollments, setHasSearchedUserEnrollments] =
    useState(false);

  /* ---------------- FETCH ---------------- */
  const fetchEnrollments = async (status: EnrollmentFilter) => {
    setLoading(true);
    setError("");

    try {
      const endpoint =
        status === "ALL"
          ? ENROLLMENTS_API
          : `${ENROLLMENTS_API}/status/${status}`;

      const res = await axios.get<ApiResponse<Enrollment[]>>(endpoint, {
        headers: getAuthHeaders(),
      });

      setEnrollments(res.data.data || []);
    } catch (err) {
      setError(`Failed to load enrollments: ${getAxiosError(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchEnrollments(selectedStatus);
  }, [selectedStatus]);

  /* ---------------- APPROVE / REJECT ---------------- */

  const handleAction = async (id: number, action: "approve" | "reject") => {
    try {
      setError("");
      setProcessingId(id);

      await axios.put(
        `${ENROLLMENTS_API}/${id}/${action}`,
        {},
        {
          headers: getAuthHeaders(),
        },
      );

      await fetchEnrollments(selectedStatus);
    } catch (err) {
      setError(`Failed to ${action} enrollment: ${getAxiosError(err)}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteEnrollment = async (id: number) => {
    const ok = window.confirm(
      "Are you sure you want to delete this enrollment? This action cannot be undone.",
    );

    if (!ok) {
      return;
    }

    try {
      setError("");
      setDeletingId(id);

      await axios.delete(`${ADMIN_ENROLLMENTS_API}/${id}`, {
        headers: getAuthHeaders(),
      });

      await fetchEnrollments(selectedStatus);
    } catch (err) {
      setError(`Failed to delete enrollment: ${getAxiosError(err)}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleFetchByUserId = async () => {
    const parsedUserId = Number(userIdInput);

    if (
      !userIdInput.trim() ||
      Number.isNaN(parsedUserId) ||
      parsedUserId <= 0
    ) {
      setUserEnrollmentError("Please enter a valid User ID.");
      setUserEnrollments([]);
      setHasSearchedUserEnrollments(false);
      return;
    }

    try {
      setHasSearchedUserEnrollments(true);
      setLoadingUserEnrollments(true);
      setUserEnrollmentError("");

      const res = await axios.get<ApiResponse<UserEnrollment[]>>(
        `${ADMIN_ENROLLMENTS_API}/user/${parsedUserId}`,
        {
          headers: getAuthHeaders(),
        },
      );

      setUserEnrollments(res.data.data || []);
    } catch (err) {
      setUserEnrollments([]);
      setUserEnrollmentError(
        `Failed to fetch user enrollments: ${getAxiosError(err)}`,
      );
    } finally {
      setLoadingUserEnrollments(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Enrollments</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">
          {selectedStatus === "ALL"
            ? "All Enrollments"
            : `${selectedStatus} Enrollments`}{" "}
          ({enrollments.length})
        </h2>

        <div className="flex flex-wrap gap-2 mb-6">
          {(
            ["ALL", "PENDING", "APPROVED", "REJECTED"] as EnrollmentFilter[]
          ).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-md text-sm font-semibold border transition-colors ${
                selectedStatus === status
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="mb-8 p-4 border border-gray-300 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">Find by User ID</h3>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              min={1}
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              placeholder="Enter user ID"
              className="w-full sm:max-w-xs border border-gray-300 rounded-md px-3 py-2"
            />

            <button
              onClick={handleFetchByUserId}
              disabled={loadingUserEnrollments}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loadingUserEnrollments ? "Searching..." : "Search"}
            </button>
          </div>

          {userEnrollmentError && (
            <p className="mt-3 text-sm text-red-700">{userEnrollmentError}</p>
          )}

          {loadingUserEnrollments ? (
            <p className="mt-4 text-sm text-gray-600">
              Loading user enrollments...
            </p>
          ) : hasSearchedUserEnrollments && userEnrollments.length === 0 ? (
            !userEnrollmentError && (
              <p className="mt-4 text-sm text-gray-600">
                No enrollments found for this user.
              </p>
            )
          ) : (
            userEnrollments.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border border-gray-300 bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left px-3 py-2 border-b">ID</th>
                      <th className="text-left px-3 py-2 border-b">Course</th>
                      <th className="text-left px-3 py-2 border-b">
                        Completed
                      </th>
                      <th className="text-left px-3 py-2 border-b">
                        Enrolled At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userEnrollments.map((item) => (
                      <tr key={item.id} className="border-b border-gray-200">
                        <td className="px-3 py-2">{item.id}</td>
                        <td className="px-3 py-2">{item.courseName}</td>
                        <td className="px-3 py-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              item.completed
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.completed ? "YES" : "NO"}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          {new Date(item.enrolledAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading enrollments...</p>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-8 bg-gray-100 rounded-lg">
            <p className="text-gray-600">No enrollments yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((e) => (
              <div
                key={e.id}
                className="border-2 border-gray-300 p-6 rounded-lg bg-white shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{e.fullName}</h3>

                    <p className="text-sm text-gray-700">📞 {e.phoneNumber}</p>

                    <p className="text-sm text-gray-700">✉ {e.email}</p>

                    <p className="mt-2">
                      <span className="font-semibold">Course:</span> {e.course}
                    </p>

                    <p>
                      <span className="font-semibold">Education:</span>{" "}
                      {e.educationLevel}
                    </p>

                    <p>
                      <span className="font-semibold">Platform:</span>{" "}
                      {e.preferredLearningPlatform}
                    </p>

                    <p>
                      <span className="font-semibold">Has Laptop:</span>{" "}
                      {e.hasLaptop}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      Submitted: {new Date(e.submittedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    {(() => {
                      const isBusy =
                        processingId === e.id || deletingId === e.id;

                      return (
                        <>
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-semibold ${
                              e.status === "APPROVED"
                                ? "bg-green-100 text-green-700"
                                : e.status === "REJECTED"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {e.status}
                          </span>

                          {e.status === "PENDING" && (
                            <div className="flex gap-2 mt-4">
                              <button
                                disabled={isBusy}
                                onClick={() => handleAction(e.id, "approve")}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm disabled:bg-green-300"
                              >
                                {processingId === e.id
                                  ? "Processing..."
                                  : "Approve"}
                              </button>

                              <button
                                disabled={isBusy}
                                onClick={() => handleAction(e.id, "reject")}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm disabled:bg-red-300"
                              >
                                {processingId === e.id
                                  ? "Processing..."
                                  : "Reject"}
                              </button>
                            </div>
                          )}

                          <button
                            disabled={isBusy}
                            onClick={() => handleDeleteEnrollment(e.id)}
                            className="mt-3 w-full bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded text-sm disabled:bg-red-300"
                          >
                            {deletingId === e.id
                              ? "Deleting..."
                              : "Delete Enrollment"}
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
