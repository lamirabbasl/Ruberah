"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoPencil, IoSearch } from "react-icons/io5";
import { getSeasons, addSeason, editSeason, deleteSeason, searchSeasons } from "@/lib/api/api";
import JalaliCalendar from "../common/JalaliCalendar";
import { convertToJalali } from "@/lib/utils/convertDate";

const SeasonsTab = () => {
  const [seasons, setSeasons] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newSeason, setNewSeason] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });
  const [editingSeason, setEditingSeason] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [seasonToDelete, setSeasonToDelete] = useState(null);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [showEditStartCalendar, setShowEditStartCalendar] = useState(false);
  const [showEditEndCalendar, setShowEditEndCalendar] = useState(false);

  // State for search functionality - no debounce needed
  const [searchTerm, setSearchTerm] = useState("");

  // Modify fetchSeasons to accept an optional name parameter
  const fetchSeasons = useCallback(async (name = "") => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const data = name ? await searchSeasons(name) : await getSeasons();
      setSeasons(data);
    } catch (err) {
      console.error("Error fetching seasons:", err); // Log the actual error
      setError("خطا در دریافت فصل‌ها. لطفا دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  useEffect(() => {
    // Trigger fetchSeasons whenever searchTerm changes
    fetchSeasons(searchTerm);
  }, [searchTerm, fetchSeasons]); // Now depends directly on searchTerm

  const handleAddSeason = async () => {
    if (!newSeason.name.trim() || !newSeason.start_date || !newSeason.end_date) {
      setError("تمام فیلدها باید پر شوند");
      return;
    }
    setError(null);
    try {
      await addSeason(newSeason);
      setNewSeason({ name: "", start_date: "", end_date: "" });
      setShowAddForm(false);
      fetchSeasons(searchTerm); // Refresh seasons after adding, maintaining current search
    } catch (err) {
      console.error("Error adding season:", err);
      setError("خطا در افزودن فصل");
    }
  };

  const handleEditSeason = async () => {
    if (!editingSeason.name.trim() || !editingSeason.start_date || !editingSeason.end_date) {
      setError("تمام فیلدها باید پر شوند");
      return;
    }
    setError(null);
    try {
      await editSeason(editingSeason.id, {
        name: editingSeason.name,
        start_date: editingSeason.start_date,
        end_date: editingSeason.end_date,
      });
      setShowEditForm(false);
      setEditingSeason(null);
      fetchSeasons(searchTerm); // Refresh seasons after editing, maintaining current search
    } catch (err) {
      console.error("Error editing season:", err);
      setError("خطا در ویرایش فصل");
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
      fetchSeasons(searchTerm); // Refresh seasons after deleting, maintaining current search
    } catch (err) {
      console.error("Error deleting season:", err);
      setError("خطا در حذف فصل");
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSeasonToDelete(null);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-mitra">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">مدیریت فصل‌ها</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 text-sm font-medium"
        >
          افزودن فصل جدید
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative rounded-lg shadow-sm">
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <IoSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          name="season-search"
          id="season-search"
          className="block w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="جستجو بر اساس نام فصل..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Direct update, no debounce
        />
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">افزودن فصل جدید</h3>
              <div className="space-y-5">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">نام فصل</label>
                  <input
                    type="text"
                    value={newSeason.name}
                    onChange={(e) => setNewSeason({ ...newSeason, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">تاریخ شروع</label>
                  <input
                    type="text"
                    readOnly
                    value={convertToJalali(newSeason.start_date)}
                    onClick={() => {
                      setShowStartCalendar(true);
                      setShowEndCalendar(false);
                    }}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm cursor-pointer"
                    placeholder="انتخاب تاریخ شروع"
                  />
                  {showStartCalendar && (
                    <div className="absolute z-50 mb-3 bottom-0 bg-white shadow-lg rounded-lg">
                      <JalaliCalendar
                        onDateSelect={(date) => {
                          setNewSeason({ ...newSeason, start_date: date });
                          setShowStartCalendar(false);
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">تاریخ پایان</label>
                  <input
                    type="text"
                    readOnly
                    value={convertToJalali(newSeason.end_date)}
                    onClick={() => {
                      setShowEndCalendar(true);
                      setShowStartCalendar(false);
                    }}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm cursor-pointer"
                    placeholder="انتخاب تاریخ پایان"
                  />
                  {showEndCalendar && (
                    <div className="absolute z-50 bottom-0 mb-2 bg-white shadow-lg rounded-lg">
                      <JalaliCalendar
                        onDateSelect={(date) => {
                          setNewSeason({ ...newSeason, end_date: date });
                          setShowEndCalendar(false);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              {error && (
                <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg mt-4">{error}</p>
              )}
              <div className="flex justify-end space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium"
                >
                  انصراف
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddSeason}
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 text-sm font-medium"
                >
                  ذخیره
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">ویرایش فصل</h3>
              <div className="space-y-5">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">نام فصل</label>
                  <input
                    type="text"
                    value={editingSeason?.name || ""}
                    onChange={(e) => setEditingSeason({ ...editingSeason, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">تاریخ شروع</label>
                  <input
                    type="text"
                    readOnly
                    value={convertToJalali(editingSeason?.start_date)}
                    onClick={() => {
                      setShowEditStartCalendar(true);
                      setShowEditEndCalendar(false);
                    }}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm cursor-pointer"
                    placeholder="انتخاب تاریخ شروع"
                  />
                  {showEditStartCalendar && (
                    <div className="absolute z-50 mb-3 bottom-0 bg-white shadow-lg rounded-lg">
                      <JalaliCalendar
                        onDateSelect={(date) => {
                          setEditingSeason({ ...editingSeason, start_date: date });
                          setShowEditStartCalendar(false);
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">تاریخ پایان</label>
                  <input
                    type="text"
                    readOnly
                    value={convertToJalali(editingSeason?.end_date)}
                    onClick={() => {
                      setShowEditEndCalendar(true);
                      setShowEditStartCalendar(false);
                    }}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm cursor-pointer"
                    placeholder="انتخاب تاریخ پایان"
                  />
                  {showEditEndCalendar && (
                    <div className="absolute z-50 bottom-0 mb-2 bg-white shadow-lg rounded-lg">
                      <JalaliCalendar
                        onDateSelect={(date) => {
                          setEditingSeason({ ...editingSeason, end_date: date });
                          setShowEditEndCalendar(false);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              {error && (
                <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg mt-4">{error}</p>
              )}
              <div className="flex justify-end space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEditForm(false)}
                  className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium"
                >
                  انصراف
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditSeason}
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 text-sm font-medium"
                >
                  ذخیره
                </motion.button>
              </div>
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
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
            >
              <p className="mb-6 text-red-600 font-semibold text-center text-lg">
                آیا از حذف فصل "{seasonToDelete?.name}" مطمئن هستید؟
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelDelete}
                  className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium"
                >
                  لغو
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteSeason}
                  className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-200 text-sm font-medium"
                >
                  حذف
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
      ) : seasons.length === 0 && searchTerm ? ( // Show message if no results and search term is present
        <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">
          هیچ فصلی با نام "{searchTerm}" یافت نشد.
        </p>
      ) : seasons.length === 0 ? ( // Show message if no results and no search term
        <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">هیچ فصلی یافت نشد.</p>
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
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default SeasonsTab;