"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

function Error() {
  const router = useRouter();

  function resetPage() {
    router.refresh();
  }

  return (
    <div className="flex justify-center items-center w-screen h-screen text-white font-noto text-[50px] max-lg:w-screen max-lg:text-[40px]">
      <div className="relative flex flex-col items-center justify-center gap-5">
        <p className="cursor-default">مشکلی رخداده است</p>
        <Link
          href={"/"}
          className="text-secondery font-bold border-2 border-secondery rounded-4xl px-4 py-2 text-2xl mt-4"
        >
          <span>بازگشت به صفحه اصلی</span>
        </Link>
        <p
          className="text-lg text-white font-bold px-4 py-2 cursor-pointer rounded-4xl bg-secondery"
          onClick={resetPage}
        >
          تلاش دوباره
        </p>
      </div>
    </div>
  );
}

export default Error;
