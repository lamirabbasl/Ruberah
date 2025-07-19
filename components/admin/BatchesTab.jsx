"use client";

import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import { motion } from "framer-motion";
import {
  getBatches,
  addBatch,
  editBatch,
  deleteBatch,
  getCourses,
  getSeasons,
  searchBatches, // Import the new search function
} from "@/lib/api/api";

// Import the new components
import BatchCard from "./batches/BatchCard"; // Note: This will be used indirectly via BatchList
import BatchForm from "./batches/BatchForm";
import BatchModal from "./batches/BatchModal";
import BatchSearch from "./batches/BatchSearch";
import BatchList from "./batches/BatchList";
import BatchHeader from "./batches/BatchHeader";
import DeleteConfirmModal from "./batches/DeleteConfirmModal";
import { validateBatch } from "./batches/BatchValidation";

const BatchesTab = () => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
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
    price_installment: "",
    installment_count: 0,
    colleague_discount_percent: 0,
    loyalty_discount_percent: 0,
  });
  const [editingBatch, setEditingBatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // This will directly control the search
  const [formErrors, setFormErrors] = useState({});

  // Modified fetchBatches to accept a search term
  const fetchBatches = useCallback(async (term = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = term ? await searchBatches(term) : await getBatches();
      setBatches(data);
    } catch (err) {
      console.error("Error fetching batches:", err);
      setError("خطا در دریافت دوره‌ها. لطفا دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  // Initial fetch and re-fetch on searchTerm changes
  useEffect(() => {
    fetchBatches(searchTerm); // Trigger fetch immediately on searchTerm change
  }, [searchTerm, fetchBatches]); // Depend on searchTerm and fetchBatches

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

  // Fetch courses and seasons only once on component mount
  useEffect(() => {
    fetchCourses();
    fetchSeasons();
  }, []);

  const handleAddBatch = async () => {
    const errors = validateBatch(newBatch);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setError("لطفا تمام فیلدهای ضروری را پر کنید");
      return;
    }

    setError(null);
    setFormErrors({});
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
        price_installment: "",
        installment_count: 0,
        colleague_discount_percent: 0,
        loyalty_discount_percent: 0,
      });
      setShowAddForm(false);
      fetchBatches(searchTerm); // Refresh batches, maintaining current search
    } catch (err) {
      setError("خطا در افزودن دوره");
    }
  };

  const handleEditBatch = async () => {
    const errors = validateBatch(editingBatch);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setError("لطفا تمام فیلدهای ضروری را پر کنید");
      return;
    }

    setError(null);
    setFormErrors({});
    try {
      await editBatch(editingBatch.id, {
        title: editingBatch.title,
        course: editingBatch.course,
        season: editingBatch.season,
        min_age: editingBatch.min_age,
        max_age: editingBatch.max_age,
        schedule: editingBatch.schedule,
        location: editingBatch.location,
        capacity: editingBatch.capacity,
        allow_gateway: editingBatch.allow_gateway,
        allow_receipt: editingBatch.allow_receipt,
        allow_installment: editingBatch.allow_installment,
        price_gateway: editingBatch.price_gateway,
        price_receipt: editingBatch.price_receipt,
        price_installment: editingBatch.price_installment,
        installment_count: editingBatch.installment_count,
        colleague_discount_percent: editingBatch.colleague_discount_percent,
        loyalty_discount_percent: editingBatch.loyalty_discount_percent,
      });
      setShowEditForm(false);
      setEditingBatch(null);
      fetchBatches(searchTerm); // Refresh batches, maintaining current search
    } catch (err) {
      setError("خطا در ویرایش دوره");
    }
  };

  const confirmDeleteBatch = (batch) => {
    setBatchToDelete(batch);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setBatchToDelete(null);
  };

  const handleDeleteBatch = async () => {
    if (!batchToDelete) return;
    try {
      await deleteBatch(batchToDelete.id);
      setShowDeleteConfirm(false);
      setBatchToDelete(null);
      fetchBatches(searchTerm); // Refresh batches, maintaining current search
    } catch (err) {
      setError("خطا در حذف دوره");
    }
  };

  const handleEditClick = (batch) => {
    setEditingBatch({
      id: batch.id,
      title: batch.title,
      course: batch.course,
      season: batch.season,
      min_age: batch.min_age,
      max_age: batch.max_age,
      schedule: batch.schedule,
      location: batch.location,
      capacity: batch.capacity,
      allow_gateway: batch.allow_gateway,
      allow_receipt: batch.allow_receipt,
      allow_installment: batch.allow_installment,
      price_gateway: batch.price_gateway,
      price_receipt: batch.price_receipt,
      price_installment: batch.price_installment,
      installment_count: batch.installment_count,
      colleague_discount_percent: batch.colleague_discount_percent,
      loyalty_discount_percent: batch.loyalty_discount_percent,
    });
    setShowEditForm(true);
  };

  // filteredBatches is no longer needed here, BatchList will directly display 'batches'
  // which are already filtered by the API call based on 'searchTerm'

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-mitra">
      <BatchHeader onAddClick={() => setShowAddForm(true)} />

      <BatchSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm} // Direct update, no debounce
      />

      <BatchModal
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setFormErrors({});
          setError(null);
        }}
      >
        <BatchForm
          formData={newBatch}
          onChange={setNewBatch}
          onSubmit={handleAddBatch}
          onCancel={() => setShowAddForm(false)}
          courses={courses}
          seasons={seasons}
          errors={formErrors}
          isEdit={false}
        />
      </BatchModal>

      <BatchModal
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false);
          setEditingBatch(null);
          setFormErrors({});
          setError(null);
        }}
      >
        <BatchForm
          formData={editingBatch || {}}
          onChange={setEditingBatch}
          onSubmit={handleEditBatch}
          onCancel={() => {
            setShowEditForm(false);
            setEditingBatch(null);
          }}
          courses={courses}
          seasons={seasons}
          errors={formErrors}
          isEdit={true}
        />
      </BatchModal>

      <BatchModal
        isOpen={showDeleteConfirm}
        onClose={cancelDelete}
      >
        <DeleteConfirmModal
          isOpen={showDeleteConfirm}
          onClose={cancelDelete}
          onConfirm={handleDeleteBatch}
          batchTitle={batchToDelete?.title || ""}
        />
      </BatchModal>

      {error && (
        <p className="text-center text-red-600 font-medium bg-red-50 p-4 rounded-lg mb-4">{error}</p>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-t-indigo-600 border-gray-200 rounded-full"
          ></motion.div>
        </div>
      ) : (
        <BatchList
          batches={batches} // Pass the directly fetched batches (which are already filtered)
          courses={courses}
          seasons={seasons}
          onEdit={handleEditClick}
          onDelete={confirmDeleteBatch}
          searchTerm={searchTerm} // Keep passing searchTerm for the "No results" message
        />
      )}
    </div>
  );
};

export default BatchesTab;