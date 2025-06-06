"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { getSeasons, addSeason, deleteSeason } from "@/lib/api/api";

const SeasonsTab = () => {
  const [seasons, setSeasons] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSeason, setNewSeason] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [seasonToDelete, setSeasonToDelete] = useState(null);

  const fetchSeasons = async () => {
    setLoading(true);
    try {
      const data = await getSeasons();
      setSeasons(data);
    } catch (err) {
      setError("خطا در دریافت فصل‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  const handleAddSeason = async () => {
    if (
      !newSeason.name.trim() ||
      !newSeason.start_date ||
      !newSeason.end_date
    ) {
      setError("تمام فیلدها باید پر شوند");
      return;
    }
    setError(null);
    try {
      await addSeason(newSeason);
      setNewSeason({ name: "", start_date: "", end_date: "" });
      setShowAddForm(false);
      fetchSeasons();
    } catch (err) {
      setError("خطا در افزودن فصل");
    }
  };

  const confirmDeleteSeason = (season) => {
    setSeasonToDelete(season);
    setShowDeleteConfirm(true);
  };

  const handleDeleteSeason = async () => {
    if (!seasonToDelete) return;
    try {
      await deleteSeason(seasonToDelete.id);
      setShowDeleteConfirm(false);
      setSeasonToDelete(null);
      fetchSeasons();
    } catch (err) {
      setError("خطا در حذف فصل");
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSeasonToDelete(null);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">فصل‌ها</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          افزودن فصل
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative"
            >
              <button
                onClick={() => setShowAddForm(false)}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition"
                aria-label="بستن فرم افزودن فصل"
              >
                <IoClose size={24} />
              </button>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">افزودن فصل جدید</h3>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">نام فصل</label>
                <input
                  type="text"
                  value={newSeason.name}
                  onChange={(e) =>
                    setNewSeason({ ...newSeason, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">تاریخ شروع</label>
                <input
                  type="date"
                  value={newSeason.start_date}
                  onChange={(e) =>
                    setNewSeason({ ...newSeason, start_date: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">تاریخ پایان</label>
                <input
                  type="date"
                  value={newSeason.end_date}
                  onChange={(e) =>
                    setNewSeason({ ...newSeason, end_date: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddSeason}
                className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                ذخیره
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm relative"
            >
              <button
                onClick={cancelDelete}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition"
                aria-label="بستن تایید حذف"
              >
                <IoClose size={24} />
              </button>
              <p className="mb-6 text-red-600 font-semibold text-center">
                آیا از حذف فصل "{seasonToDelete?.name}" مطمئن هستید؟
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  لغو
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteSeason}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  حذف
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <p className="text-center text-gray-600">در حال بارگذاری...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : seasons.length === 0 ? (
        <p className="text-center text-gray-600">هیچ فصلی یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {seasons.map((season) => (
              <motion.div
                key={season.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-xl transition-shadow"
              >
                <button
                  onClick={() => confirmDeleteSeason(season)}
                  className="absolute top-3 left-3 text-red-500 hover:text-red-700 transition"
                  aria-label={`حذف فصل ${season.name}`}
                >
                  <IoClose size={20} />
                </button>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{season.name}</h3>
                <p className="text-gray-600 text-sm">
                  {season.start_date} - {season.end_date}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default SeasonsTab;