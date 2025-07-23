import React from "react";
import { IoHome } from "react-icons/io5";
import { BiExit } from "react-icons/bi";
import Link from "next/link";

function MenuButtons({ handleLogout }) {
  return (
    <>
      <Link href={"/"}>
        <button
          className="absolute bottom-4 right-2 font-bold text-sm gap-1 items-center bg-green-600 hover:bg-red-700 px-3 py-2 rounded-lg flex text-white transition-colors duration-200"
        >
          <p>صفحه اصلی</p>
          <IoHome className="text-xl text-white" />
        </button>
      </Link>
      <button
        onClick={handleLogout}
        className="absolute bottom-4 left-2 font-bold text-sm gap-1 items-center bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg flex text-white transition-colors duration-200"
      >
        <p>خارج شوید</p>
        <BiExit className="text-xl" />
      </button>
    </>
  );
}

export default MenuButtons;