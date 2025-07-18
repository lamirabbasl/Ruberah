"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { getIntroText, createIntroText, editIntroText } from "@/lib/api/api"

function IntroTextManager() {
    const [introText, setIntroText] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ text: "", order: 1 });
    const [formError, setFormError] = useState(null);
    const [editId, setEditId] = useState(null);
  
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getIntroText();
        setIntroText(data);
        setLoading(false);
      } catch (error) {
        setError("خطا در بارگذاری داده‌ها");
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name === "order" ? parseInt(value, 10) || 1 : value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        if (editId) {
          await editIntroText(editId, formData);
        } else {
          await createIntroText(formData);
        }
        setShowForm(false);
        setFormError(null);
        setFormData({ text: "", order: 1 });
        setEditId(null);
        await fetchData();
      } catch (error) {
        setFormError(`خطا در ${editId ? "به‌روزرسانی" : "ایجاد"} متن`);
        setLoading(false);
      }
    };
  
    const handleEdit = (item) => {
      setFormData({ text: item.text, order: item.order });
      setEditId(item.id);
      setShowForm(true);
    };
  
    const modalVariants = {
      hidden: { opacity: 0, scale: 0.85 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
      exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
    };
  
    const containerVariants = {
      hidden: { opacity: 0, y: 30, scale: 0.95 },
      visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    };
  
    return (
      <div dir="rtl" className="p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-mitra">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-4xl mx-auto border border-gray-200 rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight text-right">مدیریت متن‌های مقدمه</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setFormData({ text: "", order: 1 });
                setEditId(null);
                setShowForm(true);
              }}
              className="mt-4 sm:mt-0 bg-indigo-600 text-white px-4 sm:px-6 py-2 sm168:py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 text-sm sm:text-base font-medium"
            >
              افزودن متن جدید
            </motion.button>
          </div>
  
          {loading ? (
            <div className="flex justify-center items-center h-24 sm:h-32">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-t-indigo-600 border-gray-200 rounded-full"
              ></motion.div>
            </div>
          ) : error ? (
            <p className="text-center text-red-600 font-medium bg-red-50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">{error}</p>
          ) : (
            <div className="space-y-3 text-gray-800 text-sm sm:text-base">
              <ul className="list-disc pr-4 sm:pr-6 space-y-2 sm:space-y-3">
                {introText.length > 0 ? (
                  introText.map((item) => (
                    <li key={item.id} className="text-right flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <span>{item.text} (ترتیب: {item.order})</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(item)}
                        className="mt-2 sm:mt-0 text-indigo-600 hover:underline text-xs sm:text-sm"
                      >
                        ویرایش
                      </motion.button>
                    </li>
                  ))
                ) : (
                  <li className="text-right">هیچ اطلاعاتی موجود نیست</li>
                )}
              </ul>
            </div>
          )}
        </motion.div>
  
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-start z-50 overflow-y-auto"
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg mx-2 sm:mx-4 my-4"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowForm(false)}
                  className="absolute top-3 sm:top-4 left-3 sm:left-4 text-gray-500 hover:text-gray-700"
                  aria-label="بستن فرم"
                >
                  <IoClose size={24} />
                </motion.button>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight text-right">
                  {editId ? "ویرایش متن" : "افزودن متن جدید"}
                </h3>
                {formError && (
                  <p className="mb-3 sm:mb-4 text-red-500 text-sm sm:text-base bg-red-50 p-2 sm:p-3 rounded-lg text-right">{formError}</p>
                )}
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4" dir="rtl">
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 text-right">متن</label>
                    <input
                      type="text"
                      name="text"
                      value={formData.text}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm sm:text-base text-right"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 text-right">ترتیب</label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm sm:text-base text-right"
                      min="1"
                      required
                    />
                  </div>
                  <div className="flex justify-between space-x-2 sm:space-x-3 space-x-reverse pt-3 sm:pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-3 sm:px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm sm:text-base font-medium"
                    >
                      لغو
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-3 sm:px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 text-sm sm:text-base font-medium"
                    >
                      ذخیره
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
  
  export default IntroTextManager;