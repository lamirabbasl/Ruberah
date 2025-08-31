import React from "react";
import { BiExit } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import UserHeader from "@/components/admin/menu/UserHeader";
import MenuButtons from "@/components/admin/menu/MenuButtons";
import NavItem from "@/components/admin/menu/NavItem";
import { IoIosHome } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { VscSignIn } from "react-icons/vsc";
import { MdOutlinePayment } from "react-icons/md";
import { FaChildren } from "react-icons/fa6";
import { FaRegCalendarCheck, FaListUl } from "react-icons/fa";

function MobileMenu({
  isMenuOpen,
  menuRef,
  toggleMenu,
  user,
  profilePhotoUrl,
  activeTab,
  handleTabClick,
  handleLogout,
}) {
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
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          ref={menuRef}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed top-0 right-0 h-full w-64 bg-gray-900 shadow-2xl z-30"
        >
          <div className="p-4">
            {/* Close Button */}
            <div className="flex justify-start mb-4">
              <button
                onClick={toggleMenu}
                className="bg-gray-800/90 text-white p-2 rounded-md shadow-md hover:bg-gray-700 transition-colors"
                aria-label="Close Menu"
              >
                <BiExit className="text-2xl" />
              </button>
            </div>

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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;