"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AddUserForm from "@/components/admin/AddUserForm";
import { getUsers, addUser, deleteUser, getUsersExport, patchUser } from "@/lib/api/api";
import SearchBar from "@/components/admin/users/SearchBar";
import ActionButtons from "@/components/admin/users/ActionButtons";
import ConfirmDeleteModal from "@/components/admin/users/ConfirmDeleteModal";
import UsersTable from "@/components/admin/users/UsersTable";
import Pagination from "@/components/admin/users/Pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(new Set());
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupFilter, setGroupFilter] = useState(""); // New state for group filter
  const [exporting, setExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers(currentPage, searchTerm, groupFilter); // Pass groupFilter to getUsers
      setUsers(data.results);
      setIsLastPage(data.is_last_page);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "خطا در دریافت کاربران";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, groupFilter]); // Add groupFilter to dependencies

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
      const blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "users_export.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("فایل اکسل با موفقیت دریافت شد.");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "خطا در دریافت اکسل";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setExporting(false);
    }
  };

  const handleSaveNewUser = async (newUser) => {
    setLoading(true);
    setError(null);
    try {
      const response = await addUser(newUser);
      const successMessage = response.data?.message || "کاربر با موفقیت اضافه شد.";
      toast.success(successMessage);
      setShowAddForm(false);
      setCurrentPage(1);
      await fetchUsers();
    } catch (err) {
      if (err.response?.data) {
        const errorData = err.response.data;
        Object.keys(errorData).forEach((field) => {
          if (Array.isArray(errorData[field])) {
            errorData[field].forEach((message) => {
              toast.error(message);
            });
          } else {
            toast.error(errorData[field]);
          }
        });
      } else {
        const errorMessage = err.response?.data?.message || "خطا در افزودن کاربر";
        toast.error(errorMessage);
      }
      setError("خطا در افزودن کاربر");
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
      const successMessage = "کاربر با موفقیت حذف شد.";
      toast.success(successMessage);
      setShowConfirmDelete(false);
      setUserToDelete(null);
      await fetchUsers();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "خطا در حذف کاربر";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleColleague = async (id, currentStatus) => {
    setLoadingUsers((prev) => new Set(prev).add(id));
    setError(null);
    try {
      const formData = { is_colleague: !currentStatus };
      await patchUser(id, formData);
      toast.success("وضعیت همکار با موفقیت به‌روزرسانی شد.");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, is_colleague: !currentStatus } : user
        )
      );
    } catch (err) {
      const errorMessage = err.response?.data?.message || "خطا در به‌روزرسانی وضعیت همکار";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoadingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleGroupFilterChange = (group) => {
    setGroupFilter(group);
    setCurrentPage(1); // Reset to first page when group filter changes
  };

  return (
    <div className="p-6 bg-gradient-to-b text-black from-gray-50 w-5/6 max-md:w-screen to-gray-100 min-h-screen font-mitra text-right" dir="rtl">
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
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">مدیریت کاربران</h1>
        <ActionButtons handleAddUser={handleAddUser} handleExportExcel={handleExportExcel} exporting={exporting} />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />
        <div className="flex items-center mt-1   h-10 gap-2">
          <button
            onClick={() => handleGroupFilterChange(groupFilter === "manager" ? "" : "manager")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              groupFilter === "manager" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            مدیران
          </button>
          <button
            onClick={() => handleGroupFilterChange(groupFilter === "parent" ? "" : "parent")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              groupFilter === "parent" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            والدین
          </button>
        </div>
      </div>
      {showAddForm && <AddUserForm onSave={handleSaveNewUser} onCancel={handleCancelAdd} />}
      <ConfirmDeleteModal
        showConfirmDelete={showConfirmDelete}
        closeConfirmDelete={closeConfirmDelete}
        handleDeleteUser={handleDeleteUser}
        error={error}
        loading={loading}
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
      {users.length === 0 && !loading && searchTerm === "" && groupFilter === "" ? (
        <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">هیچ کاربری وجود ندارد</p>
      ) : users.length === 0 && !loading && (searchTerm !== "" || groupFilter !== "") ? (
        <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">هیچ کاربری با این مشخصات یافت نشد.</p>
      ) : (
        <>
          <UsersTable
            users={users}
            openConfirmDelete={openConfirmDelete}
            onToggleColleague={handleToggleColleague}
            loadingUsers={loadingUsers}
          />
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