"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DOMAIN } from "@/src/env";
import Image from "next/image";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  imageUrl: string;
}

const API_URL = `${DOMAIN}/api/admin/our-team`;

export default function AdminTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [form, setForm] = useState({
    name: "",
    role: "",
    description: "",
    image: null as File | null,
  });

  /* ---------------- FETCH ---------------- */
  const fetchMembers = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${Cookies.get("adminToken")}`,
        },
      });

      setMembers(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load team");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  /* ---------------- HANDLERS ---------------- */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm({ ...form, image: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return alert("Enter name");
    if (!form.role.trim()) return alert("Enter role");
    if (!form.description.trim()) return alert("Enter description");

    const formData = new FormData();

    formData.append(
      "team",
      JSON.stringify({
        name: form.name,
        role: form.role,
        description: form.description,
      }),
    );

    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      setSubmitting(true);

      if (selected) {
        await axios.put(`${API_URL}/${selected.id}`, formData, {
          headers: {
            Authorization: `Bearer ${Cookies.get("adminToken")}`,
          },
        });
      } else {
        await axios.post(API_URL, formData, {
          headers: {
            Authorization: `Bearer ${Cookies.get("adminToken")}`,
          },
        });
      }

      alert("Success!");

      resetForm();
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this member?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("adminToken")}`,
        },
      });

      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleEdit = (m: TeamMember) => {
    setSelected(m);

    setForm({
      name: m.name,
      role: m.role,
      description: m.description,
      image: null,
    });
  };

  const resetForm = () => {
    setSelected(null);
    setForm({
      name: "",
      role: "",
      description: "",
      image: null,
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Team Management</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* FORM */}
        <div className="border-2 border-gray-300 p-8 rounded-xl shadow mb-10">
          <h2 className="text-2xl font-bold mb-6">
            {selected ? "Edit Member" : "Add Member"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border-2 border-gray-300 p-4 rounded"
            />

            <input
              type="text"
              placeholder="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="border-2 border-gray-300 p-4 rounded"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mt-6">
            <label className="font-semibold block mb-2">
              Description (max 150 characters)
            </label>

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value.slice(0, 150),
                })
              }
              maxLength={150}
              rows={4}
              placeholder="Short description about the member..."
              className="border-2 border-gray-300 p-4 rounded w-full resize-none"
            />

            <p className="text-sm text-gray-500 mt-1">
              {form.description.length}/150 characters
            </p>
          </div>

          {/* IMAGE */}
          <div className="mt-6">
            <label className="font-semibold block mb-2">Profile Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border p-3 rounded w-full"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`px-6 py-3 rounded font-semibold text-white 
    ${
      submitting
        ? "bg-blue-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
    }
  `}
            >
              {submitting
                ? selected
                  ? "Updating..."
                  : "Creating..."
                : selected
                  ? "Update"
                  : "Create"}
            </button>

            {selected && (
              <button
                onClick={resetForm}
                className="bg-gray-400 text-white px-6 py-3 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* LIST */}
        <h2 className="text-2xl font-bold mb-6">
          Team Members ({members.length})
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : members.length === 0 ? (
          <div className="bg-gray-100 p-10 rounded text-center">
            No members yet
          </div>
        ) : (
          <div className="space-y-5">
            {members.map((m) => (
              <div key={m.id} className="border-2 p-6 rounded-xl shadow">
                <h3 className="font-bold text-xl">{m.name}</h3>
                <p className="text-gray-600">{m.role}</p>

                {m.imageUrl && (
                  <Image
                    src={m.imageUrl}
                    alt={m.name}
                    width={100}
                    height={100}
                    className="w-32 mt-3 rounded"
                  />
                )}

                <p className="mt-3 text-gray-700">{m.description}</p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(m)}
                    className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer px-4 py-2 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(m.id)}
                    className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-4 py-2 rounded"
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
  );
}
