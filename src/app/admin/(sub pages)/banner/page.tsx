"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { DOMAIN } from "@/src/env";

interface Banner {
  id: number;
  imageUrl: string;
}

const API_URL = `${DOMAIN}/api/admin/banner`;

function getAxiosError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const msg =
      err.response?.data?.message || err.response?.data?.error || err.message;
    return status ? `${msg} (HTTP ${status})` : msg;
  }
  return String(err);
}

export default function AdminBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formImageUrl, setFormImageUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [previewIdx, setPreviewIdx] = useState(0);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = Cookies.get("adminToken");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = res.data.data;
      if (Array.isArray(raw)) {
        setBanners(raw as Banner[]);
      } else if (raw && typeof raw === "object" && "id" in raw) {
        setBanners([raw as Banner]);
      } else {
        setBanners([]);
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to load banners: ${getAxiosError(err)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Keep preview index in range when banners change
  useEffect(() => {
    if (previewIdx >= banners.length && banners.length > 0) {
      setPreviewIdx(banners.length - 1);
    }
  }, [banners, previewIdx]);

  const handleAdd = async () => {
    if (!formImageUrl.trim()) {
      setError("Please enter an image URL");
      return;
    }
    setError("");
    setSuccess("");
    try {
      setSubmitting(true);
      await axios.post(
        API_URL,
        { imageUrl: formImageUrl },
        { headers: { Authorization: `Bearer ${Cookies.get("adminToken")}` } },
      );
      setSuccess("Banner added successfully!");
      setFormImageUrl("");
      setShowAddForm(false);
      await fetchBanners();
    } catch (err) {
      console.error(err);
      setError(`Failed to add banner: ${getAxiosError(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingBanner || !formImageUrl.trim()) {
      setError("Please enter an image URL");
      return;
    }
    setError("");
    setSuccess("");
    try {
      setSubmitting(true);
      await axios.put(
        `${API_URL}/${editingBanner.id}`,
        { imageUrl: formImageUrl },
        { headers: { Authorization: `Bearer ${Cookies.get("adminToken")}` } },
      );
      setSuccess("Banner updated successfully!");
      setFormImageUrl("");
      setEditingBanner(null);
      await fetchBanners();
    } catch (err) {
      console.error(err);
      setError(`Failed to update banner: ${getAxiosError(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (banner: Banner) => {
    if (!confirm(`Delete banner #${banner.id}?`)) return;
    setError("");
    setSuccess("");
    try {
      await axios.delete(`${API_URL}/${banner.id}`, {
        headers: { Authorization: `Bearer ${Cookies.get("adminToken")}` },
      });
      setSuccess("Banner deleted.");
      await fetchBanners();
    } catch (err) {
      console.error(err);
      setError(`Failed to delete banner: ${getAxiosError(err)}`);
    }
  };

  const openEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormImageUrl(banner.imageUrl);
    setShowAddForm(false);
    setError("");
    setSuccess("");
  };

  const cancelForm = () => {
    setEditingBanner(null);
    setShowAddForm(false);
    setFormImageUrl("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Banner Management</h1>
        <p className="text-sm text-gray-500 mb-8">
          Manage multiple hero section banners. They cycle automatically as a
          carousel on the homepage.
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

        {/* Carousel Preview */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-2">Homepage Hero Preview</h2>
          <div className="relative w-full h-56 rounded-xl overflow-hidden border-2 border-gray-200 bg-linear-to-b from-[#d4e4ff] via-[#e4eeff] to-[#d8e6ff]">
            {banners[previewIdx] && (
              <Image
                key={banners[previewIdx].id}
                src={banners[previewIdx].imageUrl}
                alt="Hero background preview"
                fill
                unoptimized
                className="object-cover transition-opacity duration-500"
              />
            )}
            <div className="absolute inset-0 bg-linear-to-b from-[#d4e4ff]/80 via-[#e4eeff]/70 to-[#d8e6ff]/85" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/80 rounded-2xl px-8 py-5 text-center shadow-md max-w-xs mx-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-blue-800">
                  New Cohort Open
                </span>
                <p className="mt-1 text-lg font-bold text-slate-900 leading-tight">
                  Learn Inside a Real IT Company itself.
                </p>
              </div>
            </div>
            {/* Prev / Next */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setPreviewIdx((i) => (i === 0 ? banners.length - 1 : i - 1))
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 z-10"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() =>
                    setPreviewIdx((i) => (i === banners.length - 1 ? 0 : i + 1))
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 z-10"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
            {/* Dots */}
            {banners.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {banners.map((b, i) => (
                  <button
                    key={b.id}
                    onClick={() => setPreviewIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === previewIdx ? "bg-white scale-125" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
            {banners.length === 0 && (
              <div className="absolute inset-0 flex items-end justify-center pb-3">
                <span className="text-xs text-gray-400">
                  No banners yet — gradient background will be shown
                </span>
              </div>
            )}
          </div>
          {banners.length > 1 && (
            <p className="text-xs text-gray-500 mt-1 text-center">
              Showing banner {previewIdx + 1} of {banners.length} — click a
              banner in the list below to preview it
            </p>
          )}
        </div>

        {/* Add / Edit form */}
        {(showAddForm || editingBanner) && (
          <div className="border-2 border-blue-300 p-6 rounded-lg bg-blue-50 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold">
                {editingBanner
                  ? `Edit Banner #${editingBanner.id}`
                  : "Add New Banner"}
              </h2>
              <button
                onClick={cancelForm}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Must be a <strong>direct image URL</strong> ending in{" "}
              <code>.jpg</code>, <code>.png</code>, or <code>.webp</code>.
              Shortlinks won&apos;t work — right-click the image and copy the
              image address instead.
            </p>
            {/* Inline preview */}
            {formImageUrl && (
              <div className="relative w-full h-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 mb-4">
                <Image
                  src={formImageUrl}
                  alt="Preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            )}
            <input
              type="text"
              value={formImageUrl}
              onChange={(e) => {
                setFormImageUrl(e.target.value);
                setError("");
              }}
              placeholder="https://i.pinimg.com/originals/xx/xx/xx/image.jpg"
              className="border-2 border-gray-300 p-2 w-full rounded mb-4 font-mono text-sm focus:outline-none focus:border-blue-400"
            />
            <div className="flex gap-3">
              <button
                onClick={editingBanner ? handleUpdate : handleAdd}
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold disabled:opacity-50"
              >
                {submitting
                  ? "Saving..."
                  : editingBanner
                    ? "Update"
                    : "Add Banner"}
              </button>
              <button
                onClick={cancelForm}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Banners list */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                All Banners{" "}
                <span className="text-base font-normal text-gray-500">
                  ({banners.length})
                </span>
              </h2>
              {!showAddForm && !editingBanner && (
                <button
                  onClick={() => {
                    setShowAddForm(true);
                    setEditingBanner(null);
                    setFormImageUrl("");
                    setError("");
                    setSuccess("");
                  }}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold text-sm"
                >
                  <Plus size={16} />
                  Add Banner
                </button>
              )}
            </div>

            {banners.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-400">
                No banners yet. Click &quot;Add Banner&quot; to create one.
              </div>
            ) : (
              <div className="space-y-3">
                {banners.map((b, idx) => (
                  <div
                    key={b.id}
                    className={`border-2 rounded-lg p-4 flex items-center gap-4 cursor-pointer transition ${
                      previewIdx === idx
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-200 bg-gray-50 hover:border-blue-200"
                    }`}
                    onClick={() => setPreviewIdx(idx)}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-24 h-14 rounded shrink-0 overflow-hidden border border-gray-200 bg-gray-200">
                      <Image
                        src={b.imageUrl}
                        alt={`Banner ${b.id}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-0.5">
                        Banner #{b.id}
                      </p>
                      <p className="font-mono text-sm text-gray-700 truncate">
                        {b.imageUrl}
                      </p>
                    </div>
                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(b);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded font-semibold text-sm"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(b);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded font-semibold text-sm"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
