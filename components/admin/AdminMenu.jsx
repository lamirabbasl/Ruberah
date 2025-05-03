"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaRegCalendarCheck, FaListUl } from "react-icons/fa";
import { BiExit, BiMenu } from "react-icons/bi";
import { VscSignIn } from "react-icons/vsc";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function AdminMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef(null);

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
    setIsMenuOpen(false); // Close menu after item click on mobile
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
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
            }} // Changed duration here
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
              <div className="flex justify-end items-center gap-2 pb-4 border-b border-gray-800 w-full">
                <div className="flex flex-col items-end">
                  <p className="font-semibold">امیرعباس غلامی</p>
                  <p className="text-sm text-gray-400">ادمین</p>
                </div>
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={"/user.png"}
                    alt="user avatar"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-3 font-semibold items-end pr-2 w-full">
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
              </nav>

              {/* Logout Button */}
              <button
                onClick={() => {
                  // Handle logout logic here (e.g., clear session, redirect)
                  setIsMenuOpen(false); // Close menu after logout
                }}
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
      <aside className="max-md:hidden fixed right-0 flex text-lg font-noto text-white flex-col gap-6 justify-start items-end p-4 h-screen w-64 bg-gray-900 shadow-md z-10 transition-transform duration-300 ease-in-out">
        {/* Header Section */}
        <div className="flex justify-end items-center gap-2 pb-4 border-b border-gray-800 w-full">
          <div className="flex flex-col items-end">
            <p className="font-semibold">امیرعباس غلامی</p>
            <p className="text-sm text-gray-400">ادمین</p>
          </div>
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={"/user.png"}
              alt="user avatar"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-3 font-semibold items-end pr-2 w-full">
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
        </nav>

        {/* Logout Button */}
        <button
          onClick={() => {
            // Handle logout logic here (e.g., clear session, redirect)
          }}
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
      <p>{label}</p>
      {icon}
      {isActive && (
        <div className="absolute top-0 right-0 h-full w-1 bg-indigo-500 rounded-r-md shadow-md"></div>
      )}
    </div>
  );
}

export default AdminMenu;
