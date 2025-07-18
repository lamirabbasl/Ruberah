"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaRegCalendarCheck, FaListUl } from "react-icons/fa";
import { BiExit, BiMenu } from "react-icons/bi";
import { VscSignIn } from "react-icons/vsc";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getUserMe, getProfilePhotoUrl } from "@/lib/api/api";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";
import { IoIosHome } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { FaChildren } from "react-icons/fa6";




function AdminMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [user, setUser] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef(null);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await getUserMe();
        setUser(data);
        if (data && data.id) {
          try {
            const photoUrl = await getProfilePhotoUrl(data.id);
            setProfilePhotoUrl(photoUrl);
          } catch (err) {
            console.error("Error fetching profile photo:", err);
            setProfilePhotoUrl("/user.png");
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
        setError("خطا در دریافت اطلاعات کاربر");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();

    return () => {
      if (profilePhotoUrl) {
        URL.revokeObjectURL(profilePhotoUrl);
      }
    };
  }, []);

  useEffect(() => {
    const segments = pathname.split("/").filter((segment) => segment !== "");
    if (segments[1] === "dashboard") {
      setActiveTab(segments[2]);
    } else {
      setActiveTab(null);
    }
  }, [pathname]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    router.push(`/admin/dashboard/${tab}`);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  if (loading) {
    return <LoadingSpinner/>
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  return (
    <>
      {/* Hamburger Menu Icon for Mobile */}
      <div className="md:hidden fixed top-4 right-4 z-20">
        <button
          onClick={toggleMenu}
          className="bg-gray-900/90 backdrop-blur-md text-white p-2 rounded-md shadow-md hover:bg-gray-800 transition-colors"
          aria-label="Open Menu"
        >
          <BiMenu className="text-2xl" />
        </button>
      </div>

      {/* Mobile Menu (Modal) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
              duration: 0.15,
            }}
            className="fixed top-0 right-0 h-full w-64 bg-gray-900 shadow-2xl z-30 transform transition-transform duration-300 ease-in-out"
          >
            <div className="p-4">
              {/* Close Button */}
              <div className="flex justify-start mb-4">
                <button
                  onClick={toggleMenu}
                  className="bg-gray-800/90 backdrop-blur-md text-white p-2 rounded-md shadow-md hover:bg-gray-700 transition-colors"
                  aria-label="Close Menu"
                >
                  <BiExit className="text-2xl" />
                </button>
              </div>

              {/* Header Section */}
              <div className="flex justify-end items-center gap-4 pb-4 border-b border-gray-800 w-full">
                <div className="flex flex-col items-end">
                  <p className="font-semibold text-white">{user?.username || "کاربر"}</p>
                  <p className="text-sm text-gray-400">{user?.phone_number || ""}</p>
                </div>
                <div className="relative rounded-full overflow-hidden">
                  <img
                    className="w-14 h-14 object-cover"
                    src={profilePhotoUrl || "/user.png"}
                    alt="user avatar"
                  />
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-3 font-semibold items-end pr-2 w-full">
              <NavItem
                  label="صفحه اصلی"
                  icon={<IoIosHome className="text-xl ml-2" />}
                  onClick={() => handleTabClick("firstPage")}
                  isActive={activeTab === "firstPage"}
                />
                <NavItem
                  label="دوره ها"
                  icon={<FaListUl className="text-xl ml-2" />}
                  onClick={() => handleTabClick("courses")}
                  isActive={activeTab === "courses"}
                />
                <NavItem
                  label="رزرو شده ها"
                  icon={<FaRegCalendarCheck className="text-xl ml-2" />}
                  onClick={() => handleTabClick("reserve")}
                  isActive={activeTab === "reserve"}
                />
                <NavItem
                  label="فرآیند ثبت نام"
                  icon={<VscSignIn className="text-xl ml-2" />}
                  onClick={() => handleTabClick("signup")}
                  isActive={activeTab === "signup"}
                />
                 <NavItem
            label="کودکان"
            icon={<FaChildren className="text-2xl ml-2" />}
            onClick={() => handleTabClick("children")}
            isActive={activeTab === "children"}
          />
                <NavItem
                  label="کاربران"
                  icon={<FaUser className="text-xl ml-2" />}
                  onClick={() => handleTabClick("users")}
                  isActive={activeTab === "users"}
                />
              </nav>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="absolute bottom-4 left-4 font-bold text-sm gap-1 items-center bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg flex text-white transition-colors duration-200"
              >
                <p>خارج شوید</p>
                <BiExit className="text-xl" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="max-md:hidden fixed right-0 flex text-lg font-noto text-white flex-col gap-6 justify-start items-end p-4 h-screen w-1/6 bg-gray-900 shadow-md z-10 transition-transform duration-300 ease-in-out">
        {/* Header Section */}
        <div className="flex justify-end items-center gap-4 pb-4 border-b border-gray-800 w-full">
          <div className="flex flex-col items-end">
            <p className="font-semibold">{user?.username || "کاربر"}</p>
            <p className="text-sm text-gray-400">{user?.phone_number || ""}</p>
          </div>
          <div className="relative rounded-full overflow-hidden">
            <img
              className="w-14 h-14 object-cover"
              src={profilePhotoUrl || "/user.png"}
              alt="user avatar"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-3 font-semibold items-end pr-2 w-full">
        <NavItem
                  label="صفحه اصلی"
                  icon={<IoIosHome className="text-xl ml-2" />}
                  onClick={() => handleTabClick("firstPage")}
                  isActive={activeTab === "firstPage"}
                />
          <NavItem
            label="دوره ها"
            icon={<FaListUl className="text-xl ml-2" />}
            onClick={() => handleTabClick("courses")}
            isActive={activeTab === "courses"}
          />
          <NavItem
            label="رزرو شده ها"
            icon={<FaRegCalendarCheck className="text-xl ml-2" />}
            onClick={() => handleTabClick("reserve")}
            isActive={activeTab === "reserve"}
          />
          <NavItem
            label="فرآیند ثبت نام"
            icon={<VscSignIn className="text-xl ml-2" />}
            onClick={() => handleTabClick("signup")}
            isActive={activeTab === "signup"}
          />
          <NavItem
            label="کودکان"
            icon={<FaChildren className="text-2xl ml-2" />}
            onClick={() => handleTabClick("children")}
            isActive={activeTab === "children"}
          />
          <NavItem
            label="کاربران"
            icon={<FaUser className="text-xl ml-2" />}
            onClick={() => handleTabClick("users")}
            isActive={activeTab === "users"}
          />
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute bottom-4 left-4 font-bold text-sm gap-1 items-center bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg flex text-white transition-colors duration-200"
        >
          <p>خارج شوید</p>
          <BiExit className="text-xl" />
        </button>
      </aside>
    </>
  );
}

function NavItem({ label, icon, onClick, isActive }) {
  return (
    <div
      className={`relative flex justify-end items-center gap-3 w-full cursor-pointer rounded-md transition-colors duration-200 ${
        isActive ? "bg-gray-800" : "hover:bg-gray-800/50"
      } p-2`}
      onClick={onClick}
    >
      <p className="text-white">{label}</p>
      {icon}
      {isActive && (
        <div className="absolute top-0 right-0 h-full w-1 bg-indigo-500 rounded-r-md shadow-md"></div>
      )}
    </div>
  );
}

export default AdminMenu;
