'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; // for App Router
import { IoMenu } from "react-icons/io5";
import { FaPhoneFlip } from "react-icons/fa6";
import { PiSignInBold } from "react-icons/pi";
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();

  const handleScrollOrNavigate = (id) => {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(`/#${id}`);
    }
  };

  return (
    <nav className="flex justify-between items-center h-20 px-6 max-md:px-2 w-full border-b font-semibold font-noto border-gray-400">
      <div className="flex items-center space-x-4 max-md:hidden">
        <div className="flex border-2 rounded-md py-1 px-2 border-secondery text-secondery cursor-pointer gap-1 transition hover:text-white hover:border-white">
          <span>ورود/عضویت</span>
          <PiSignInBold className="text-2xl" />
        </div>
        <div
          onClick={() => handleScrollOrNavigate('contact')}
          className="flex text-white items-center cursor-pointer gap-1 transition hover:text-secondery"
        >
          <span>ارتباط با ما</span>
          <FaPhoneFlip className="text-md" />
        </div>
        <div
          onClick={() => handleScrollOrNavigate('courses')}
          className="flex text-white items-center cursor-pointer gap-1 transition hover:text-secondery"
        >
          <span>دوره ها</span>
          <IoMenu className="text-2xl" />
        </div>
      </div>

      <div className="md:hidden">
        <IoMenu className="text-4xl text-white" />
      </div>

      <Link href="/">
        <div className="flex items-center space-x-3 text-white cursor-pointer text-xl">
          <span className="text-secondery">روبه راه</span>
          <span>خانواده</span>
          <Image width={40} height={40} src="/logo.png" alt="Logo" className="rounded-full" />
        </div>
      </Link>
    </nav>
  );
}
