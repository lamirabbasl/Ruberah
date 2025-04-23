import React from 'react';

import { IoMenu } from "react-icons/io5";
import { FaPhoneFlip } from "react-icons/fa6";
import { PiSignInBold } from "react-icons/pi";



function Navbar() {
  return (
    <nav className="flex  justify-between items-center  h-20 px-6 max-md:px-2 w-full border-b-[1px]  font-semibold  font-noto border-gray-400">
      <div className="flex items-center space-x-4 max-md:hidden">
      <div className="flex border-2 rounded-md py-1 px-2 border-secondery text-secondery cursor-pointer gap-1 transition hover:text-white hover:border-white">
        <span>ورود/عضویت</span>
        <PiSignInBold className='text-2xl' />
        </div>
        <div className="flex text-white items-center cursor-pointer gap-1 transition  hover:text-secondery">
        <span>ارتباط با ما</span>
        <FaPhoneFlip className='text-md' />
        </div>
        <div className="flex text-white items-center cursor-pointer gap-1 transition hover:text-secondery">
        <span>دوره ها</span>
        <IoMenu className='text-2xl' />
        </div>
      </div>
      <div className='md:hidden'>
      <IoMenu className='text-4xl text-white' />
        </div>

      <div className="flex items-center space-x-3 text-white cursor-pointer  text-xl">
         <span className='text-secondery '>روبه راه</span>
      <span className=" ">خانواده</span>
     
        <img
          src="vercel.svg"
          alt="Logo"
          className="h-10 w-10 rounded-full"
        />
       
      </div>
    </nav>
  );
}

export default Navbar;