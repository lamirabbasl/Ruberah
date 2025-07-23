import React from "react";
import { IoClose, IoPencil } from "react-icons/io5";
import { motion } from "framer-motion";
import { convertToJalali } from "@/lib/utils/convertDate";

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

function SeasonCard({ season, confirmDeleteSeason, setEditingSeason, setShowEditForm }) {
  return (
    <motion.div
      key={season.id}
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
        onClick={() => confirmDeleteSeason(season)}
        className="absolute top-4 left-4 p-2 rounded-full text-red-500 hover:bg-gray-200 hover:text-red-700 transition-all duration-200"
        aria-label={`حذف فصل ${season.name}`}
      >
        <IoClose size={20} />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setEditingSeason({
            id: season.id,
            name: season.name,
            start_date: season.start_date,
            end_date: season.end_date,
          });
          setShowEditForm(true);
        }}
        className="absolute bottom-2 left-4 p-2 rounded-full text-indigo-500 hover:bg-gray-200 hover:text-indigo-700 transition-all duration-200"
        aria-label={`ویرایش فصل ${season.name}`}
      >
        <IoPencil size={20} />
      </motion.button>
      <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">{season.name}</h3>
      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex items-center">
          <span className="inline-block w-24 font-medium">تاریخ شروع:</span>
          <span>{convertToJalali(season.start_date)}</span>
        </p>
        <p className="flex items-center">
          <span className="inline-block w-24 font-medium">تاریخ پایان:</span>
          <span>{convertToJalali(season.end_date)}</span>
        </p>
      </div>
    </motion.div>
  );
}

export default SeasonCard;