import React from 'react';
import { AiOutlineImport } from 'react-icons/ai';

function Hero() {
  return (
    <div className="relative flex flex-col w-screen  h-9/10 justify-between items-center bg-amber-50 p-4 overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover opacity-50 "
        width="1200" 
        height="720" 
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      {/* Overlay for better contrast */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-70 z-2"></div>

      {/* Text Div */}
      <div className="relative font-noto text-2xl rounded-full cursor-default p-2 bg-black max-md:rounded-[10px] bg-opacity-80 max-md:w-9/10  mt-20 w-1/3 text-white text-center max-md:text-md z-10">
        <span>
          به دنبال کشف گنجینه‌های معنوی موجود در فرهنگ سرزمین مادری‌مان ایران و بازآفرینی به زبان امروزی
        </span>
      </div>

      {/* Button */}
      <button className="relative flex items-center text-xl cursor-pointer mb-10 gap-1 bg-[#37B360] py-1 px-4 rounded-full z-10">
        <span className="font-noto font-bold">فرآیند ثبت نام</span>
        <AiOutlineImport className="text-xl"/>
      </button>
    </div>
  );
}

export default Hero;