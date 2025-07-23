"use client";
import React, { useState, useEffect } from "react";
import AddUserForm from "@/components/admin/AddUserForm";
import { getUsers, addUser, deleteUser, getUsersExport } from "@/lib/api/api";
import SearchBar from "@/components/admin/users/SearchBar";
import ActionButtons from "@/components/admin/users/ActionButtons";
import ConfirmDeleteModal from "@/components/admin/users/ConfirmDeleteModal";
import UsersTable from "@/components/admin/users/UsersTable";
import Pagination from "@/components/admin/users/Pagination";
import { motion } from "framer-motion";


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
  }, [currentPage, searchTerm]);

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
      setCurrentPage(1);
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
    } catch (err) {
      setError(err.message || "خطا در حذف کاربر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b text-black from-gray-50 w-5/6 max-md:w-screen to-gray-100 min-h-screen font-mitra text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">مدیریت کاربران</h1>
        <ActionButtons handleAddUser={handleAddUser} handleExportExcel={handleExportExcel} exporting={exporting} />
      </div>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />
      {showAddForm && <AddUserForm onSave={handleSaveNewUser} onCancel={handleCancelAdd} />}
      <ConfirmDeleteModal
        showConfirmDelete={showConfirmDelete}
        closeConfirmDelete={closeConfirmDelete}
        handleDeleteUser={handleDeleteUser}
        error={error}
      />
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
        <>
          <UsersTable users={users} openConfirmDelete={openConfirmDelete} />
          <Pagination
            currentPage={currentPage}
            isLastPage={isLastPage}
            loading={loading}
            handlePreviousPage={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            handleNextPage={() => !isLastPage && setCurrentPage((prev) => prev + 1)}
          />
        </>
      )}
    </div>
  );
};

export default UsersPage;