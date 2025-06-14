"use client";

import React, { useState } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import { FaPhoneFlip } from "react-icons/fa6";
import { PiSignInBold } from "react-icons/pi";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleScrollOrNavigate = (id) => {
    setIsOpen(false);
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`/#${id}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/");
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="text-white text-2xl focus:outline-none z-50"
      >
        <IoMenu className="text-3xl" />
      </button>

      {isOpen && (
        <div className="fixed top-0 left-0 w-1/2 h-screen bg-primary z-50 flex flex-col items-center justify-between py-4">
          <div className="w-full flex justify-end pr-4">
            <button
              onClick={toggleMenu}
              className="text-white absolute text-2xl focus:outline-none"
            >
              <IoClose />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center">
            {user && (
              <div className="flex flex-col items-center gap-2 mb-6">
                <Image
                  src="/user.png"
                  alt="User Profile"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <span className="text-white">{user.name}</span>
              </div>
            )}
            <div
              onClick={() => handleScrollOrNavigate("courses")}
              className="flex text-white items-center cursor-pointer gap-2 py-4 transition hover:text-secondery"
            >
              <span>دوره ها</span>
              <IoMenu className="text-2xl" />
            </div>
            <div
              onClick={() => handleScrollOrNavigate("contact")}
              className="flex text-white items-center cursor-pointer gap-2 py-4 transition hover:text-secondery"
            >
              <span>ارتباط با ما</span>
              <FaPhoneFlip className="text-md" />
            </div>
          </div>
          {!user ? (
            <Link href="/api/auth/login" onClick={() => setIsOpen(false)}>
              <div className="flex border-2 rounded-md py-2 px-4 border-secondery text-secondery cursor-pointer gap-2 transition hover:text-white hover:border-white mb-4">
                <span>ورود/عضویت</span>
                <PiSignInBold className="text-2xl" />
              </div>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="flex border-2 rounded-md py-2 px-4 border-red-500 text-red-500 cursor-pointer gap-2 transition hover:text-white hover:border-white mb-4"
            >
              <span>خروج</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Menu;
