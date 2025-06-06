"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IoMenu } from "react-icons/io5";
import { FaPhoneFlip } from "react-icons/fa6";
import { PiSignInBold } from "react-icons/pi";
import Image from "next/image";
import Link from "next/link";
import Menu from "./Menu";
import { useAuth } from "@/context/AuthContext";
import { getUserMe } from "@/lib/api/api";

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  const handleScrollOrNavigate = (id) => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`/#${id}`);
    }
  };

  return (
    <nav className="flex justify-between fixed z-99 bg-primary items-center h-20 px-6 max-md:px-2 w-full border-b font-semibold font-noto border-gray-400">
      <div className="flex items-center space-x-4 max-md:hidden">
        {!user ? (
          <Link href={"/api/auth/login"}>
            <div className="flex border-2 rounded-md py-1 px-2 border-secondery text-secondery cursor-pointer gap-1 transition hover:text-white hover:border-white">
              <span>ورود/عضویت</span>
              <PiSignInBold className="text-2xl" />
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={async () => {
                try {
                  const userInfo = await getUserMe();
                  if (userInfo.groups && userInfo.groups.includes("manager")) {
                    router.push("/admin/dashboard");
                  } else {
                    router.push("/profile");
                  }
                } catch (error) {
                  console.error("Error fetching user info:", error);
                  // fallback redirect or show error
                  router.push("/profile");
                }
              }}
            >
              <Image
                src="/user.png"
                alt="User Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-white">{user.name}</span>
            </div>
            <button
              onClick={logout}
              className="flex border-2 rounded-md py-1 px-2 border-red-500 text-red-500 cursor-pointer gap-1 transition hover:text-white hover:border-white"
            >
              <span>خروج</span>
            </button>
          </div>
        )}
      </div>
      <div className="md:hidden">
        <Menu />
      </div>
      <div className="flex items-center justify-center gap-8">
        <div className="flex items-center justify-center gap-6  max-md:hidden">
          <div
            onClick={() => handleScrollOrNavigate("contact")}
            className="flex text-white items-center cursor-pointer gap-2 transition hover:text-secondery"
          >
            <span>ارتباط با ما</span>
            <FaPhoneFlip className="text-md" />
          </div>
          <div
            onClick={() => handleScrollOrNavigate("courses")}
            className="flex text-white items-center cursor-pointer gap-1 transition hover:text-secondery"
          >
            <span>دوره ها</span>
            <IoMenu className="text-2xl" />
          </div>
        </div>
        <Link href="/">
          <div className="flex items-center self-center space-x-3 text-white cursor-pointer text-xl">
            <h1 className="flex gap-1">
              <span className="text-secondery">روبه راه</span>
              <span>خانواده</span>
              </h1> 
            <Image
              width={40}
              height={40}
              src="/logo-white.png"
              alt="Logo"
              className="rounded-full"
            />
          </div>
        </Link>
      </div>
    </nav>
  );
}
