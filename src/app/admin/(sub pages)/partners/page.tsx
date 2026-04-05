"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DOMAIN } from "@/src/env";
import Image from "next/image";

interface Partner {
  id: number;
  imageUrl: string;
}

const API_URL = `${DOMAIN}/api/admin/partners`;

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Partner | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPartners = async () => {
    setLoading(true);
    setError("");
    try {
      const token = Cookies.get("adminToken");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPartners(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load partners");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setSubmitting(true);

      if (selected) {
        await axios.put(`${API_URL}/${selected.id}`, formData, {
          headers: {
            Authorization: `Bearer ${Cookies.get("adminToken")}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post(API_URL, formData, {
          headers: {
            Authorization: `Bearer ${Cookies.get("adminToken")}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      alert("Success!");
      setImage(null);
      setSelected(null);
      fetchPartners();
    } catch (err) {
      console.error(err);
      alert("Failed to save partner");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this partner?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${Cookies.get("adminToken")}` },
      });
      fetchPartners();
    } catch (err) {
      console.error(err);
      alert("Failed to delete partner");
    }
  };

  const handleEdit = (p: Partner) => {
    setSelected(p);
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Partner Management</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="border-2 border-gray-300 p-6 rounded-lg bg-white shadow-sm">
              <h2 className="text-2xl font-bold mb-4">
                {selected ? "Update Partner Logo" : "Add New Partner"}
              </h2>

              <input
                type="file"
                onChange={handleFileChange}
                className="border-2 border-gray-300 p-2 w-full rounded"
              />

              {image && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {image.name}
                </p>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold disabled:opacity-50"
                >
                  {submitting
                    ? selected
                      ? "Updating..."
                      : "Adding..."
                    : selected
                      ? "Update"
                      : "Add"}
                </button>

                {selected && (
                  <button
                    onClick={() => {
                      setSelected(null);
                      setImage(null);
                    }}
                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">
              Partners ({partners.length})
            </h2>

            {loading ? (
              <p>Loading partners...</p>
            ) : partners.length === 0 ? (
              <div className="text-center py-8 bg-gray-100 rounded-lg">
                No partners yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {partners.map((p) => (
                  <div
                    key={p.id}
                    className="border-2 border-gray-300 p-4 rounded-lg shadow-sm"
                  >
                    <Image
                      src={p.imageUrl}
                      alt="Partner"
                      height={40}
                      width={70}
                      className="w-full h-24 object-contain mb-3"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded font-semibold"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
