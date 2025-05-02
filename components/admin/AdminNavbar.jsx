"use client";

import Link from "next/link";
import Image from "next/image";

export default function AdminNavbar() {
  return (
    <nav className="flex justify-between fixed top-0 z-50 bg-gray-50 items-center h-18  px-6 w-screen border-b border-gray-300 font-noto font-semibold text-gray-900">
      <div className="flex items-center space-x-4">
        <Link
          href="/login"
          className="flex border-2 rounded-lg py-2 px-3 border-secondery bg-white text-secondery cursor-pointer gap-1 transition hover:bg-secondery hover:text-white"
        >
          <span>خروج</span>
        </Link>
      </div>
      <Link href="/admin/dashboard">
        <div className="flex items-center space-x-3 text-white cursor-pointer text-xl">
          <span className="flex gap-1">
            <span className="text-secondery">روبه راه</span>
            <span className="text-black">مدیریت</span>
          </span>
          <Image
            width={40}
            height={40}
            src="/logo.png"
            alt="Logo"
            className="rounded-full"
          />
        </div>
      </Link>
    </nav>
  );
}
