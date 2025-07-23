import React from "react";
import { motion } from "framer-motion";
import SeasonCard from "./SeasonCard";

function SeasonList({ seasons, loading, error, searchTerm, confirmDeleteSeason, setEditingSeason, setShowEditForm }) {
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-t-indigo-600 border-gray-200 rounded-full"
          ></motion.div>
        </div>
      ) : error ? (
        <p className="text-center text-red-600 font-medium bg-red-50 p-4 rounded-lg">{error}</p>
      ) : seasons.length === 0 && searchTerm ? (
        <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">
          هیچ فصلی با نام "{searchTerm}" یافت نشد.
        </p>
      ) : seasons.length === 0 ? (
        <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">هیچ فصلی یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seasons.map((season) => (
            <SeasonCard
              key={season.id}
              season={season}
              confirmDeleteSeason={confirmDeleteSeason}
              setEditingSeason={setEditingSeason}
              setShowEditForm={setShowEditForm}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default SeasonList;