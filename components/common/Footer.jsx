import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneVolume } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";

function Footer() {
  return (
    <div className="flex flex-col font-mitra  lg:flex-row-reverse items-center lg:items-start justify-center lg:justify-between  pt-10 px-6 lg:pr-[200px] w-full bg-[#2A2B2D] text-white space-y-8 lg:space-y-0 h-auto lg:h-[350px]">
      {/* Right Side - Description and Location */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6 text-right select-none">
        <div className="flex items-center justify-end space-x-3 text-3xl">
          <p className="flex gap-2">
            <span className="text-secondery">روبه راه</span>
            <h1>خانواده</h1>
          </p>
          <img
            src="logo-white.png"
            alt="Logo"
            className="h-10 w-10 rounded-full"
          />
        </div>
        <div className="flex flex-col text-xl leading-relaxed">
          <span>به دنبال کشف گنجینه‌های معنوی موجود در فرهنگ</span>
          <span>سرزمین مادری‌مان ایران و بازآفرینی به زبان امروزی</span>
        </div>
        <div className="flex flex-row-reverse items-center gap-2 text-md  ">
          <FaLocationDot />
          <span>تهران , خیابان میرداماد , کوچه جنتی , پلاک 14</span>
        </div>
      </div>

      {/* Left Side - Contact Info */}
      <div className="w-full lg:w-1/2 flex flex-col items-end gap-4 text-md mb-4">
        <h1 className="text-2xl lg:text-2xl select-none">ارتباط با ما</h1>
        <div className="flex flex-row-reverse gap-3 items-center">
          <FaPhoneVolume className="text-xl" />
          <span>021-82300993</span>
        </div>
        <div className="flex flex-row-reverse gap-3 items-center">
          <MdOutlineEmail className="text-2xl" />
          <span>amirabbas.linux@gmail.com</span>
        </div>
        <div className="flex flex-row-reverse gap-3 items-center">
          <FaInstagram className="text-2xl" />
          <span>@Ruberah</span>
        </div>
        <div className="flex flex-row-reverse gap-3 items-center">
          <FaTelegramPlane className="text-2xl" />
          <span>@Ruberah</span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
