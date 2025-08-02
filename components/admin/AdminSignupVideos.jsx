"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, UploadCloud, Trash2, X } from "lucide-react";
import { getIntroVideos, addIntroVideo, deleteIntroVideo } from "@/lib/api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminSignupVideos = () => {
  const [videos, setVideos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Base URL for video sources (configurable via environment variable or API)
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIntroVideos();
      setVideos(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "خطا در دریافت ویدیوها";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile);
      setError(null);
    } else {
      const errorMessage = "لطفاً یک فایل ویدیویی معتبر انتخاب کنید.";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !videoTitle.trim()) {
      const errorMessage = "لطفاً عنوان ویدیو و فایل ویدیویی را وارد کنید.";
      toast.error(errorMessage);
      setError(errorMessage);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", videoTitle);
      formData.append("description", videoDescription);
      formData.append("video", file);

      const response = await addIntroVideo(formData);
      const successMessage = response.data?.message || "ویدیو با موفقیت بارگذاری شد.";
      toast.success(successMessage);

      setVideoTitle("");
      setVideoDescription("");
      setFile(null);
      fileInputRef.current.value = "";
      setIsAddModalOpen(false);
      fetchVideos();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "خطا در بارگذاری ویدیو";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveVideo = (id, title) => {
    setVideoToDelete({ id, title });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!videoToDelete) return;
    setLoading(true);
    setError(null);
    try {
      await deleteIntroVideo(videoToDelete.id);
      setVideos(videos.filter((video) => video.id !== videoToDelete.id));
      const successMessage = `ویدیوی "${videoToDelete.title}" با موفقیت حذف شد.`;
      toast.success(successMessage);
      setIsDeleteModalOpen(false);
      setVideoToDelete(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "خطا در حذف ویدیو";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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
    <div className="p-6 bg-gray-50 min-h-screen font-mitra text-right" dir="rtl">
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
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">ویدیوهای ثبت‌نام</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2 w-full sm:w-auto"
        >
          <PlusCircle className="w-5 h-5" />
          افزودن ویدیو
        </motion.button>
      </div>

      {loading && <p className="text-center text-gray-600">در حال بارگذاری...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition"
                aria-label="بستن فرم افزودن ویدیو"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 text-right">
                افزودن ویدیو جدید
              </h2>
              <form onSubmit={handleUpload}>
                <div className="mb-5">
                  <label
                    htmlFor="videoTitle"
                    className="block mb-2 text-sm font-medium text-gray-700 text-right"
                  >
                    عنوان ویدیو
                  </label>
                  <input
                    type="text"
                    id="videoTitle"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="عنوان ویدیو"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-right"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="videoDescription"
                    className="block mb-2 text-sm font-medium text-gray-700 text-right"
                  >
                    توضیحات
                  </label>
                  <textarea
                    id="videoDescription"
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    placeholder="توضیحات ویدیو"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-right"
                    rows={3}
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="videoFile"
                    className="block mb-2 text-sm font-medium text-gray-700 text-right"
                  >
                    انتخاب فایل ویدیویی
                  </label>
                  <input
                    type="file"
                    id="videoFile"
                    accept="video/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-right"
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm mb-4 text-right">{error}</p>}
                <div className="flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                  >
                    لغو
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isUploading}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 text-white ${
                      isUploading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } transition`}
                  >
                    {isUploading ? (
                      <>
                        <UploadCloud className="animate-spin w-5 h-5" />
                        در حال بارگذاری...
                      </>
                    ) : (
                      "بارگذاری"
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-sm relative"
            >
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition"
                aria-label="بستن تایید حذف"
              >
                <X size={20} />
              </button>
              <p className="mb-6 text-red-600 font-semibold text-center text-right">
                آیا مطمئن هستید که می‌خواهید ویدیوی "{videoToDelete?.title}" را حذف کنید؟
              </p>
              {error && <p className="text-red-500 text-sm mb-4 text-right">{error}</p>}
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  لغو
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmDelete}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-white ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                  } transition`}
                >
                  {loading ? "در حال حذف..." : "حذف"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {videos.length === 0 && !loading ? (
        <p className="text-center text-gray-600">هیچ ویدیویی وجود ندارد</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {videos.map((video) => (
              <motion.div
                key={video.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="p-4 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800 text-right truncate">
                    {video.title}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRemoveVideo(video.id, video.title)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="حذف ویدیو"
                    aria-label={`حذف ویدیوی ${video.title}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
                <div className="p-4">
                  <div className="relative w-full h-0 pb-[56.25%]">
                    <video
                      controls
                      src={`${BASE_URL}${video.video}`}
                      className="absolute top-0 left-0 w-full h-full rounded-lg object-cover border border-gray-200"
                    >
                      مرورگر شما از تگ ویدیو پشتیبانی نمی‌کند.
                    </video>
                  </div>
                  {video.description && (
                    <p className="mt-3 text-sm text-gray-600 text-right line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AdminSignupVideos;