import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, UploadCloud, Trash2 } from "lucide-react";
import { getIntroVideos, addIntroVideo, deleteIntroVideo } from "@/lib/api/api";

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

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIntroVideos();
      console.log("Fetched videos:", data);
      setVideos(data);
    } catch (err) {
      setError(err.message || "Error fetching videos");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile);
    } else {
      alert("لطفاً یک فایل ویدیویی معتبر انتخاب کنید.");
      setFile(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !videoTitle.trim()) {
      alert("لطفاً عنوان ویدیو و فایل ویدیویی را وارد کنید.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", videoTitle);
      formData.append("description", videoDescription);
      formData.append("video", file);

      await addIntroVideo(formData);

      alert("ویدیو با موفقیت بارگذاری شد!");
      setVideoTitle("");
      setVideoDescription("");
      setFile(null);
      fileInputRef.current.value = "";
      setIsAddModalOpen(false);
      fetchVideos();
    } catch (err) {
      setError(err.message || "Error uploading video");
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
      // Removed alert on successful deletion as per user request
      setVideos(videos.filter((video) => video.id !== videoToDelete.id));
      setIsDeleteModalOpen(false);
      setVideoToDelete(null);
    } catch (err) {
      setError(err.message || "Error deleting video");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  return (
    <div className="p-4 sm:p-6 font-noto bg-white min-h-screen" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">
          ویدیوهای ثبت‌نام
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-md shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 w-full sm:w-auto"
        >
          <PlusCircle className="w-5 h-5" />
          افزودن ویدیو
        </button>
      </div>

      {error && (
        <div className="mb-4 text-red-600 font-semibold text-center">
          {error}
        </div>
      )}

      {/* Modal for Adding Video */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-[90%] sm:max-w-md shadow-2xl relative border border-gray-300"
              style={{ backdropFilter: "blur(12px)" }}
            >
              <h2 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-6 text-right text-gray-800">
                افزودن ویدیو جدید
              </h2>
              <form onSubmit={handleUpload}>
                <div className="mb-4">
                  <label
                    htmlFor="videoTitle"
                    className="block text-gray-700 text-sm font-bold mb-2 text-right"
                  >
                    عنوان ویدیو:
                  </label>
                  <input
                    type="text"
                    id="videoTitle"
                    name="videoTitle"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="عنوان ویدیو"
                    className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="videoDescription"
                    className="block text-gray-700 text-sm font-bold mb-2 text-right"
                  >
                    توضیحات:
                  </label>
                  <textarea
                    id="videoDescription"
                    name="videoDescription"
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    placeholder="توضیحات ویدیو"
                    className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
                    rows={3}
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="videoFile"
                    className="block text-gray-700 text-sm font-bold mb-2 text-right"
                  >
                    انتخاب فایل ویدیویی:
                  </label>
                  <input
                    type="file"
                    id="videoFile"
                    accept="video/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="appearance-none border border-gray-300 rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-md focus:outline-none shadow-md hover:shadow-lg transition-all duration-200 z-10 w-full sm:w-auto"
                  >
                    لغو
                  </button>
                  <button
                    type="submit"
                    className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-md flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 z-10 w-full sm:w-auto ${
                      isUploading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <UploadCloud className="animate-spin w-5 h-5" />
                        در حال بارگذاری...
                      </>
                    ) : (
                      "بارگذاری"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for Delete Confirmation */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-[90%] sm:max-w-md shadow-2xl relative border border-gray-300"
              style={{ backdropFilter: "blur(12px)" }}
            >
              <h2 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-6 text-right text-gray-800">
                حذف ویدیو
              </h2>
              <p className="text-gray-700 mb-4 sm:mb-6 text-right">
                آیا مطمئن هستید که می‌خواهید ویدیوی "{videoToDelete?.title}" را
                حذف کنید؟
              </p>
              <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-md focus:outline-none shadow-md hover:shadow-lg transition-all duration-200 z-10 w-full sm:w-auto"
                >
                  لغو
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-md focus:outline-none shadow-md hover:shadow-lg transition-all duration-200 z-10 w-full sm:w-auto"
                >
                  حذف
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence>
          {videos.map((video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white border border-gray-300 rounded-md shadow-md hover:shadow-lg transition-all duration-200">
                <div className="p-3 sm:p-4 flex justify-between items-center">
                  <h2 className="text-base sm:text-lg font-semibold text-black text-right">
                    {video.title}
                  </h2>
                  <button
                    onClick={() => handleRemoveVideo(video.id, video.title)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                    title="حذف ویدیو"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="relative w-full h-0 pb-[56.25%]">
                    <video
                      controls
                      src={`http://127.0.0.1:8000/${video.video}`}
                      className="absolute top-0 left-0 w-full h-full rounded-md object-cover border border-gray-300"
                    >
                      مرورگر شما از تگ ویدیو پشتیبانی نمی‌کند.
                    </video>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminSignupVideos;
