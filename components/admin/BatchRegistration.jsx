"use client";

import React from "react";
import { motion } from "framer-motion";
import { IoClose, IoPencil } from "react-icons/io5";
import { cardVariants } from "./batches/BatchAnimations";
import Link from "next/link";

const BatchRegistration = ({ batch, courses, seasons}) => {
  const courseName = courses.find((c) => c.id === batch.course)?.name || "-";
  const seasonName = seasons.find((s) => s.id === batch.season)?.name || "-";

  return (
    <Link href={`/admin/dashboard/courses/batches/${batch.id}`}>
    <motion.div
    dir="rtl"
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    exit="hidden"
    className="relative cursor-pointer text-right bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
  >
    <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">{batch.title}</h3>

    <div className="space-y-2 text-sm text-gray-700">
      <p>دوره: {courseName}</p>
      <p>فصل: {seasonName}</p>
      <p>سن: {batch.min_age} - {batch.max_age}</p>
      <p>برنامه: {batch.schedule || "-"}</p>
      <p>مکان: {batch.location}</p>
      <p>ظرفیت: {batch.capacity}</p>
    </div>
  </motion.div></Link>
  );
};

export default BatchRegistration;
