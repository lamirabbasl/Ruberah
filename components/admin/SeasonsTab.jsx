"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { getSeasons, addSeason, editSeason, deleteSeason, searchSeasons } from "@/lib/api/api";
import SearchBar from "@/components/admin/season/SearchBar";
import AddSeasonModal from "@/components/admin/season/AddSeasonModal";
import EditSeasonModal from "@/components/admin/season/EditSeasonModal";
import DeleteConfirmModal from "@/components/admin/season/DeleteConfirmModal";
import SeasonList from "@/components/admin/season/SeasonList";

const SeasonsTab = () => {
  const [seasons, setSeasons] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newSeason, setNewSeason] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });
  const [editingSeason, setEditingSeason] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [seasonToDelete, setSeasonToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSeasons = useCallback(async (name = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = name ? await searchSeasons(name) : await getSeasons();
      setSeasons(data);
    } catch (err) {
      console.error("Error fetching seasons:", err);
      setError("خطا در دریافت فصل‌ها. لطفا دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeasons(searchTerm);
  }, [searchTerm, fetchSeasons]);

  const handleAddSeason = async () => {
    if (!newSeason.name.trim() || !newSeason.start_date || !newSeason.end_date) {
      setError("تمام فیلدها باید پر شوند");
      return;
    }
    setError(null);
    try {
      await addSeason(newSeason);
      setNewSeason({ name: "", start_date: "", end_date: "" });
      setShowAddForm(false);
      fetchSeasons(searchTerm);
    } catch (err) {
      console.error("Error adding season:", err);
      setError("خطا در افزودن فصل");
    }
  };

  const handleEditSeason = async () => {
    if (!editingSeason.name.trim() || !editingSeason.start_date || !editingSeason.end_date) {
      setError("تمام فیلدها باید پر شوند");
      return;
    }
    setError(null);
    try {
      await editSeason(editingSeason.id, {
        name: editingSeason.name,
        start_date: editingSeason.start_date,
        end_date: editingSeason.end_date,
      });
      setShowEditForm(false);
      setEditingSeason(null);
      fetchSeasons(searchTerm);
    } catch (err) {
      console.error("Error editing season:", err);
      setError("خطا در ویرایش فصل");
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
      fetchSeasons(searchTerm);
    } catch (err) {
      console.error("Error deleting season:", err);
      setError("خطا در حذف فصل");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-mitra">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">مدیریت فصل‌ها</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 text-sm font-medium"
        >
          افزودن فصل جدید
        </motion.button>
      </div>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <AddSeasonModal
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        newSeason={newSeason}
        setNewSeason={setNewSeason}
        error={error}
        setError={setError}
        handleAddSeason={handleAddSeason}
      />
      <EditSeasonModal
        showEditForm={showEditForm}
        setShowEditForm={setShowEditForm}
        editingSeason={editingSeason}
        setEditingSeason={setEditingSeason}
        error={error}
        setError={setError}
        handleEditSeason={handleEditSeason}
      />
      <DeleteConfirmModal
        showDeleteConfirm={showDeleteConfirm}
        seasonToDelete={seasonToDelete}
        cancelDelete={() => {
          setShowDeleteConfirm(false);
          setSeasonToDelete(null);
        }}
        handleDeleteSeason={handleDeleteSeason}
      />
      <SeasonList
        seasons={seasons}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
        confirmDeleteSeason={confirmDeleteSeason}
        setEditingSeason={setEditingSeason}
        setShowEditForm={setShowEditForm}
      />
    </div>
  );
};

export default SeasonsTab;