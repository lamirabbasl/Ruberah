"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaRegCalendarCheck } from "react-icons/fa";
import { BiExit } from "react-icons/bi";
import { FaListUl } from "react-icons/fa";
import { VscSignIn } from "react-icons/vsc";
import { useRouter, usePathname } from "next/navigation";
import { getUserMe , getProfilePhotoUrl} from "@/lib/api/api";
import { useAuth } from "@/context/AuthContext";


function ProfileNavbar() {
  const {  logout } = useAuth();

  const [activeTab, setActiveTab] = useState(null);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserMe();
        setUser(data);
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const segments = pathname.split("/").filter((segment) => segment !== "");
    if (segments[1] === "profile") {
      setActiveTab(segments[2]);
    } else {
      setActiveTab(null);
    }
  }, [pathname]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    router.push(`/profile/${tab}`);
  };

  return (
    <div className=" max-md:hidden fixed right-0 flex text-lg font-noto text-white flex-col gap-6 justify-start items-end p-4 h-screen w-64 bg-gray-900 shadow-md z-10 transition-transform duration-300 ease-in-out">
      {/* Header Section */}
      <div className="flex justify-end items-center gap-4 pb-4 border-b border-gray-800 w-full">
        <div className="flex flex-col items-end">
          <p className="font-semibold">{user?.username || "کاربر"}</p>
          <p className="text-sm text-gray-400">{user?.phone_number || ""}</p>
        </div>
        <div className="relative  rounded-full overflow-hidden">
          <img
          className="w-14 h-14"
            src={ getProfilePhotoUrl(user?.id) || "/user.png"}
            alt="user avatar"

          />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-3 font-semibold items-end pr-2 w-full">
        <NavItem
          label="اطلاعات شخصی"
          icon={<FaListUl className="text-xl ml-2" />}
          onClick={() => handleTabClick("information")}
          isActive={activeTab === "informatin"}
        />
        <NavItem
          label="دوره های من"
          icon={<FaRegCalendarCheck className="text-xl ml-2" />}
          onClick={() => handleTabClick("courses")}
          isActive={activeTab === "crouses"}
        />
        <NavItem
          label="دوره ها"
          icon={<FaRegCalendarCheck className="text-xl ml-2" />}
          onClick={() => handleTabClick("allcourses")}
          isActive={activeTab === "allcrouses"}
        />
      </nav>

      {/* Logout Button */}
      <button className="absolute bottom-4 left-4 font-bold text-sm gap-1 items-center bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg flex text-white transition-colors duration-200" onClick={handleLogout}>
        <p>خارج شوید</p>
        <BiExit className="text-xl" />
      </button>
    </div>
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

export default ProfileNavbar;
