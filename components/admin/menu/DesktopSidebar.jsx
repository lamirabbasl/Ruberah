import React from "react";
import UserHeader from "@/components/admin/menu/UserHeader";
import MenuButtons from "@/components/admin/menu/MenuButtons";
import NavItem from "@/components/admin/menu/NavItem";
import { IoIosHome } from "react-icons/io";
import {  FaUser } from "react-icons/fa";
import { FaChildren } from "react-icons/fa6";
import { VscSignIn } from "react-icons/vsc";
import { MdOutlinePayment } from "react-icons/md";
import { FaRegCalendarCheck, FaListUl } from "react-icons/fa";

function DesktopSidebar({ user, profilePhotoUrl, activeTab, handleTabClick, handleLogout }) {
  return (
    <aside className="max-md:hidden fixed right-0 flex text-lg font-noto text-white flex-col gap-6 justify-start items-end p-4 h-screen w-1/6 bg-gray-900 shadow-md z-10 transition-transform duration-300 ease-in-out">
      {/* Header Section */}
      <UserHeader user={user} profilePhotoUrl={profilePhotoUrl} />

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
          label="پرداخت ها"
          icon={<MdOutlinePayment className="text-xl ml-2" />}
          onClick={() => handleTabClick("payments")}
          isActive={activeTab === "payments"}
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

      {/* Home and Logout Buttons */}
      <MenuButtons handleLogout={handleLogout} />
    </aside>
  );
}

export default DesktopSidebar;