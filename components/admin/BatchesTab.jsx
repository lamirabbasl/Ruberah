"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoPencil } from "react-icons/io5";
import {
  getBatches,
  addBatch,
  editBatch,
  deleteBatch,
  getCourses,
  getSeasons,
} from "@/lib/api/api";

const BatchesTab = () => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
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
    installment_count: 0,
    colleague_discount_percent: 0,
    loyalty_discount_percent: 0,
  });
  const [editingBatch, setEditingBatch] = useState(null);
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
      setError("خطا در دریافت دوره‌ها");
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
        installment_count: 0,
        colleague_discount_percent: 0,
        loyalty_discount_percent: 0,
      });
      setShowAddForm(false);
      fetchBatches();
    } catch (err) {
      setError("خطاFSMSystem: خطا در افزودن دوره");
    }
  };

  const handleEditBatch = async () => {
    if (
      !editingBatch.course ||
      !editingBatch.season ||
      !editingBatch.title.trim() ||
      !editingBatch.min_age ||
      !editingBatch.max_age ||
      !editingBatch.location ||
      !editingBatch.capacity
    ) {
      setError("لطفا تمام فیلدهای ضروری را پر کنید");
      return;
    }
    setError(null);
    try {
      await editBatch(editingBatch.id, {
        title: editingBatch.title,
        course: editingBatch.course,
        season: editingBatch.season,
        min_age: editingBatch.min_age,
        max_age: editingBatch.max_age,
        schedule: editingBatch.schedule,
        location: editingBatch.location,
        capacity: editingBatch.capacity,
        allow_gateway: editingBatch.allow_gateway,
        allow_receipt: editingBatch.allow_receipt,
        allow_installment: editingBatch.allow_installment,
        price_gateway: editingBatch.price_gateway,
        price_receipt: editingBatch.price_receipt,
        price_installment: editingBatch.price_installment,
        installment_count: editingBatch.installment_count,
        colleague_discount_percent: editingBatch.colleague_discount_percent,
        loyalty_discount_percent: editingBatch.loyalty_discount_percent,
      });
      setShowEditForm(false);
      setEditingBatch(null);
      fetchBatches();
    } catch (err) {
      setError("خطا در ویرایش دوره");
    }
  };

  const confirmDeleteBatch = (batch) => {
    setBatchToDelete(batch);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setBatchToDelete(null);
  };

  const handleDeleteBatch = async () => {
    if (!batchToDelete) return;
    try {
      await deleteBatch(batchToDelete.id);
      setShowDeleteConfirm(false);
      setBatchToDelete(null);
      fetchBatches();
    } catch (err) {
      setError("خطا در حذف دوره");
    }
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
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">دوره‌های آموزشی</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 text-sm font-medium"
        >
          افزودن دوره جدید
        </motion.button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="جستجو بر اساس عنوان دوره"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
        />
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 overflow-auto"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white p-8 rounded-2xl min-h-screen max-md:mt-20 mt-[540px] shadow-2xl w-full max-w-lg relative my-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">افزودن دوره جدید</h3>
              <div className="space-y-5">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">دوره</label>
                  <select
                    value={newBatch.course}
                    onChange={(e) => setNewBatch({ ...newBatch, course: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  >
                    <option value="">انتخاب دوره</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">فصل</label>
                  <select
                    value={newBatch.season}
                    onChange={(e) => setNewBatch({ ...newBatch, season: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  >
                    <option value="">انتخاب فصل</option>
                    {seasons.map((season) => (
                      <option key={season.id} value={season.id}>
                        {season.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">عنوان</label>
                  <input
                    type="text"
                    value={newBatch.title}
                    onChange={(e) => setNewBatch({ ...newBatch, title: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium text-gray-700">حداقل سن</label>
                    <input
                      type="number"
                      value={newBatch.min_age}
                      onChange={(e) => setNewBatch({ ...newBatch, min_age: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium text-gray-700">حداکثر سن</label>
                    <input
                      type="number"
                      value={newBatch.max_age}
                      onChange={(e) => setNewBatch({ ...newBatch, max_age: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">برنامه زمانی</label>
                  <input
                    type="text"
                    value={newBatch.schedule}
                    onChange={(e) => setNewBatch({ ...newBatch, schedule: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">مکان</label>
                  <input
                    type="text"
                    value={newBatch.location}
                    onChange={(e) => setNewBatch({ ...newBatch, location: e.target.value })}
                    className="

w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">ظرفیت</label>
                  <input
                    type="number"
                    value={newBatch.capacity}
                    onChange={(e) => setNewBatch({ ...newBatch, capacity: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newBatch.allow_gateway}
                      onChange={(e) => setNewBatch({ ...newBatch, allow_gateway: e.target.checked })}
                      id="allow_gateway"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="allow_gateway" className="text-sm text-gray-700">اجازه درگاه</label>
                  </div>
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newBatch.allow_receipt}
                      onChange={(e) => setNewBatch({ ...newBatch, allow_receipt: e.target.checked })}
                      id="allow_receipt"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="allow_receipt" className="text-sm text-gray-700">اجازه رسید</label>
                  </div>
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newBatch.allow_installment}
                      onChange={(e) => setNewBatch({ ...newBatch, allow_installment: e.target.checked })}
                      id="allow_installment"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="allow_installment" className="text-sm text-gray-700">اجازه اقساط</label>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium text-gray-700">قیمت درگاه</label>
                    <input
                      type="number"
                      value={newBatch.price_gateway}
                      onChange={(e) => setNewBatch({ ...newBatch, price_gateway: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium text-gray-700">قیمت رسید</label>
                    <input
                      type="number"
                      value={newBatch.price_receipt}
                      onChange={(e) => setNewBatch({ ...newBatch, price_receipt: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium text-gray-700">قیمت اقساط</label>
                    <input
                      type="number"
                      value={newBatch.price_installment}
                      onChange={(e) => setNewBatch({ ...newBatch, price_installment: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">تعداد اقساط</label>
                  <input
                    type="number"
                    value={newBatch.installment_count}
                    onChange={(e) => setNewBatch({ ...newBatch, installment_count: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">درصد تخفیف همکار</label>
                  <input
                    type="number"
                    value={newBatch.colleague_discount_percent}
                    onChange={(e) => setNewBatch({ ...newBatch, colleague_discount_percent: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">درصد تخفیف وفاداری</label>
                  <input
                    type="number"
                    value={newBatch.loyalty_discount_percent}
                    onChange={(e) => setNewBatch({ ...newBatch, loyalty_discount_percent: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  />
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
                  onClick={handleAddBatch}
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
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 overflow-auto"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white p-8 rounded-2xl min-h-screen max-md:mt-20 mt-[540px] shadow-2xl w-full max-w-lg relative my-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">ویرایش دوره</h3>
              <div className="space-y-5">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">دوره</label>
                  <select
                    value={editingBatch?.course || ""}
                    onChange={(e) => setEditingBatch({ ...editingBatch, course: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  >
                    <option value="">انتخاب دوره</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">فصل</label>
                  <select
                    value={editingBatch?.season || ""}
                    onChange={(e) => setEditingBatch({ ...editingBatch, season: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  >
                    <option value="">انتخاب فصل</option>
                    {seasons.map((season) => (
                      <option key={season.id} value={season.id}>
                        {season.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">عنوان</label>
                  <input
                    type="text"
                    value={editingBatch?.title || ""}
                    onChange={(e) => setEditingBatch({ ...editingBatch, title: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium text-gray-700">حداقل سن</label>
                    <input
                      type="number"
                      value={editingBatch?.min_age || ""}
                      onChange={(e) => setEditingBatch({ ...editingBatch, min_age: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium text-gray-700">حداکثر سن</label>
                    <input
                      type="number"
                      value={editingBatch?.max_age || ""}
                      onChange={(e) => setEditingBatch({ ...editingBatch, max_age: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">برنامه زمانی</label>
                  <input
                    type="text"
                    value={editingBatch?.schedule || ""}
                    onChange={(e) => setEditingBatch({ ...editingBatch, schedule: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">مکان</label>
                  <input
                    type="text"
                    value={editingBatch?.location || ""}
                    onChange={(e) => setEditingBatch({ ...editingBatch, location: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">ظرفیت</label>
                  <input
                    type="number"
                    value={editingBatch?.capacity || ""}
                    onChange={(e) => setEditingBatch({ ...editingBatch, capacity: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingBatch?.allow_gateway || false}
                      onChange={(e) => setEditingBatch({ ...editingBatch, allow_gateway: e.target.checked })}
                      id="edit_allow_gateway"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="edit_allow_gateway" className="text-sm text-gray-700">اجازه درگاه</label>
                  </div>
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingBatch?.allow_receipt || false}
                      onChange={(e) => setEditingBatch({ ...editingBatch, allow_receipt: e.target.checked })}
                      id="edit_allow_receipt"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="edit_allow_receipt" className="text-sm text-gray-700">اجازه رسید</label>
                  </div>
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingBatch?.allow_installment || false}
                      onChange={(e) => setEditingBatch({ ...editingBatch, allow_installment: e.target.checked })}
                      id="edit_allow_installment"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="edit_allow_installment" className="text-sm text-gray-700">اجازه اقساط</label>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium text-gray-700">قیمت درگاه</label>
                    <input
                      type="number"
                      value={editingBatch?.price_gateway || ""}
                      onChange={(e) => setEditingBatch({ ...editingBatch, price_gateway: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium text-gray-700">قیمت رسید</label>
                    <input
                      type="number"
                      value={editingBatch?.price_receipt || ""}
                      onChange={(e) => setEditingBatch({ ...editingBatch, price_receipt: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium text-gray-700">قیمت اقساط</label>
                    <input
                      type="number"
                      value={editingBatch?.price_installment || ""}
                      onChange={(e) => setEditingBatch({ ...editingBatch, price_installment: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">تعداد اقساط</label>
                  <input
                    type="number"
                    value={editingBatch?.installment_count || 0}
                    onChange={(e) => setEditingBatch({ ...editingBatch, installment_count: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">درصد تخفیف همکار</label>
                  <input
                    type="number"
                    value={editingBatch?.colleague_discount_percent || 0}
                    onChange={(e) => setEditingBatch({ ...editingBatch, colleague_discount_percent: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">درصد تخفیف وفاداری</label>
                  <input
                    type="number"
                    value={editingBatch?.loyalty_discount_percent || 0}
                    onChange={(e) => setEditingBatch({ ...editingBatch, loyalty_discount_percent: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
                  />
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
                  onClick={handleEditBatch}
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
                آیا از حذف دوره "{batchToDelete?.title}" مطمئن هستید؟
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
                  onClick={handleDeleteBatch}
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
      ) : batches.length === 0 ? (
        <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">هیچ دوره‌ای یافت نشد.</p>
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
                  className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => confirmDeleteBatch(batch)}
                    className="absolute top-4 left-4 p-2 rounded-full text-red-500 hover:bg-gray-200 hover:text-red-700 transition-all duration-200"
                    aria-label={`حذف دوره ${batch.title}`}
                  >
                    <IoClose size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setEditingBatch({
                        id: batch.id,
                        title: batch.title,
                        course: batch.course,
                        season: batch.season,
                        min_age: batch.min_age,
                        max_age: batch.max_age,
                        schedule: batch.schedule,
                        location: batch.location,
                        capacity: batch.capacity,
                        allow_gateway: batch.allow_gateway,
                        allow_receipt: batch.allow_receipt,
                        allow_installment: batch.allow_installment,
                        price_gateway: batch.price_gateway,
                        price_receipt: batch.price_receipt,
                        price_installment: batch.price_installment,
                        installment_count: batch.installment_count,
                        colleague_discount_percent: batch.colleague_discount_percent,
                        loyalty_discount_percent: batch.loyalty_discount_percent,
                      });
                      setShowEditForm(true);
                    }}
                    className="absolute bottom-4 left-4 p-2 rounded-full text-indigo-500 hover:bg-gray-200 hover:text-indigo-700 transition-all duration-200"
                    aria-label={`ویرایش دوره ${batch.title}`}
                  >
                    <IoPencil size={20} />
                  </motion.button>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">{batch.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center">
                      <span className="inline-block w-24 font-medium">دوره:</span>
                      <span>{courses.find((c) => c.id === batch.course)?.name || "-"}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="inline-block w-24 font-medium">فصل:</span>
                      <span>{seasons.find((s) => s.id === batch.season)?.name || "-"}</span>
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
                      <span className="inline-block w-24 font-medium">اجازه درگاه:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          batch.allow_gateway ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {batch.allow_gateway ? "بله" : "خیر"}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <span className="inline-block w-24 font-medium">اجازه رسید:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          batch.allow_receipt ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {batch.allow_receipt ? "بله" : "خیر"}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <span className="inline-block w-24 font-medium">اجازه اقساط:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          batch.allow_installment ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
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
                      <span className="inline-block w-24 font-medium">تعداد اقساط:</span>
                      <span>{batch.installment_count || 0}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="inline-block w-24 font-medium">تخفیف همکار:</span>
                      <span>{batch.colleague_discount_percent || 0}%</span>
                    </p>
                    <p className="flex items-center">
                      <span className="inline-block w-24 font-medium">تخفیف وفاداری:</span>
                      <span>{batch.loyalty_discount_percent || 0}%</span>
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

export default BatchesTab;