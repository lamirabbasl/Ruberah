"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaPlus, FaFileExport } from "react-icons/fa";
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || "خطا در دریافت کاربران");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setShowAddForm(true);
  };

  const handleExportExcel = async () => {
    setExporting(true);
    setError(null);
    try {
      const blob = await getUsersExport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "users_export.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
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
      await fetchUsers();
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
      await fetchUsers();
    } catch (err) {
      setError(err.message || "خطا در حذف کاربر");
    } finally {
      setLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-5/6 text-black font-sans text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">کاربران</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddUser}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2 w-full sm:w-auto"
          >
            <FaPlus className="w-4 h-4" />
            افزودن کاربر
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportExcel}
            disabled={exporting}
            className={`px-5 py-2.5 rounded-lg shadow-md flex items-center gap-2 w-full sm:w-auto text-white ${
              exporting ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            } transition-colors`}
          >
            <FaFileExport className="w-4 h-4" />
            {exporting ? "در حال دانلود..." : "خروجی اکسل"}
          </motion.button>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="جستجو بر اساس نام یا شماره تلفن"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-right"
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
                onClick={closeConfirmDelete}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition"
                aria-label="بستن تایید حذف"
              >
                <FaTrash size={20} />
              </button>
              <p className="mb-6 text-red-600 font-semibold text-center text-right">
                آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟
              </p>
              {error && <p className="text-red-500 text-sm mb-4 text-right">{error}</p>}
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeConfirmDelete}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  لغو
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteUser}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  حذف
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && <p className="text-center text-gray-600">در حال بارگذاری...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {users.length === 0 && !loading ? (
        <p className="text-center text-gray-600">هیچ کاربری وجود ندارد</p>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={rowVariants}
          className="overflow-x-auto border border-gray-200 rounded-xl shadow-md"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  نام کاربری
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  شماره تلفن
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  نقش
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  آدرس
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  کد ملی
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  حذف
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {users
                  .filter(
                    (user) =>
                      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (user.phone_number &&
                        user.phone_number.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map((user) => (
                    <motion.tr
                      key={user.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                        {user.phone_number || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                        {user.groups && user.groups.length > 0 ? user.groups.join(", ") : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                        {user.address || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                        {user.national_id || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openConfirmDelete(user.id)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
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
        </motion.div>
      )}
    </div>
  );
};

export default UsersPage;