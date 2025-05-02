import Image from "next/image";
import Link from "next/link";
import React from "react";

function NotFound() {
  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center font-noto ">
      <Image
        className=""
        src={"/404.png"}
        width={300}
        height={300}
        alt="not found"
      />
      <p className="text-[#96fda9] text-[50px] mt-4">صفحه یافت نشد</p>
      <Link
        href={"/"}
        className="text-secondery font-bold border-2 border-secondery rounded-4xl px-4 py-2 text-2xl mt-4"
      >
        <span>بازگشت به صفحه اصلی</span>
      </Link>
    </div>
  );
}

export default NotFound;
