"use client";

import { DOMAIN } from "@/src/env";
import { useState } from "react";
import Image from "next/image";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${DOMAIN}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        alert(result.message || "Login failed");
        return;
      }

      const token = result.data;
      const expires = new Date();
      expires.setDate(expires.getDate() + 1);

      const cookie = [
        `adminToken=${token}`,
        "path=/",
        `expires=${expires.toUTCString()}`,
        "SameSite=Lax",
      ].join("; ");

      document.cookie = cookie;

      window.location.href = "/admin/dashboard";
    } catch (error) {
      alert(
        "Something went wrong during login: " +
          (error instanceof Error ? error.message : String(error)),
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-b from-sky-100 via-white to-blue-100 px-4 pt-28 pb-14">
      <div className="pointer-events-none absolute -left-14 top-24 h-56 w-56 rounded-full bg-blue-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 bottom-16 h-64 w-64 rounded-full bg-cyan-300/35 blur-3xl" />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm space-y-4 rounded-3xl border border-blue-100 bg-white/90 p-7 shadow-[0_14px_40px_rgba(30,64,175,0.18)] backdrop-blur"
      >
        <div className="flex justify-center pb-1">
          <Image
            src="/techshikshya.jpeg"
            alt="TechSikshya Logo"
            width={64}
            height={64}
            className="rounded-2xl border border-blue-200"
          />
        </div>

        <h1 className="text-center text-3xl font-semibold text-blue-900">
          Admin Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-xl border border-blue-200 bg-blue-50/40 px-3 py-2 text-blue-950 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-blue-200 bg-blue-50/40 px-3 py-2 text-blue-950 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full cursor-pointer rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 py-2.5 text-white shadow-lg shadow-blue-300/40 transition hover:from-blue-700 hover:to-cyan-600 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
