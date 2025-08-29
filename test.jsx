"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Assuming you have these icon components available locally or via a different setup
import { IoMenu } from "react-icons/io5";
import { FaPhoneFlip } from "react-icons/fa6";
import { PiSignInBold } from "react-icons/pi";
import { VscSignIn } from "react-icons/vsc";
import Menu from "./Menu"; // Assuming Menu is a local component

// --- Token Management Utilities (Self-Contained) ---
const getToken = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }
  }
  return null;
};

const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token"); // Also remove refresh token if it exists
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
};

// --- API Call Utility (Self-Contained) ---
const getUserMe = async () => {
  const token = getToken();
  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch("/api/proxy/users/me/", {
    headers: {
      Authorization: token,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  return response.json();
};

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Authentication Logic in a single useEffect hook ---
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await getUserMe();
        setUser(userData);
      } catch (error) {
        console.error("Authentication check failed:", error.message);
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const logout = () => {
    console.log("Logging out user");
    removeToken();
    setUser(null);
    // Optional: Redirect to home page or login page after logout
    router.push("/");
  };

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

  if (loading) {
    // Optionally return a simple loading state or null
    return (
      <nav className="fixed top-0 left-0 z-50 w-full h-20 bg-primary text-white font-noto shadow-lg flex items-center justify-between px-4 md:px-8 border-b border-gray-400">
        <span className="text-white">Loading...</span>
      </nav>
    );
  }

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
              onClick={() => {
                if (user.groups && user.groups.includes("manager")) {
                  router.push("/admin/dashboard");
                } else {
                  router.push("/profile");
                }
              }}
              variants={itemVariants}
              whileHover="hover"
            >
              <span className="text-white font-medium">{user.username}</span>
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
  "use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Local dummy icons to replace react-icons
import { IoMenu, IoClose } from "react-icons/io5";
import { FaPhoneFlip } from "react-icons/fa6";
import { PiSignInBold } from "react-icons/pi";
import { VscSignIn } from "react-icons/vsc";

// --- Self-Contained API and Token Management Utilities ---

// Function to get the authentication token from local storage
const getToken = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }
  }
  return null;
};

// Function to remove all authentication-related tokens
const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
};

// Function to fetch the current user's data from the backend
const getUserMe = async () => {
  const token = getToken();
  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch("/api/proxy/users/me/", {
    headers: {
      Authorization: token,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  return response.json();
};

// Mock function to simulate fetching a profile photo URL.
const getProfilePhotoUrl = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return `https://placehold.co/54x54/png?text=${userId.substring(0, 2)}`;
};

function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("/user.png");
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Effect to perform the initial authentication check and fetch user data
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await getUserMe();
        setUser(userData);
      } catch (error) {
        console.error("Authentication check failed:", error.message);
        removeToken();
        setUser(null);
      }
    };
    checkAuthStatus();
  }, []);

  // Effect to fetch the profile image when user data is available
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user?.id) {
        try {
          const imageUrl = await getProfilePhotoUrl(user.id);
          setProfileImage(imageUrl);
        } catch (err) {
          console.error("Error fetching profile image:", err);
          setProfileImage("/user.png");
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
      if (user.groups?.includes("manager")) {
        router.push("/admin/dashboard");
      } else {
        router.push("/profile");
      }
    } catch (error) {
      console.error("Error navigating to profile:", error);
      router.push("/profile");
    }
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
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
        <div className="fixed top-0 left-0 w-1/2 h-screen bg-primary z-50 flex flex-col items-center justify-between py-8">
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
              <div
                onClick={handleProfileClick}
                className="flex items-center justify-end gap-2 mb-4 mr-4 cursor-pointer"
              >
                <Image
                  src={profileImage}
                  alt="User Profile"
                  width={54}
                  height={54}
                  className="rounded-full object-cover"
                />
                <span className="text-white">{user.username}</span>
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
                <span>فرآیند ثبت نام</span>
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
