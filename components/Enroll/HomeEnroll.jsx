import Link from "next/link";
import React from "react";

function Home() {
  return (
    <div className="w-full h-8/10 flex items-center justify-center font-noto max-md:mt-10">
      <div className="flex flex-col items-end gap-8 w-3/7 h-4/5 border-2 border-white rounded-lg bg-gray-950 p-8 max-md:w-[95%] max-md:h-auto">
        <div>
          <span className="text-2xl">روند ثبت نام</span>
        </div>
        <div dir="rtl">
          <ul className="list-disc text-right gap-2 pr-6 space-y-4">
            <li>
              برای بهبود و افزایش کارایی لطفا تمام ویدیو های نمایش داده شده را
              تا انتها تماشا کنید
            </li>
            <li>
              لطفا تمام سوالات نمایش داده شده را جواب داده سپس وارد روند ثبت نام
              شوید
            </li>
            <li>سپس وارد روند احراز هویت شده </li>
            <li>ابتدا توسط پیامک شماره تلفن شما تایید می شود</li>
            <li>
              پس از تایید شماره تماس شما می بایست در یک جلسه مصاحبه برای آشنایی
              و تکمیل اطلاعات شرکت فرمایید
            </li>
            <li>
              پس از تکمیل ثبت نام زمان های در درسترس برای شرکت در جلسه مصاحبه در
              اختیار شما قرار میگیرد
            </li>
          </ul>
        </div>
        <Link href={"/enroll/watch"}>
          <div className="self-start max-md:self-center mt-4 bg-secondery px-2 py-1 rounded-md font-bold hover:opacity-80 cursor-pointer text-center">
            ادامه ثبت نام
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Home;
