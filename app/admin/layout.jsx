"use client";

import AdminMenu from "@/components/admin/AdminMenu";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function RootLayout({ children }) {
  return (
    <div>
      <AdminNavbar />
      <AdminMenu />
      {children}
    </div>
  );
}
