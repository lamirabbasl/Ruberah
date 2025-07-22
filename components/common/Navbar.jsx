"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IoMenu } from "react-icons/io5";
import { FaPhoneFlip } from "react-icons/fa6";
import { PiSignInBold } from "react-icons/pi";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Menu from "./Menu";
import { useAuth } from "@/context/AuthContext";
import { getUserMe } from "@/lib/api/api";
import { VscSignIn } from "react-icons/vsc";


const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

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
    <motion.nav
      className="fixed top-0 left-0 z-50 w-full h-20 bg-primary text-white font-noto shadow-lg flex items-center justify-between px-4 md:px-8 border-b border-gray-400"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Left Section: Auth/User Info */}
      <motion.div
        className="flex items-center space-x-4 max-md:hidden"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        {!user ? (
          <Link href="/api/auth/login">
            <motion.div
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg py-2 px-4 text-white hover:bg-white/20 transition"
              variants={itemVariants}
              whileHover="hover"
            >
              <span>ورود/عضویت</span>
              <PiSignInBold className="text-xl" />
            </motion.div>
          </Link>
        ) : (
          <div className="flex items-center gap-4">
            <motion.div
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
                  router.push("/profile");
                }
              }}
              variants={itemVariants}
              whileHover="hover"
            >
              <span className="text-white font-medium">{user.name}</span>
            </motion.div>
            <motion.button
              onClick={logout}
              className="bg-red-500/20 backlight-blur-md rounded-lg py-2 px-4 text-red-400 hover:bg-red-500/30 transition"
              variants={itemVariants}
              whileHover="hover"
            >
              <span>خروج</span>
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Mobile Menu */}
      <motion.div
        className="md:hidden"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Menu />
      </motion.div>

      {/* Right Section: Navigation Links & Logo */}
      <motion.div
        className="flex items-center justify-center gap-6 md:gap-8"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-6 max-md:hidden">
          <motion.div
            onClick={() => handleScrollOrNavigate("contact")}
            className="flex items-center cursor-pointer gap-2 text-white hover:text-secondery transition"
            variants={itemVariants}
            whileHover="hover"
          >
            <span>ارتباط با ما</span>
            <FaPhoneFlip className="text-md" />
          </motion.div>
          <Link href={"/enroll"}>
          <motion.div
            className="flex items-center cursor-pointer gap-2 text-white hover:text-secondery transition"
            variants={itemVariants}
            whileHover="hover"
          >
            <span>فرآیند ثبت نام</span>
            <VscSignIn className="text-xl" />
          </motion.div>
          </Link>
          <motion.div
            onClick={() => handleScrollOrNavigate("courses")}
            className="flex items-center cursor-pointer gap-2 text-white hover:text-secondery transition"
            variants={itemVariants}
            whileHover="hover"
          >
            <span>دوره ها</span>
            <IoMenu className="text-xl" />
          </motion.div>
        </div>
        <Link href="/">
          <motion.div
            className="flex items-center gap-3 text-white text-xl cursor-pointer"
            variants={itemVariants}
            whileHover="hover"
          >
            <h1 className="flex gap-1 font-bold">
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
          </motion.div>
        </Link>
      </motion.div>
    </motion.nav>
  );
}