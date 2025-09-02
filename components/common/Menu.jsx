"use client";

import React, { useState, useEffect } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import { FaPhoneFlip } from "react-icons/fa6";
import { PiSignInBold } from "react-icons/pi";
import { VscSignIn } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getProfilePhotoUrl, getUserMe } from "@/lib/api/api";

function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("/user.png");
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user?.id) {
        try {
          const imageBlob = await getProfilePhotoUrl(user.id); // returns Blob
          const imageUrl = URL.createObjectURL(imageBlob);
          setProfileImage(imageUrl);
        } catch (err) {
          console.error("Error fetching profile image:", err);
        }
      }
    };

    fetchProfileImage();
  }, [user?.id]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleScrollOrNavigate = (id) => {
    setIsOpen(false);
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${id}`);
    }
  };

  const handleProfileClick = async () => {
    setIsOpen(false);
    try {
      const userInfo = await getUserMe();
      if (userInfo.groups?.includes("manager")) {
        router.push("/admin/dashboard");
      } else {
        router.push("/profile");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      router.push("/profile");
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
        <div className="fixed top-0 left-0 w-1/2 h-[100%] bg-primary z-50 flex flex-col items-center justify-between pt-4 ">
          <div className="w-full flex justify-end pr-4">
            <button
              onClick={toggleMenu}
              className="text-white text-2xl focus:outline-none"
            >
              <IoClose />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center">
            {user && (
              <div
                onClick={handleProfileClick}
                className="flex items-center justify-end gap-2 mb-4 mr-4 cursor-pointer"
              >
                <img
                  src={profileImage}
                  alt="User Profile"
                  width={54}
                  height={54}
                  className="rounded-full object-cover"
                />
                <span className="text-white">{user.name}</span>
              </div>
            )}

            <div
              onClick={() => handleScrollOrNavigate("courses")}
              className="flex text-white items-center justify-end w-full cursor-pointer gap-2 py-4 transition hover:text-secondery"
            >
              <span>دوره ها</span>
              <IoMenu className="text-2xl" />
            </div>

            <Link href="/enroll" onClick={() => setIsOpen(false)}>
              <div className="flex text-white items-center cursor-pointer gap-2 py-4 transition hover:text-secondery">
                <span>فرآیند پیش ثبت نام</span>
                <VscSignIn className="text-2xl" />
              </div>
            </Link>

            <div
              onClick={() => handleScrollOrNavigate("contact")}
              className="flex text-white items-center cursor-pointer gap-2 py-4 transition hover:text-secondery"
            >
              <span>ارتباط با ما</span>
              <FaPhoneFlip className="text-md ml-2" />
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
