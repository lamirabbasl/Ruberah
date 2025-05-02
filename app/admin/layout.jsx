import AdminNavbar from "@/components/admin/AdminNavbar";

export default function RootLayout({ children }) {
  return (
    <div>
      <AdminNavbar />
      {children}
    </div>
  );
}
