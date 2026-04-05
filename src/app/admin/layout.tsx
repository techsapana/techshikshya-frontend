import "../../styles/globals.css";
import AdminNavbar from "../../components/AdminNavbar";

export const metadata = {
  title: "Admin Panel",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-white text-black`}>
        <AdminNavbar />
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
