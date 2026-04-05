import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "TechShikshya | Courses",
};

const LayoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen bg-linear-to-b from-[#d9e8ff]/45 via-[#edf4ff]/30 to-[#dfeaff]/45">
      {children}
    </main>
  );
};

export default LayoutPage;
