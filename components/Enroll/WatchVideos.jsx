"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getIntroVideos } from "@/lib/api/api";
import LoadingSpinner from "../common/LoadingSpinner";

// Animation variants for the container
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 },
  },
};

// Animation variants for child elements
const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

// Animation variants for buttons
const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

// Animation variants for tooltip
const tooltipVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

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
      <div className="w-full min-h-screen pt-[160px] bg-primary text-white flex justify-center items-center font-noto max-md:pt-[280px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen pt-[160px] bg-primary text-white flex justify-center items-center font-noto max-md:pt-[280px]">
        <div className="text-xl text-red-400 bg-white/10 backdrop-blur-md rounded-lg p-4">{error}</div>
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="w-full min-h-screen  bg-primary text-white flex justify-center items-center font-noto max-md:pt-[280px]">
        <div className="text-xl bg-white/10 backdrop-blur-md rounded-lg p-4">هیچ ویدیویی موجود نیست</div>
      </div>
    );
  }

  const currentVideo = videos[currentIndex];
  const videoUrl = `${process.env.NEXT_PUBLIC_API_URL}${currentVideo.video}`;

  return (
    <div
      className="w-full min-h-screen pt-20 max-md:pt-0  bg-primary text-white flex justify-center items-center font-mitra px-4 relative "
      dir="rtl"
    >
      <motion.div
        className="w-full max-w-4xl flex flex-col gap-6 items-center max-md:w-[95%] bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-center text-white"
          variants={itemVariants}
        >
          ویدیوهای آموزشی
        </motion.h1>

        <motion.div className="w-full" variants={itemVariants}>
          <div className="mb-3 text-center text-lg md:text-xl text-white/90">
            {currentVideo.title}
          </div>

          <AnimatePresence mode="wait">
            <motion.video
              key={videoUrl}
              className="w-full h-[240px] md:h-[360px] rounded-lg shadow-lg object-cover"
              controls
              onEnded={handleVideoEnd}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <source src={videoUrl} type="video/mp4" />
              مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
            </motion.video>
          </AnimatePresence>

          {currentVideo.description && (
            <motion.div
              className="mt-3 text-white/80 text-center text-sm md:text-base"
              variants={itemVariants}
            >
              {currentVideo.description}
            </motion.div>
          )}

          <motion.div className="flex justify-between mt-4 w-full" variants={itemVariants}>
            <motion.button
              onClick={goToPrev}
              className="bg-gray-700/50 backdrop-blur-md px-4 py-2 rounded-lg text-white hover:bg-gray-600/70 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentIndex === 0}
              variants={buttonVariants}
              whileHover="hover"
            >
              ویدیو قبلی
            </motion.button>

            {currentIndex === videos.length - 1 && watched.every((w) => w) ? (
              <motion.button
                onClick={goToRegister}
                className="bg-green-500/80 backdrop-blur-md px-4 py-2 rounded-lg text-white hover:bg-green-600/90 transition"
                variants={buttonVariants}
                whileHover="hover"
              >
                ادامه روند ثبت نام
              </motion.button>
            ) : (
              <div
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <motion.button
                  onClick={goToNext}
                  className="bg-secondery/80 backdrop-blur-md px-4 py-2 rounded-lg text-white hover:bg-secondery/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!watched[currentIndex]}
                  variants={buttonVariants}
                  whileHover="hover"
                >
                  ویدیو بعدی
                </motion.button>

                <AnimatePresence>
                  {!watched[currentIndex] && isHovered && (
                    <motion.div
                      className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white text-black w-48 text-center p-2 rounded-md text-sm shadow-lg"
                      variants={tooltipVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      لطفا تا پایان ویدیو را تماشا کنید
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {currentIndex === videos.length - 1 && watched.every((w) => w) && (
            <motion.div
              className="mt-4 text-green-400 text-center font-bold text-base"
              variants={itemVariants}
            >
              🎉 همه ویدیوها با موفقیت تماشا شده‌اند!
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default WatchVideos;