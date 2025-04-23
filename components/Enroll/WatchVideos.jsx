'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const videos = [
  {
    id: 1,
    title: 'معرفی پلتفرم',
    url: 'https://www.w3schools.com/html/movie.mp4',
  },
  {
    id: 2,
    title: 'نحوه ثبت نام',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
]

function WatchVideos() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [watched, setWatched] = useState(Array(videos.length).fill(false))
  const [isHovered, setIsHovered] = useState(false)

  const handleVideoEnd = () => {
    const updated = [...watched]
    updated[currentIndex] = true
    setWatched(updated)
  }

  const goToNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToRegister = () => {
    router.push('/enroll/quiz') // change this to your actual route
  }

  return (
    <div className="w-full h-9/10  bg-gray-950 text-white p-0 flex justify-center items-start pt-10 font-noto" dir="rtl">
      <div className="w-full max-w-4xl flex flex-col gap-8 items-center max-md:w-9/10">
        <h1 className="text-3xl font-bold text-center">ویدیوهای آموزشی</h1>

        <div className="w-full relative">
          <div className="mb-4 text-center text-xl">{videos[currentIndex].title}</div>

          <video
            key={videos[currentIndex].url}
            className="w-full h-[340px] rounded-lg"
            controls
            onEnded={handleVideoEnd}
          >
            <source src={videos[currentIndex].url} type="video/mp4" />
            مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
          </video>

          <div className="flex justify-between mt-6 w-full">
            {/* Right-side: ویدیو قبلی */}
            <button
              onClick={goToPrev}
              className="bg-gray-700 px-4 py-2 rounded-lg disabled:opacity-50 cursor-pointer"
              disabled={currentIndex === 0}
            >
              ویدیو قبلی
            </button>

            {/* Left-side: ویدیو بعدی or ادامه روند ثبت نام */}
            {currentIndex === videos.length - 1 && watched.every(w => w) ? (
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

                {/* Dropdown message */}
                {!watched[currentIndex] && isHovered && (
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white text-black w-full text-center p-2 rounded-md text-sm">
                    لطفا تا پایان ویدیو را تماشا کنید
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Optional: Completion Message */}
          {currentIndex === videos.length - 1 && watched.every(w => w) && (
            <div className="mt-6 text-green-400 text-center font-bold">
              🎉 همه ویدیوها با موفقیت تماشا شده‌اند!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WatchVideos
