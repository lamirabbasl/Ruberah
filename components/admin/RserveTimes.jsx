"use client";

import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import AddTimeForm from "./AddTimeForm";
import { getSessions, addSession, deleteSession } from "@/lib/api/api";

const ReserveTimes = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      setError(err.message || "Error fetching sessions");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setShowAddForm(true);
  };

  const handleSaveNewItem = async (newItem) => {
    setLoading(true);
    setError(null);
    try {
      await addSession(newItem);
      setShowAddForm(false);
      await fetchSessions();
    } catch (err) {
      setError(err.message || "Error adding session");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  const openConfirmDelete = (id) => {
    setSessionToDelete(id);
    setShowConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setSessionToDelete(null);
    setShowConfirmDelete(false);
  };

  const handleRemoveItem = async () => {
    if (!sessionToDelete) return;
    setLoading(true);
    setError(null);
    try {
      await deleteSession(sessionToDelete);
      setShowConfirmDelete(false);
      setSessionToDelete(null);
      await fetchSessions();
    } catch (err) {
      setError(err.message || "Error deleting session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-md:w-screen min-h-screen bg-white text-black p-6 text-right">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <button
          onClick={handleAddItem}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center mb-4 sm:mb-0"
        >
          <FaPlus className="mr-2" />
          افزودن جلسه
        </button>
        {showAddForm && (
          <AddTimeForm
            onSave={handleSaveNewItem}
            onCancel={handleCancelAdd}
          />
        )}
      </div>

      {loading && <p>در حال بارگذاری...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {sessions.length === 0 ? (
        <p className="text-gray-600">هیچ جلسه‌ای وجود ندارد</p>
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
                  ظرفیت
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
                  زمان معارفه
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  عنوان
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <button
                      onClick={() => openConfirmDelete(session.id)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <FaTrash />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {session.capacity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {session.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {new Date(session.date_time).toLocaleString("fa-IR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {session.title}
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
              آیا مطمئن هستید که می‌خواهید این جلسه را حذف کنید؟
            </h2>
            <div className="flex justify-between mt-4">
              <button
                onClick={closeConfirmDelete}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md"
              >
                لغو
              </button>
              <button
                onClick={handleRemoveItem}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md"
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

export default ReserveTimes;
