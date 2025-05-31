"use client";
import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import {
  getBatches,
  addBatch,
  deleteBatch,
  getCourses,
  getSeasons,
} from "@/lib/api/api";

const BatchesTab = () => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBatch, setNewBatch] = useState({
    course: "",
    season: "",
    title: "",
    min_age: "",
    max_age: "",
    schedule: "",
    location: "",
    capacity: "",
    allow_gateway: false,
    allow_receipt: false,
    allow_installment: false,
    price_gateway: "",
    price_receipt: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const data = await getBatches();
      setBatches(data);
    } catch (err) {
      setError("خطا در دریافت بچه‌ها");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      setError("خطا در دریافت دوره‌ها");
    }
  };

  const fetchSeasons = async () => {
    try {
      const data = await getSeasons();
      setSeasons(data);
    } catch (err) {
      setError("خطا در دریافت فصل‌ها");
    }
  };

  useEffect(() => {
    fetchBatches();
    fetchCourses();
    fetchSeasons();
  }, []);

  const handleAddBatch = async () => {
    if (
      !newBatch.course ||
      !newBatch.season ||
      !newBatch.title.trim() ||
      !newBatch.min_age ||
      !newBatch.max_age ||
      !newBatch.location ||
      !newBatch.capacity
    ) {
      setError("لطفا تمام فیلدهای ضروری را پر کنید");
      return;
    }
    setError(null);
    try {
      await addBatch(newBatch);
      setNewBatch({
        course: "",
        season: "",
        title: "",
        min_age: "",
        max_age: "",
        schedule: "",
        location: "",
        capacity: "",
        allow_gateway: false,
        allow_receipt: false,
        allow_installment: false,
        price_gateway: "",
        price_receipt: "",
      });
      setShowAddForm(false);
      fetchBatches();
    } catch (err) {
      setError("خطا در افزودن بچه");
    }
  };

  const confirmDeleteBatch = (batch) => {
    setBatchToDelete(batch);
    setShowDeleteConfirm(true);
  };

  const handleDeleteBatch = async () => {
    if (!batchToDelete) return;
    try {
      await deleteBatch(batchToDelete.id);
      setShowDeleteConfirm(false);
      setBatchToDelete(null);
      fetchBatches();
    } catch (err) {
      setError("خطا در حذف بچه");
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setBatchToDelete(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">بچه‌های دوره</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          افزودن بچه
        </button>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-2 left-2 text-gray-600 hover:text-gray-900"
              aria-label="بستن فرم افزودن بچه"
            >
              ✕
            </button>
            <div className="mb-4">
              <label className="block mb-1">دوره</label>
              <select
                value={newBatch.course}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, course: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="">انتخاب دوره</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1">فصل</label>
              <select
                value={newBatch.season}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, season: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="">انتخاب فصل</option>
                {seasons.map((season) => (
                  <option key={season.id} value={season.id}>
                    {season.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1">عنوان</label>
              <input
                type="text"
                value={newBatch.title}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, title: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <label className="block mb-1">حداقل سن</label>
                <input
                  type="number"
                  value={newBatch.min_age}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, min_age: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1">حداکثر سن</label>
                <input
                  type="number"
                  value={newBatch.max_age}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, max_age: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-1">برنامه زمانی</label>
              <input
                type="text"
                value={newBatch.schedule}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, schedule: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">مکان</label>
              <input
                type="text"
                value={newBatch.location}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, location: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">ظرفیت</label>
              <input
                type="number"
                value={newBatch.capacity}
                onChange={(e) =>
                  setNewBatch({ ...newBatch, capacity: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex space-x-4 mb-4">
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newBatch.allow_gateway}
                  onChange={(e) =>
                    setNewBatch({
                      ...newBatch,
                      allow_gateway: e.target.checked,
                    })
                  }
                  id="allow_gateway"
                />
                <label htmlFor="allow_gateway">اجازه درگاه</label>
              </div>
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newBatch.allow_receipt}
                  onChange={(e) =>
                    setNewBatch({
                      ...newBatch,
                      allow_receipt: e.target.checked,
                    })
                  }
                  id="allow_receipt"
                />
                <label htmlFor="allow_receipt">اجازه رسید</label>
              </div>
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newBatch.allow_installment}
                  onChange={(e) =>
                    setNewBatch({
                      ...newBatch,
                      allow_installment: e.target.checked,
                    })
                  }
                  id="allow_installment"
                />
                <label htmlFor="allow_installment">اجازه اقساط</label>
              </div>
            </div>
            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <label className="block mb-1">قیمت درگاه</label>
                <input
                  type="number"
                  value={newBatch.price_gateway}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, price_gateway: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1">قیمت رسید</label>
                <input
                  type="number"
                  value={newBatch.price_receipt}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, price_receipt: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <button
              onClick={handleAddBatch}
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
              آیا از حذف بچه "{batchToDelete?.title}" مطمئن هستید؟
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
              >
                لغو
              </button>
              <button
                onClick={handleDeleteBatch}
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
      ) : batches.length === 0 ? (
        <p>هیچ بچه‌ای یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="relative border rounded p-4 shadow hover:shadow-lg transition bg-white"
            >
              <button
                onClick={() => confirmDeleteBatch(batch)}
                className="absolute top-2 left-2 text-red-600 hover:text-red-900"
                aria-label={`حذف بچه ${batch.title}`}
              >
                <IoClose size={20} />
              </button>
              <h3 className="text-lg font-semibold">{batch.title}</h3>
              <p className="text-gray-700 mt-1">
                دوره: {courses.find((c) => c.id === batch.course)?.name || ""}
              </p>
              <p className="text-gray-700 mt-1">
                فصل: {seasons.find((s) => s.id === batch.season)?.name || ""}
              </p>
              <p className="text-gray-700 mt-1">
                سن: {batch.min_age} - {batch.max_age}
              </p>
              <p className="text-gray-700 mt-1">برنامه: {batch.schedule}</p>
              <p className="text-gray-700 mt-1">مکان: {batch.location}</p>
              <p className="text-gray-700 mt-1">ظرفیت: {batch.capacity}</p>
              <p className="text-gray-700 mt-1">
                اجازه درگاه: {batch.allow_gateway ? "بله" : "خیر"}
              </p>
              <p className="text-gray-700 mt-1">
                اجازه رسید: {batch.allow_receipt ? "بله" : "خیر"}
              </p>
              <p className="text-gray-700 mt-1">
                اجازه اقساط: {batch.allow_installment ? "بله" : "خیر"}
              </p>
              <p className="text-gray-700 mt-1">
                قیمت درگاه: {batch.price_gateway || "-"}
              </p>
              <p className="text-gray-700 mt-1">
                قیمت رسید: {batch.price_receipt || "-"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BatchesTab;
