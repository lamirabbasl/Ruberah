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
    return <LoadingSpinner />;
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

      {/* Mobile Menu */}
      <MobileMenu
        isMenuOpen={isMenuOpen}
        menuRef={menuRef}
        toggleMenu={toggleMenu}
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