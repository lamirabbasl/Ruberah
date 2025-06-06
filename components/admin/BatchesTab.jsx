"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import {
  getBatches,
  addBatch,
  deleteBatch,
  getCourses,
  getSeasons,
} from "@/lib/api/api";

const BatchesTab = () => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBatch, setNewBatch] = useState({
    course: "",
    season: "",
    title: "",
    min_age: "",
    max_age: "",
    schedule: "",
    location: "",
    capacity: "",
    allow_gateway: false,
    allow_receipt: false,
    allow_installment: false,
    price_gateway: "",
    price_receipt: "",
    price_installment: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const data = await getBatches();
      setBatches(data);
    } catch (err) {
      setError("خطا در دریافت بچه‌ها");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      setError("خطا در دریافت دوره‌ها");
    }
  };

  const fetchSeasons = async () => {
    try {
      const data = await getSeasons();
      setSeasons(data);
    } catch (err) {
      setError("خطا در دریافت فصل‌ها");
    }
  };

  useEffect(() => {
    fetchBatches();
    fetchCourses();
    fetchSeasons();
  }, []);

  const handleAddBatch = async () => {
    if (
      !newBatch.course ||
      !newBatch.season ||
      !newBatch.title.trim() ||
      !newBatch.min_age ||
      !newBatch.max_age ||
      !newBatch.location ||
      !newBatch.capacity
    ) {
      setError("لطفا تمام فیلدهای ضروری را پر کنید");
      return;
    }
    setError(null);
    try {
      await addBatch(newBatch);
      setNewBatch({
        course: "",
        season: "",
        title: "",
        min_age: "",
        max_age: "",
        schedule: "",
        location: "",
        capacity: "",
        allow_gateway: false,
        allow_receipt: false,
        allow_installment: false,
        price_gateway: "",
        price_receipt: "",
        price_installment: "",
      });
      setShowAddForm(false);
      fetchBatches();
    } catch (err) {
      setError("خطا در افزودن بچه");
    }
  };

  const confirmDeleteBatch = (batch) => {
    setBatchToDelete(batch);
    setShowDeleteConfirm(true);
  };

  const handleDeleteBatch = async () => {
    if (!batchToDelete) return;
    try {
      await deleteBatch(batchToDelete.id);
      setShowDeleteConfirm(false);
      setBatchToDelete(null);
      fetchBatches();
    } catch (err) {
      setError("خطا در حذف بچه");
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setBatchToDelete(null);
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
        <h2 className="text-2xl font-bold text-gray-800">دوره های آموزشی</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          افزودن دوره
        </motion.button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="جستجو بر اساس عنوان"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 overflow-auto"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white min-h-screen mt-60 p-8 rounded-xl shadow-2xl w-full max-w-lg relative"
            >
              <button
                onClick={() => setShowAddForm(false)}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition"
                aria-label="بستن فرم افزودن بچه"
              >
                <IoClose size={24} />
              </button>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">افزودن دوره </h3>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">دوره</label>
                <select
                  value={newBatch.course}
                  onChange={(e) => setNewBatch({ ...newBatch, course: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="">انتخاب دوره</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">فصل</label>
                <select
                  value={newBatch.season}
                  onChange={(e) => setNewBatch({ ...newBatch, season: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="">انتخاب فصل</option>
                  {seasons.map((season) => (
                    <option key={season.id} value={season.id}>
                      {season.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">عنوان</label>
                <input
                  type="text"
                  value={newBatch.title}
                  onChange={(e) => setNewBatch({ ...newBatch, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div className="flex space-x-4 mb-5">
                <div className="flex-1">
                  <label className="block mb-2 text-sm font-medium text-gray-700">حداقل سن</label>
                  <input
                    type="number"
                    value={newBatch.min_age}
                    onChange={(e) => setNewBatch({ ...newBatch, min_age: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-2 text-sm font-medium text-gray-700">حداکثر سن</label>
                  <input
                    type="number"
                    value={newBatch.max_age}
                    onChange={(e) => setNewBatch({ ...newBatch, max_age: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">برنامه زمانی</label>
                <input
                  type="text"
                  value={newBatch.schedule}
                  onChange={(e) => setNewBatch({ ...newBatch, schedule: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">مکان</label>
                <input
                  type="text"
                  value={newBatch.location}
                  onChange={(e) => setNewBatch({ ...newBatch, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">ظرفیت</label>
                <input
                  type="number"
                  value={newBatch.capacity}
                  onChange={(e) => setNewBatch({ ...newBatch, capacity: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div className="flex space-x-4 mb-5">
                <div className="flex-1 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newBatch.allow_gateway}
                    onChange={(e) =>
                      setNewBatch({ ...newBatch, allow_gateway: e.target.checked })
                    }
                    id="allow_gateway"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allow_gateway" className="text-sm text-gray-700">اجازه درگاه</label>
                </div>
                <div className="flex-1 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newBatch.allow_receipt}
                    onChange={(e) =>
                      setNewBatch({ ...newBatch, allow_receipt: e.target.checked })
                    }
                    id="allow_receipt"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allow_receipt" className="text-sm text-gray-700">اجازه رسید</label>
                </div>
                <div className="flex-1 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newBatch.allow_installment}
                    onChange={(e) =>
                      setNewBatch({ ...newBatch, allow_installment: e.target.checked })
                    }
                    id="allow_installment"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allow_installment" className="text-sm text-gray-700">اجازه اقساط</label>
                </div>
              </div>
              <div className="flex space-x-4 mb-5">
                <div className="flex-1">
                  <label className="block mb-2 text-sm font-medium text-gray-700">قیمت درگاه</label>
                  <input
                    type="number"
                    value={newBatch.price_gateway}
                    onChange={(e) => setNewBatch({ ...newBatch, price_gateway: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-2 text-sm font-medium text-gray-700">قیمت رسید</label>
                  <input
                    type="number"
                    value={newBatch.price_receipt}
                    onChange={(e) => setNewBatch({ ...newBatch, price_receipt: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-2 text-sm font-medium text-gray-700">قیمت اقساط</label>
                  <input
                    type="number"
                    value={newBatch.price_installment}
                    onChange={(e) => setNewBatch({ ...newBatch, price_installment: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  انصراف
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddBatch}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
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
                آیا از حذف بچه "{batchToDelete?.title}" مطمئن هستید؟
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
                  onClick={handleDeleteBatch}
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
      ) : batches.length === 0 ? (
        <p className="text-center text-gray-600">هیچ بچه‌ای یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {batches
              .filter((batch) =>
                batch.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((batch) => (
                <motion.div
                  key={batch.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-xl transition-shadow"
                >
                  <button
                    onClick={() => confirmDeleteBatch(batch)}
                    className="absolute top-3 left-3 text-red-500 hover:text-red-700 transition"
                    aria-label={`حذف بچه ${batch.title}`}
                  >
                    <IoClose size={20} />
                  </button>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{batch.title}</h3>
                  <p className="text-gray-600 text-sm">
                    دوره: {courses.find((c) => c.id === batch.course)?.name || ""}
                  </p>
                  <p className="text-gray-600 text-sm">
                    فصل: {seasons.find((s) => s.id === batch.season)?.name || ""}
                  </p>
                  <p className="text-gray-600 text-sm">
                    سن: {batch.min_age} - {batch.max_age}
                  </p>
                  <p className="text-gray-600 text-sm">برنامه: {batch.schedule || "-"}</p>
                  <p className="text-gray-600 text-sm">مکان: {batch.location}</p>
                  <p className="text-gray-600 text-sm">ظرفیت: {batch.capacity}</p>
                  <p className="text-gray-600 text-sm">
                    اجازه درگاه: {batch.allow_gateway ? "بله" : "خیر"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    اجازه رسید: {batch.allow_receipt ? "بله" : "خیر"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    اجازه اقساط: {batch.allow_installment ? "بله" : "خیر"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    قیمت درگاه: {batch.price_gateway || "-"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    قیمت رسید: {batch.price_receipt || "-"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    قیمت اقساط: {batch.price_installment || "-"}
                  </p>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default BatchesTab;