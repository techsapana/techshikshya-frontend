"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DOMAIN } from "@/src/env";

interface Category {
  id: number;
  name: string;
}

const API_URL = `${DOMAIN}/api/admin/categories`;

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  const fetchCategories = async () => {
    console.log("API_URL:", API_URL);
    setLoading(true);
    setError("");

    try {
      console.log("Fetching categories...");
      const token = Cookies.get("adminToken");
      console.log("Token:", token);

      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      console.log("Response data:", data);

      setCategories(data.data);
    } catch (err) {
      console.log("Error type:", err instanceof Error ? err.message : err);
      console.error(err);
      setError("Failed to load categories");
    }

    setLoading(false);
  };

  useEffect(() => {
    console.log("useEffect running, fetching categories...");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) return alert("Please enter category name");

    try {
      const token = Cookies.get("adminToken");
      if (selected) {
        await axios.put(
          `${API_URL}/${selected.id}`,
          { name },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else {
        await axios.post(
          API_URL,
          { name },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }
      alert("Success!");
      setName("");
      setSelected(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to save category");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const token = Cookies.get("adminToken");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to delete category");
    }
  };

  const handleEdit = (c: Category) => {
    setSelected(c);
    setName(c.name);
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-black">
          Category Management
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="border-2 border-gray-300 p-6 rounded-lg bg-white shadow-sm">
              <h2 className="cursor-pointer text-2xl font-bold mb-4 text-black">
                {selected ? "Edit Category" : "Add New Category"}
              </h2>

              <input
                type="text"
                value={name}
                placeholder="Category Name"
                onChange={(e) => setName(e.target.value)}
                className="border-2 border-gray-300 p-3 w-full mb-3 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />

              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
                >
                  {selected ? "Update Category" : "Create Category"}
                </button>
                {selected && (
                  <button
                    onClick={() => {
                      setSelected(null);
                      setName("");
                    }}
                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Categories List ({categories?.length})
            </h2>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading categories...</p>
              </div>
            ) : categories?.length === 0 ? (
              <div className="text-center py-8 bg-gray-100 rounded-lg">
                <p className="text-gray-600">
                  No categories yet. Create one to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {categories?.map((c) => (
                  <div
                    key={c.id}
                    className="border-2 border-gray-300 p-5 rounded-lg bg-white shadow-sm hover:shadow-md transition flex justify-between items-center"
                  >
                    <span className="text-black font-semibold">{c.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded font-semibold transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-semibold transition"
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
