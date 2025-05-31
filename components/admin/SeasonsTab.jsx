"use client";
import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { getSeasons, addSeason, deleteSeason } from "@/lib/api/api";

const SeasonsTab = () => {
  const [seasons, setSeasons] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSeason, setNewSeason] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [seasonToDelete, setSeasonToDelete] = useState(null);

  const fetchSeasons = async () => {
    setLoading(true);
    try {
      const data = await getSeasons();
      setSeasons(data);
    } catch (err) {
      setError("خطا در دریافت فصل‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  const handleAddSeason = async () => {
    if (
      !newSeason.name.trim() ||
      !newSeason.start_date ||
      !newSeason.end_date
    ) {
      setError("تمام فیلدها باید پر شوند");
      return;
    }
    setError(null);
    try {
      await addSeason(newSeason);
      setNewSeason({ name: "", start_date: "", end_date: "" });
      setShowAddForm(false);
      fetchSeasons();
    } catch (err) {
      setError("خطا در افزودن فصل");
    }
  };

  const confirmDeleteSeason = (season) => {
    setSeasonToDelete(season);
    setShowDeleteConfirm(true);
  };

  const handleDeleteSeason = async () => {
    if (!seasonToDelete) return;
    try {
      await deleteSeason(seasonToDelete.id);
      setShowDeleteConfirm(false);
      setSeasonToDelete(null);
      fetchSeasons();
    } catch (err) {
      setError("خطا در حذف فصل");
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSeasonToDelete(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">فصل‌ها</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          افزودن فصل
        </button>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-2 left-2 text-gray-600 hover:text-gray-900"
              aria-label="بستن فرم افزودن فصل"
            >
              ✕
            </button>
            <div className="mb-4">
              <label className="block mb-1">نام فصل</label>
              <input
                type="text"
                value={newSeason.name}
                onChange={(e) =>
                  setNewSeason({ ...newSeason, name: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">تاریخ شروع</label>
              <input
                type="date"
                value={newSeason.start_date}
                onChange={(e) =>
                  setNewSeason({ ...newSeason, start_date: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">تاریخ پایان</label>
              <input
                type="date"
                value={newSeason.end_date}
                onChange={(e) =>
                  setNewSeason({ ...newSeason, end_date: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <button
              onClick={handleAddSeason}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              ذخیره
            </button>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 relative">
            <button
              onClick={cancelDelete}
              className="absolute top-2 left-2 text-gray-600 hover:text-gray-900"
              aria-label="بستن تایید حذف"
            >
              <IoClose size={24} />
            </button>
            <p className="mb-4 text-red-600 font-semibold">
              آیا از حذف فصل "{seasonToDelete?.name}" مطمئن هستید؟
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
              >
                لغو
              </button>
              <button
                onClick={handleDeleteSeason}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : seasons.length === 0 ? (
        <p>هیچ فصلی یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {seasons.map((season) => (
            <div
              key={season.id}
              className="relative border rounded p-4 shadow hover:shadow-lg transition bg-white"
            >
              <button
                onClick={() => confirmDeleteSeason(season)}
                className="absolute top-2 left-2 text-red-600 hover:text-red-900"
                aria-label={`حذف فصل ${season.name}`}
              >
                <IoClose size={20} />
              </button>
              <h3 className="text-lg font-semibold">{season.name}</h3>
              <p className="text-gray-700 mt-1">
                {season.start_date} - {season.end_date}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeasonsTab;
