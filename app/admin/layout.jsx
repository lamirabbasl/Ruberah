"use client";

import AdminMenu from "@/components/admin/AdminMenu";

export default function RootLayout({ children }) {
  return (
    <div className="w-screen h-screen">
      <AdminMenu />
      {children}
    </div>
  );
}
