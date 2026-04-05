"use client";

import { FaGoogle } from "react-icons/fa";
import Image from "next/image";
import { DOMAIN } from "@/src/env";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const googleOAuthUrl = `${DOMAIN}/api/auth/google`;

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-b from-sky-100 via-white to-blue-100 px-4 pt-28 pb-14">
      <div className="pointer-events-none absolute -left-14 top-24 h-56 w-56 rounded-full bg-blue-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 bottom-16 h-64 w-64 rounded-full bg-cyan-300/35 blur-3xl" />

      <div className="relative mx-auto w-full max-w-lg">
        <div className="rounded-3xl border border-blue-100 bg-white/90 p-7 shadow-[0_14px_40px_rgba(30,64,175,0.18)] backdrop-blur md:p-9">
          <div className="space-y-7">
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <Image
                  src="/techshikshya.jpeg"
                  alt="TechSikshya Logo"
                  width={72}
                  height={72}
                  className="rounded-2xl border border-blue-200"
                />
              </div>
              <h1 className="text-4xl font-bold text-blue-900 md:text-5xl">
                Sign In
              </h1>
              <p className="text-sm text-blue-700/85">
                Continue with Google to access your TechSikshya account.
              </p>
            </div>

            <a
              href={googleOAuthUrl}
              className="group inline-flex w-full items-center justify-center gap-3 rounded-xl border border-blue-300 bg-white px-4 py-3 font-semibold text-slate-800 shadow-sm transition duration-200 hover:border-blue-500 hover:shadow-md"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-[#DB4437]">
                <FaGoogle />
              </span>
              <span>Continue with Google</span>
            </a>

            <p className="text-center text-xs text-slate-500">
              You will be redirected to Google to authorize your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
