"use client"

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { getIntroText } from "@/lib/api/api";

function Home() {
  const [introText, setIntroText] = useState([]);

  useEffect(() => {
    const fetchIntroText = async () => {
      try {
        const data = await getIntroText();
        setIntroText(data);
      } catch (error) {
        console.error("Error fetching intro text:", error);
      }
    };
    fetchIntroText();
  }, []);

  return (
    <div className="w-full h-8/10 pt-[140px] flex items-center justify-center font-noto max-md:pt-[240px] ">
      <div className="flex flex-col items-end gap-8 w-3/7 h-full border-2 border-white rounded-lg bg-gray-950 p-8 max-md:w-[95%] max-md:h-auto">
        <div>
          <span className="text-2xl">روند ثبت نام</span>
        </div>
        <div dir="rtl">
          <ul className="list-disc text-right gap-2 pr-6 space-y-4">
            {introText.length > 0 ? (
              introText.map((item) => (
                <li key={item.id}>{item.text}</li>
              ))
            ) : (
              <li>Loading...</li>
            )}
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