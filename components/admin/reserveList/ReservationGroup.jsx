import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReservationTable from "./ReservationTable";
import Spinner from "@/components/common/Spinner";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function ReservationGroup({
  date,
  reservationsForDate,
  expanded,
  setExpandedDates,
  handleToggleActivation,
  openConfirmDelete,
  loading, // New prop for group-specific loading state
}) {
  return (
    <motion.div
      key={date}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="mb-6"
    >
      <motion.div
        className="flex items-center justify-between mb-3 bg-gray-100 rounded-lg px-4 py-3 cursor-pointer"
        whileHover={{ scale: 1.02 }}
        onClick={() =>
          setExpandedDates((prev) => ({
            ...prev,
            [date]: !prev[date],
          }))
        }
      >
        <h3 className="text-lg font-semibold text-gray-800">{date}</h3>
        <span
          className="text-indigo-600"
          aria-label={expanded ? "جمع کردن" : "باز کردن"}
        >
          {expanded ? "▲" : "▼"}
        </span>
      </motion.div>
      <AnimatePresence>
        {expanded && (
          <>
            {loading ? (
              <div className="py-4">
                <Spinner />
              </div>
            ) : (
              <ReservationTable
                reservations={reservationsForDate}
                handleToggleActivation={handleToggleActivation}
                openConfirmDelete={openConfirmDelete}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ReservationGroup;