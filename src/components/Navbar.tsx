"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";

type NavItem = {
  name: string;
  href: string;
  pillClass?: string;
};

const navItems: NavItem[] = [
  { name: "About", href: "/about" },
  { name: "All Courses", href: "/courses" },
  {
    name: "Upcoming Classes",
    href: "/upcoming-courses",
    pillClass:
      "rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white shadow-sm shadow-blue-300/60",
  },
  { name: "Testimonials", href: "/testimonials" },
  { name: "Mentors", href: "#team" },
  // { name: "Recorded Videos", href: "/recorded-videos" },
  { name: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const desktopMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !desktopMenuRef.current?.contains(event.target) &&
        !mobileMenuRef.current?.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "U";

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    setOpen(false);
    router.push("/");
  };

  const handleHashClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    hash: string,
  ) => {
    if (pathname !== "/") {
      event.preventDefault();
      router.push(`/${hash}`);
      setOpen(false);
      return;
    }

    const target = document.querySelector(hash);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", hash);
    setOpen(false);
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 z-50 w-full border-b border-blue-200/80 bg-[#edf4ff]/90 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src="/techshikshya.jpeg"
              alt="TechSikshya Logo"
              width={80}
              height={80}
              className="rounded-2xl"
            />
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => {
            const isHash = item.href.startsWith("#");
            const isPill = Boolean(item.pillClass);

            return (
              <motion.div
                key={item.name}
                whileHover="hover"
                className="relative"
              >
                <Link
                  href={item.href}
                  onClick={(event) =>
                    isHash ? handleHashClick(event, item.href) : setOpen(false)
                  }
                  className={
                    item.pillClass ||
                    "font-medium tracking-tight text-slate-800 transition-colors duration-200 hover:text-blue-700"
                  }
                >
                  {item.name}
                </Link>

                {!isPill && (
                  <motion.span
                    variants={{
                      hover: { width: "100%" },
                    }}
                    transition={{ duration: 0.25 }}
                    className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-600"
                  />
                )}
              </motion.div>
            );
          })}

          {!isLoading && isAuthenticated ? (
            <div className="relative ml-1" ref={desktopMenuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((current) => !current)}
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-2.5 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-blue-400"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-cyan-500 text-xs font-bold text-white">
                  {initials}
                </span>
                <span className="max-w-28 truncate">{user?.fullName}</span>
                <ChevronDown size={16} className="text-slate-500" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    <LayoutDashboard size={16} className="text-blue-600" />
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={() => void handleLogout()}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="ml-1">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="inline-flex rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Login
              </motion.div>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button and Login */}
        <div className="flex items-center gap-3 md:hidden">
          {!isLoading && isAuthenticated ? (
            <div className="relative" ref={mobileMenuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((current) => !current)}
                className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-white px-2 py-1.5 text-sm font-semibold text-slate-800"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-cyan-500 text-[10px] font-bold text-white">
                  {initials}
                </span>
                <ChevronDown size={14} className="text-slate-500" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    <LayoutDashboard size={16} className="text-blue-600" />
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleLogout()}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-rose-600"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <motion.div
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="inline-flex rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white"
              >
                Login
              </motion.div>
            </Link>
          )}

          <button onClick={() => setOpen(!open)} className="text-slate-700">
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="border-t border-blue-200 bg-[#edf4ff] md:hidden"
        >
          <div className="flex flex-col gap-4 px-6 py-4">
            {navItems.map((item) => {
              const isHash = item.href.startsWith("#");

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(event) =>
                    isHash ? handleHashClick(event, item.href) : setOpen(false)
                  }
                  className="font-medium text-slate-800"
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
