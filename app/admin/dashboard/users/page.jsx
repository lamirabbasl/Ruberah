"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaPlus, FaFileExport, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AddUserForm from "@/components/admin/AddUserForm";
import { getUsers, addUser, deleteUser, getUsersExport } from "@/lib/api/api";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [exporting, setExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Pass currentPage and searchTerm to getUsers
      const data = await getUsers(currentPage, searchTerm);
      setUsers(data.results);
      setIsLastPage(data.is_last_page);
    } catch (err) {
      setError(err.message || "خطا در دریافت کاربران");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]); // Depend on currentPage and searchTerm

  const handleAddUser = () => {
    setShowAddForm(true);
  };

  const handleExportExcel = async () => {
    setExporting(true);
    setError(null);
    try {
      const response = await getUsersExport();

      if (!(response instanceof Blob)) {
        throw new Error("دریافت پاسخ نامعتبر از سرور");
      }

      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "users_export.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting Excel:", err);
      setError(err.message || "خطا در صادرات به اکسل");
    } finally {
      setExporting(false);
    }
  };

  const handleSaveNewUser = async (newUser) => {
    setLoading(true);
    setError(null);
    try {
      await addUser(newUser);
      setShowAddForm(false);
      // After adding, reset to first page and refetch
      setCurrentPage(1);
      // No explicit call to fetchUsers here, as useEffect will handle it
    } catch (err) {
      setError(err.message || "خطا در افزودن کاربر");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  const openConfirmDelete = (id) => {
    setUserToDelete(id);
    setShowConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setUserToDelete(null);
    setShowConfirmDelete(false);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setLoading(true);
    setError(null);
    try {
      await deleteUser(userToDelete);
      setShowConfirmDelete(false);
      setUserToDelete(null);
      // No explicit call to fetchUsers here, as useEffect will handle it
    } catch (err) {
      setError(err.message || "خطا در حذف کاربر");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    if (!isLastPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div className="p-6 bg-gradient-to-b text-black from-gray-50 w-5/6 max-md:w-screen to-gray-100 min-h-screen font-mitra text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">مدیریت کاربران</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddUser}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 text-sm font-medium flex items-center gap-2 w-full sm:w-auto"
          >
            <FaPlus className="w-4 h-4" />
            افزودن کاربر جدید
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportExcel}
            disabled={exporting}
            className={`px-6 py-3 rounded-lg shadow-md flex items-center gap-2 w-full sm:w-auto text-white ${
              exporting ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            } transition-all duration-200 text-sm font-medium`}
          >
            <FaFileExport className="w-4 h-4" />
            {exporting ? "در حال دانلود..." : "خروجی اکسل"}
          </motion.button>
        </div>
      </div>

      <div className="mb-6 text-black">
        <input
          type="text"
          placeholder="جستجو بر اساس نام کاربری یا شماره تلفن"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm text-right"
        />
      </div>

      <AnimatePresence>
        {showAddForm && (
          <AddUserForm onSave={handleSaveNewUser} onCancel={handleCancelAdd} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl p-8 w-full max-w-md relative"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeConfirmDelete}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
                aria-label="بستن تایید حذف"
              >
                <FaTrash size={20} />
              </motion.button>
              <p className="mb-6 text-red-600 font-semibold text-center text-lg text-right">
                آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟
              </p>
              {error && (
                <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg mb-4 text-right">{error}</p>
              )}
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeConfirmDelete}
                  className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium"
                >
                  لغو
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteUser}
                  className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-200 text-sm font-medium"
                >
                  حذف
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-t-indigo-600 border-gray-200 rounded-full"
          ></motion.div>
        </div>
      )}
      {error && !loading && (
        <p className="text-center text-red-600 font-medium bg-red-50 p-4 rounded-lg mb-6">{error}</p>
      )}

      {users.length === 0 && !loading && searchTerm === "" ? (
        <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">هیچ کاربری وجود ندارد</p>
      ) : users.length === 0 && !loading && searchTerm !== "" ? (
        <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">هیچ کاربری با این مشخصات یافت نشد.</p>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={rowVariants}
          className="overflow-x-auto bg-white border border-gray-200 rounded-2xl shadow-lg"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  نام کاربری
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  شماره تلفن
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  نقش
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  آدرس
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  کد ملی
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {users.map((user) => (
                  <motion.tr
                    key={user.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                      {user.phone_number || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                      {user.groups && user.groups.length > 0 ? user.groups.join(", ") : "-"}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-600">
                      {user.address || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                      {user.national_id || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openConfirmDelete(user.id)}
                        className="text-red-500 hover:text-red-700 transition-all duration-200 p-2 rounded-full bg-red-50 hover:bg-red-100"
                        aria-label={`حذف کاربر ${user.username}`}
                      >
                        <FaTrash size={16} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
            <motion.button
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === 1 || loading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              <FaChevronRight className="w-4 h-4" />
              قبلی
            </motion.button>
            <span className="text-sm font-medium text-gray-700">صفحه {currentPage}</span>
            <motion.button
              onClick={handleNextPage}
              disabled={isLastPage || loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isLastPage || loading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              بعدی
              <FaChevronLeft className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UsersPage;