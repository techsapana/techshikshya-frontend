"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    return pathname === href;
  };

  const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/team", label: "Team", icon: "👥" },
    { href: "/admin/courses", label: "Courses", icon: "📚" },
    { href: "/admin/blogs", label: "Blogs", icon: "📝" },
    { href: "/", label: "Back to Site", icon: "🏠" },
  ];

  return (
    <nav className="bg-white border-b-2 border-gray-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-22">
          <Link href="/admin/dashboard">
            <div className="flex items-center gap-2 font-bold text-xl text-black hover:text-blue-600 transition">
              <span className="text-2xl">🎛️</span>
              <span>Admin Panel</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <button
                  className={`px-4 py-2 rounded font-semibold cursor-pointer transition flex items-center gap-2 ${
                    isActive(link.href)
                      ? "bg-blue-600 text-white"
                      : "text-black hover:bg-gray-200"
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </button>
              </Link>
            ))}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-black text-2xl"
          >
            ☰
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-4 py-2 rounded font-semibold transition text-left flex items-center gap-2 ${
                    isActive(link.href)
                      ? "bg-blue-600 text-white"
                      : "text-black hover:bg-gray-200"
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
