import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { AuthProvider } from "@/src/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "TechShikshya | Home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-linear-to-b from-[#d9e8ff] via-[#edf4ff] to-[#dfeaff] text-slate-900`}
      >
        <AuthProvider>
          <Navbar />
          <div className="min-h-screen bg-linear-to-b from-[#d9e8ff]/50 via-[#edf4ff]/30 to-[#dfeaff]/50">
            {children}
          </div>
          <Footer />
          <div className="fixed bottom-22 right-6 group">
            <div className="flex items-center gap-2">
              {/* Hover text */}
              <span
                className="
        opacity-0 group-hover:opacity-100
        translate-x-2 group-hover:translate-x-0
        transition-all duration-300
        bg-blue-900 text-white text-sm
        px-3 py-2 rounded-lg shadow
        whitespace-nowrap
        hidden sm:block
      "
              >
                Send us an email
              </span>

              {/* Email button */}
              <Link
                href="mailto:example@email.com"
                target="_blank"
                className="inline-flex rounded-full bg-blue-600 p-4 text-white shadow-lg hover:bg-blue-700"
              >
                <FaEnvelope size={28} />
              </Link>
            </div>
          </div>

          <div className="fixed bottom-4 right-6 group">
            <div className="flex items-center gap-2">
              <span
                className="
        opacity-0 group-hover:opacity-100
        translate-x-2 group-hover:translate-x-0
        transition-all duration-300
        bg-blue-900 text-white text-sm
        px-3 py-2 rounded-lg shadow
        whitespace-nowrap
        hidden sm:block
      "
              >
                Chat with us for students
              </span>

              <Link
                href="https://wa.me/9779849447862"
                target="_blank"
                className="inline-flex rounded-full bg-blue-600 p-4 text-white shadow-lg hover:bg-blue-700"
              >
                <FaWhatsapp size={28} />
              </Link>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
