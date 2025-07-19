"use client";

import { useState, useEffect, useCallback } from "react"; // Added useCallback
import { getBatches, addBatch, editBatch, deleteBatch, getCourses, getSeasons, searchBatches } from "@/lib/api/api"; // Imported searchBatches

export const useBatches = () => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modified fetchBatches to accept an optional searchTerm
  const fetchBatches = useCallback(async (term = "") => {
    setLoading(true);
    try {
      const data = term ? await searchBatches(term) : await getBatches();
      setBatches(data);
    } catch (err) {
      setError("خطا در دریافت دوره‌ها");
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

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

  const handleAddBatch = async (batchData) => {
    try {
      await addBatch(batchData);
      // After adding, we need to refresh based on the *current* search term
      // If this hook is used independently, it needs to manage its own searchTerm,
      // or receive it. For now, assuming it re-fetches all if no term is passed.
      await fetchBatches(); // Or fetchBatches(currentSearchTerm); if searchTerm is managed here.
      return { success: true };
    } catch (err) {
      return { success: false, error: "خطا در افزودن دوره" };
    }
  };

  const handleEditBatch = async (id, batchData) => {
    try {
      await editBatch(id, batchData);
      await fetchBatches(); // Refresh based on current search term
      return { success: true };
    } catch (err) {
      return { success: false, error: "خطا در ویرایش دوره" };
    }
  };

  const handleDeleteBatch = async (id) => {
    try {
      await deleteBatch(id);
      await fetchBatches(); // Refresh based on current search term
      return { success: true };
    } catch (err) {
      return { success: false, error: "خطا در حذف دوره" };
    }
  };

  useEffect(() => {
    fetchBatches(); // Initial fetch (no search term)
    fetchCourses();
    fetchSeasons();
  }, [fetchBatches]); // Add fetchBatches to dependency array as it's a useCallback

  return {
    batches,
    courses,
    seasons,
    loading,
    error,
    fetchBatches, // Expose fetchBatches so components can trigger it with a term
    handleAddBatch,
    handleEditBatch,
    handleDeleteBatch,
  };
};