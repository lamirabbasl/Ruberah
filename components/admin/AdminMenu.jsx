"use client";
import React, { useState, useEffect, useRef } from "react";
import { BiMenu } from "react-icons/bi";
import { useRouter, usePathname } from "next/navigation";
import { getUserMe, getProfilePhotoUrl } from "@/lib/api/api";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import MobileMenu from "@/components/admin/menu/MobileMenu";
import DesktopSidebar from "@/components/admin/menu/DesktopSidebar";

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

  // Default tabs to prevent invalid navigation
  const validTabs = [
    "firstPage",
    "courses",
    "reserve",
    "payments",
    "signup",
    "children",
    "users",
  ];

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Fetch user data and profile photo
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await getUserMe();
        setUser(data);
        if (data?.id) {
          try {
            const photoUrl = await getProfilePhotoUrl(data.id);
            setProfilePhotoUrl(photoUrl || "/user.png"); // Fallback to default image
          } catch (err) {
            setProfilePhotoUrl("/user.png");
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("خطا در دریافت اطلاعات کاربر");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();

    // Cleanup for blob URLs
    return () => {
      if (profilePhotoUrl && profilePhotoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(profilePhotoUrl);
      }
    };
  }, []);

  // Set active tab based on pathname
  useEffect(() => {
    const segments = pathname.split("/").filter((segment) => segment);
    const tab = segments[2]; // Expecting /admin/dashboard/[tab]
    if (segments[1] === "dashboard" && validTabs.includes(tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab(null); // No valid tab found
    }
  }, [pathname]);

  // Handle tab click with validation
  const handleTabClick = (tab) => {
    if (validTabs.includes(tab)) {
      setActiveTab(tab);
      router.push(`/admin/dashboard/${tab}`);
      setIsMenuOpen(false); // Close mobile menu on tab click
    } else {
      console.warn(`Invalid tab: ${tab}`);
    }
  };

  // Handle clicks outside mobile menu
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
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => router.push("/login")} // Redirect to login on error
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          ورود به سیستم
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Hamburger Menu Icon for Mobile */}
      <div className="md:hidden fixed top-4 right-4 z-20">
        <button
          onClick={() => setIsMenuOpen(true)} // Simplified toggle
          className="bg-gray-900/90 backdrop-blur-md text-white p-2 rounded-md shadow-md hover:bg-gray-800 transition-colors"
          aria-label="Open Menu"
        >
          <BiMenu className="text-2xl" />
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isMenuOpen={isMenuOpen}
        menuRef={menuRef}
        toggleMenu={() => setIsMenuOpen(false)} // Simplified toggle
        user={user}
        profilePhotoUrl={profilePhotoUrl}
        activeTab={activeTab}
        handleTabClick={handleTabClick}
        handleLogout={handleLogout}
      />

      {/* Desktop Sidebar */}
      <DesktopSidebar
        user={user}
        profilePhotoUrl={profilePhotoUrl}
        activeTab={activeTab}
        handleTabClick={handleTabClick}
        handleLogout={handleLogout}
      />
    </>
  );
}

export default AdminMenu;