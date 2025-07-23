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
  return (
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;