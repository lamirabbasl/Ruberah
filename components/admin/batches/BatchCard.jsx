"use client";

import React from "react";
import { motion } from "framer-motion";
import { IoClose, IoPencil } from "react-icons/io5";
import { cardVariants } from "./BatchAnimations";

const BatchCard = ({ batch, courses, seasons, onEdit, onDelete }) => {
  const courseName = courses.find((c) => c.id === batch.course)?.name || "-";
  const seasonName = seasons.find((s) => s.id === batch.season)?.name || "-";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onDelete(batch)}
        className="absolute top-4 left-4 p-2 rounded-full text-red-500 hover:bg-gray-200 hover:text-red-700 transition-all duration-200"
        aria-label={`حذف دوره ${batch.title}`}
      >
        <IoClose size={20} />
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onEdit(batch)}
        className="absolute bottom-4 left-4 p-2 rounded-full text-indigo-500 hover:bg-gray-200 hover:text-indigo-700 transition-all duration-200"
        aria-label={`ویرایش دوره ${batch.title}`}
      >
        <IoPencil size={20} />
      </motion.button>

      <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">{batch.title}</h3>
      
      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex items-center">
          <span className="inline-block w-24 font-medium">دوره:</span>
          <span>{courseName}</span>
        </p>
        <p className="flex items-center">
          <span className="inline-block w-24 font-medium">فصل:</span>
          <span>{seasonName}</span>
        </p>
        <p className="flex items-center">
          <span className="inline-block w-24 font-medium">سن:</span>
          <span>{batch.min_age} - {batch.max_age}</span>
        </p>
        <p className="flex items-center">
          <span className="inline-block w-24 font-medium">برنامه:</span>
          <span>{batch.schedule || "-"}</span>
        </p>
        <p className="flex items-center">
          <span className="inline-block w-24 font-medium">مکان:</span>
          <span>{batch.location}</span>
        </p>
        <p className="flex items-center">
          <span className="inline-block w-24 font-medium">ظرفیت:</span>
          <span>{batch.capacity}</span>
        </p>
        <p className="flex items-center">
          <span className="inline-block w-24 font-medium">درگاه:</span>
          <span className={`px-2 py-1 rounded-full text-xs ${batch.allow_gateway ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {batch.allow_gateway ? "بله" : "خیر"}
          </span>
        </p>
        <p className="flex items-center">
          <span className="inline-block w-24 font-medium">رسید:</span>
          <span className={`px-2 py-1 rounded-full text-xs ${batch.allow_receipt ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {batch.allow_receipt ? "بله" : "خیر"}
          </span>
        </p>
        <p className="flex items-center">
          <span className="inline-block w-24 font-medium">اقساط:</span>
          <span className={`px-2 py-1 rounded-full text-xs ${batch.allow_installment ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {batch.allow_installment ? "بله" : "خیر"}
          </span>
        </p>
        <p className="flex items-center">
          <span className="inline-block w-24 font-medium">قیمت درگاه:</span>
          <span>{batch.price_gateway || "-"}</span>
        </p>
        <p className="flex items-center">
          <span className="inline-block w-24 font-medium">قیمت رسید:</span>
          <span>{batch.price_receipt || "-"}</span>
        </p>
        <p className="flex items-center">
          <span className="inline-block w-24 font-medium">قیمت اقساط:</span>
          <span>{batch.price_installment || "-"}</span>
        </p>
        <p className="flex items-center">
          <span className="inline-block w-24 font-medium">فال بودن دوره</span>
          <span className={`px-2 py-1 rounded-full text-xs ${batch.booking_open ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {batch.booking_open ? "بله" : "خیر"}
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default BatchCard;