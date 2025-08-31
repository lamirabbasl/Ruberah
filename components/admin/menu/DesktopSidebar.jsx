import React from "react";
import UserHeader from "@/components/admin/menu/UserHeader";
import MenuButtons from "@/components/admin/menu/MenuButtons";
import NavItem from "@/components/admin/menu/NavItem";
import { IoIosHome } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { FaChildren } from "react-icons/fa6";
import { VscSignIn } from "react-icons/vsc";
import { MdOutlinePayment } from "react-icons/md";
import { FaRegCalendarCheck, FaListUl } from "react-icons/fa";

function DesktopSidebar({ user, profilePhotoUrl, activeTab, handleTabClick, handleLogout }) {
  // Define navigation items to reduce repetition
  const navItems = [
    { label: "صفحه اصلی", tab: "firstPage", icon: <IoIosHome className="text-xl ml-2" /> },
    { label: "دوره ها", tab: "courses", icon: <FaListUl className="text-xl ml-2" /> },
    { label: "رزرو شده ها", tab: "reserve", icon: <FaRegCalendarCheck className="text-xl ml-2" /> },
    { label: "پرداخت ها", tab: "payments", icon: <MdOutlinePayment className="text-xl ml-2" /> },
    { label: "فرآیند پیش ثبت نام", tab: "signup", icon: <VscSignIn className="text-xl ml-2" /> },
    { label: "کودکان", tab: "children", icon: <FaChildren className="text-2xl ml-2" /> },
    { label: "کاربران", tab: "users", icon: <FaUser className="text-xl ml-2" /> },
  ];

  return (
    <aside className="max-md:hidden fixed right-0 flex text-lg font-noto text-white flex-col gap-6 justify-start items-end p-4 h-screen w-1/6 bg-gray-900 shadow-md z-10">
      {/* Header Section */}
      <UserHeader user={user} profilePhotoUrl={profilePhotoUrl} />

      {/* Navigation Links */}
      <nav className="flex flex-col gap-3 font-semibold items-end pr-2 w-full">
        {navItems.map((item) => (
          <NavItem
            key={item.tab}
            label={item.label}
            icon={item.icon}
            onClick={() => handleTabClick(item.tab)}
            isActive={activeTab === item.tab}
          />
        ))}
      </nav>

      {/* Home and Logout Buttons */}
      <MenuButtons handleLogout={handleLogout} />
    </aside>
  );
}

export default DesktopSidebar;