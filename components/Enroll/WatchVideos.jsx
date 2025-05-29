"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getIntroVideos } from "@/lib/api/api";

function WatchVideos() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [watched, setWatched] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const data = await getIntroVideos();
        setVideos(data);
        setWatched(Array(data.length).fill(false));
        setLoading(false);
      } catch (err) {
        setError("خطا در دریافت ویدیوها");
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  const handleVideoEnd = () => {
    const updated = [...watched];
    updated[currentIndex] = true;
    setWatched(updated);
  };

  const goToNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToRegister = () => {
    router.push("/enroll/quiz");
  };

  if (loading) {
    return (
      <div className="w-full h-screen pt-[140px] bg-primary text-white flex justify-center items-center font-noto">
        <div className="text-xl">در حال بارگذاری ویدیوها...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen pt-[140px] bg-primary text-white flex justify-center items-center font-noto">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="w-full h-screen pt-[140px] bg-primary text-white flex justify-center items-center font-noto">
        <div className="text-xl">هیچ ویدیویی موجود نیست</div>
      </div>
    );
  }

  const currentVideo = videos[currentIndex];
  const videoUrl = `${process.env.NEXT_PUBLIC_API_URL}${currentVideo.video}`;

  return (
    <div
      className="w-full h-screen pt-[140px] bg-primary text-white p-0 flex justify-center items-start font-noto"
      dir="rtl"
    >
      <div className="w-full max-w-4xl flex flex-col gap-8 items-center max-md:w-9/10">
        <h1 className="text-3xl font-bold text-center">ویدیوهای آموزشی</h1>

        <div className="w-full relative">
          <div className="mb-4 text-center text-xl">{currentVideo.title}</div>

          <video
            key={videoUrl}
            className="w-full h-[340px] rounded-lg"
            controls
            onEnded={handleVideoEnd}
          >
            <source src={videoUrl} type="video/mp4" />
            مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
          </video>

          {currentVideo.description && (
            <div className="mt-4 text-gray-300 text-center">
              {currentVideo.description}
            </div>
          )}

          <div className="flex justify-between mt-6 w-full">
            <button
              onClick={goToPrev}
              className="bg-gray-700 px-4 py-2 rounded-lg disabled:opacity-50 cursor-pointer"
              disabled={currentIndex === 0}
            >
              ویدیو قبلی
            </button>

            {currentIndex === videos.length - 1 && watched.every((w) => w) ? (
              <button
                onClick={goToRegister}
                className="bg-green-600 px-4 py-2 rounded-lg cursor-pointer"
              >
                ادامه روند ثبت نام
              </button>
            ) : (
              <div
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <button
                  onClick={goToNext}
                  className="bg-blue-600 px-4 py-2 rounded-lg disabled:opacity-50 cursor-pointer"
                  disabled={!watched[currentIndex]}
                >
                  ویدیو بعدی
                </button>

                {!watched[currentIndex] && isHovered && (
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white text-black w-full text-center p-2 rounded-md text-sm">
                    لطفا تا پایان ویدیو را تماشا کنید
                  </div>
                )}
              </div>
            )}
          </div>

          {currentIndex === videos.length - 1 && watched.every((w) => w) && (
            <div className="mt-6 text-green-400 text-center font-bold">
              🎉 همه ویدیوها با موفقیت تماشا شده‌اند!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WatchVideos;
