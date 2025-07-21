"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getIntroText } from "@/lib/api/api";

// Animation variants for the container
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 },
  },
};

// Animation variants for list items
const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

// Animation variants for the button
const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

function Home() {
  const [introText, setIntroText] = useState([]);

  useEffect(() => {
    const fetchIntroText = async () => {
      try {
        const data = await getIntroText();
        setIntroText(data);
      } catch (error) {
        console.error("Error fetching intro text:", error);
        setIntroText([]);
      }
    };
    fetchIntroText();
  }, []);

  return (
    <div className="w-full min-h-screen text-right flex items-center justify-center font-mitra bg-primary  px-4">
      <motion.div
        className="flex flex-col items-end gap-8 w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg max-md:w-[95%] max-md:h-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        dir="rtl"
      >
        <motion.div variants={itemVariants} 
        className="w-full text-center"
        >
          <span className="text-3xl md:text-4xl text-white">روند ثبت نام</span>
        </motion.div>
        <motion.div variants={itemVariants} className="w-full">
          <ul className="list-disc text-right pr-6 space-y-4 text-white/90 text-lg md:text-xl">
            {introText.length > 0 ? (
              introText.map((item) => (
                <motion.li key={item.id} variants={itemVariants}>
                  {item.text}
                </motion.li>
              ))
            ) : (
              <motion.li variants={itemVariants}>در حال بارگذاری...</motion.li>
            )}
          </ul>
        </motion.div>
        <motion.div variants={buttonVariants} initial="hidden" animate="visible" whileHover="hover">
          <Link href="/enroll/watch">
            <div className="self-start max-md:self-center mt-4 bg-secondery text-white px-4 py-2 rounded-lg  hover:bg-secondery/80 transition text-lg">
              ادامه ثبت نام
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;