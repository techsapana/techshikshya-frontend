"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { DOMAIN } from "@/src/env";

interface Payment {
  paymentId: number;
  userEmail: string;
  phoneNumber: string;
  courseName: string;
  screenshotUrl: string;
  status: string;
  createdAt: string;
}

const API_URL = `${DOMAIN}/api/admin/payments`;

function getAxiosError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const msg =
      err.response?.data?.message || err.response?.data?.error || err.message;
    return status ? `${msg} (HTTP ${status})` : msg;
  }
  return String(err);
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = Cookies.get("adminToken");

      const res = await axios.get(`${API_URL}/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPayments(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError(`Failed to load payments: ${getAxiosError(err)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const approvePayment = async (id: number) => {
    if (!confirm("Approve this payment and enroll the user?")) return;

    setProcessingId(id);
    setError("");
    setSuccess("");

    try {
      await axios.put(
        `${API_URL}/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("adminToken")}` } },
      );

      setSuccess("Payment approved successfully.");
      fetchPayments();
    } catch (err) {
      console.error(err);
      setError(`Failed to approve payment: ${getAxiosError(err)}`);
    } finally {
      setProcessingId(null);
    }
  };

  const rejectPayment = async (id: number) => {
    if (!confirm("Reject this payment?")) return;

    setProcessingId(id);
    setError("");
    setSuccess("");

    try {
      await axios.put(
        `${API_URL}/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("adminToken")}` } },
      );

      setSuccess("Payment rejected.");
      fetchPayments();
    } catch (err) {
      console.error(err);
      setError(`Failed to reject payment: ${getAxiosError(err)}`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Pending Payments</h1>

        <p className="text-sm text-gray-500 mb-8">
          Review uploaded payment screenshots and approve or reject them.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {success}
          </div>
        )}

        {loading ? (
          <p>Loading payments...</p>
        ) : payments.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-400">
            No pending payments.
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((p) => (
              <div
                key={p.paymentId}
                className="border rounded-xl p-4 bg-gray-50 flex gap-6 items-center"
              >
                {/* Screenshot */}
                <div className="relative w-36 h-24 rounded overflow-hidden border bg-gray-200 shrink-0">
                  <Image
                    src={p.screenshotUrl}
                    alt="Payment Screenshot"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                {/* Payment Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">{p.courseName}</p>

                  <p className="text-sm text-gray-600">{p.userEmail}</p>

                  <p className="text-sm text-gray-500">
                    Phone: {p.phoneNumber}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Submitted: {new Date(p.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  <button
                    disabled={processingId === p.paymentId}
                    onClick={() => approvePayment(p.paymentId)}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-semibold disabled:opacity-50"
                  >
                    <Check size={16} />
                    Approve
                  </button>

                  <button
                    disabled={processingId === p.paymentId}
                    onClick={() => rejectPayment(p.paymentId)}
                    className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-semibold disabled:opacity-50"
                  >
                    <X size={16} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
