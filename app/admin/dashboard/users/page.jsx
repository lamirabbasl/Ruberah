"use client";

import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";

import AddUserForm from "@/components/admin/AddUserForm";
import { getUsers, addUser, deleteUser, getUsersExport } from "@/lib/api/api";
import { getToken } from "@/lib/utils/token";

const UsersPage = () => {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [exporting, setExporting] = React.useState(false);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Error fetching users");
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
      // Request the file as blob
      const token = getToken()
      const response = await fetch("/api/proxy/courses/manage/export/registrations/summary/", {
        method: "GET",
        headers: {
         "Authorization": token
       
     } });
      if (!response.ok) {
        throw new Error("Failed to export Excel");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "users_export.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Error exporting Excel");
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
      setError(err.message || "Error adding user");
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
      setError(err.message || "Error deleting user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-md:w-screen w-5/6 min-h-screen bg-white text-black p-6 text-right">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <button
          onClick={handleAddUser}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center mb-4 sm:mb-0"
        >
          <FaPlus className="mr-2" />
          افزودن کاربر
        </button>
        <button
          onClick={handleExportExcel}
          disabled={exporting}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 sm:mb-0"
          type="button"
        >
          {exporting ? "در حال دانلود..." : "Export Excel"}
        </button>
        {showAddForm && (
          <AddUserForm onSave={handleSaveNewUser} onCancel={handleCancelAdd} />
        )}
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="جستجو بر اساس نام یا شماره تلفن"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      {loading && <p>در حال بارگذاری...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {users.length === 0 ? (
        <p className="text-gray-600">هیچ کاربری وجود ندارد</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">حذف</span>
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
                  آدرس
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
                  شماره تلفن
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  نام کاربری
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users
                .filter(
                  (user) =>
                    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (user.phone_number &&
                      user.phone_number.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-left">
                      <button
                        onClick={() => openConfirmDelete(user.id)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                        type="button"
                      >
                        <FaTrash />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {user.national_id || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {user.address || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {user.groups && user.groups.length > 0
                        ? user.groups.join(", ")
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {user.phone_number || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {user.username}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Dialog for Deletion */}
      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl relative border border-gray-300">
            <h2 className="text-lg font-semibold mb-4 text-right text-gray-800">
              آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟
            </h2>
            <div className="flex justify-between mt-4">
              <button
                onClick={closeConfirmDelete}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md"
              >
                لغو
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteUser();
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md"
                type="button"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
