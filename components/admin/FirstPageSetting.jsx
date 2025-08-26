"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { getFirstPageManager, editFirstPage } from "@/lib/api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    install_link: "",
    telegram_link: "",
    email: "",
    phone_number: "",
    presentation_text: "",
    address: "",
    show_address: false,
  });

  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState(settings);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getFirstPageManager();
      setSettings({
        install_link: data.install_link || "",
        telegram_link: data.telegram_link || "",
        email: data.email || "",
        phone_number: data.phone_number || "",
        presentation_text: data.presentation_text || "",
        address: data.address || "",
        show_address: data.show_address || false,
      });
      setFormData({
        install_link: data.install_link || "",
        telegram_link: data.telegram_link || "",
        email: data.email || "",
        phone_number: data.phone_number || "",
        presentation_text: data.presentation_text || "",
        address: data.address || "",
        show_address: data.show_address || false,
      });
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "خطا در بارگذاری داده‌ها";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await editFirstPage(formData);
      toast.success("تنظیمات با موفقیت به‌روزرسانی شد.");
      setShowEditForm(false);
      await fetchData();
    } catch (err) {
      const errorMessage = err?.response?.data?.message ||  "خطا در به‌روزرسانی تنظیمات";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
  };

  return (
    <div dir="rtl" className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-mitra">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        rtl={true}
      />

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">تنظیمات صفحه</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowEditForm(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 text-base font-medium"
        >
          ویرایش تنظیمات
        </motion.button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-t-indigo-600 border-gray-200 rounded-full"
          ></motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight text-right">اطلاعات صفحه</h3>
          <div className="space-y-3 text-gray-800 text-base">
            <p className="flex items-center justify-end flex-row-reverse">
              <a href={settings.install_link} className="text-indigo-600 hover:underline text-right">{settings.install_link}</a>
              <span className="inline-block w-32 font-medium text-right mr-4">آدرس اینستاگرام</span>
            </p>
            <p className="flex items-center justify-end flex-row-reverse">
              <a href={settings.telegram_link} className="text-indigo-600 hover:underline text-right">{settings.telegram_link}</a>
              <span className="inline-block w-32 font-medium text-right mr-4">آیدی تلگرام:</span>
            </p>
            <p className="flex items-center justify-end flex-row-reverse">
              <span className="text-right">{settings.email}</span>
              <span className="inline-block w-32 font-medium text-right mr-4">ایمیل:</span>
            </p>
            <p className="flex items-center justify-end flex-row-reverse">
              <span className="text-right">{settings.phone_number}</span>
              <span className="inline-block w-32 font-medium text-right mr-4">شماره تلفن:</span>
            </p>
            <p className="flex items-start justify-end flex-row-reverse">
              <span style={{ whiteSpace: "normal", overflowWrap: "break-word", maxWidth: "100%" }}>
                {settings.presentation_text}
              </span>
              <span className="inline-block w-32 font-medium text-right mr-4">متن معرفی:</span>
            </p>
            {settings.show_address && (
              <p className="flex items-start justify-end flex-row-reverse">
                <span style={{ whiteSpace: "normal", overflowWrap: "break-word", maxWidth: "100%" }}>
                  {settings.address}
                </span>
                <span className="inline-block w-32 font-medium text-right mr-4">آدرس:</span>
              </p>
            )}
            <p className="flex items-center justify-end flex-row-reverse">
              <span className="text-right">{settings.show_address ? "بله" : "خیر"}</span>
              <span className="inline-block w-32 font-medium text-right mr-4">نمایش آدرس:</span>
            </p>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showEditForm && (
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
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative my-4"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowEditForm(false)}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
                aria-label="بستن فرم"
              >
                <IoClose size={28} />
              </motion.button>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight text-right">ویرایش اطلاعات صفحه</h3>
              <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
                <div>
                  <label className="block text-base font-medium text-gray-700 text-right">آدرس اینستاگرام</label>
                  <input
                    type="url"
                    name="install_link"
                    value={formData.install_link}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-base text-right"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 text-right">آدرس تلگرام</label>
                  <input
                    type="url"
                    name="telegram_link"
                    value={formData.telegram_link}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-base text-right"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 text-right">ایمیل</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-base text-right"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 text-right">شماره تلفن</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-base text-right"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 text-right">متن معرفی</label>
                  <textarea
                    name="presentation_text"
                    value={formData.presentation_text}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-base text-right"
                    rows="4"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 text-right">آدرس</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-base text-right"
                  />
                </div>
                <div className="flex items-center justify-end">
                  <input
                    type="checkbox"
                    name="show_address"
                    checked={formData.show_address}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded ml-2"
                  />
                  <label className="text-base font-medium text-gray-700">نمایش آدرس</label>
                </div>
                <div className="flex justify-between space-x-3 space-x-reverse pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-base font-medium"
                  >
                    لغو
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 text-base font-medium"
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
};

export default SettingsPage;
