import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "TechShikshya | Blogs",
};

const LayoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen bg-linear-to-b from-[#d9e8ff] via-[#edf4ff] to-[#dfeaff]">
      {children}
    </main>
  );
};

export default LayoutPage;
