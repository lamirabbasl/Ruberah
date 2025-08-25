"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getTerms,
  addTrems,
  editTrems,
  deleteTerms,
  searchTerms,
} from "@/lib/api/api";

import SearchBar from "@/components/admin/term/SearchBar";
import AddTermModal from "@/components/admin/term/AddTermModal";
import EditTermModal from "@/components/admin/term/EditTermModal";
import DeleteConfirmModal from "@/components/admin/term/DeleteConfirmModal";
import TermList from "@/components/admin/term/TermList";

const TermsTab = () => {
  const [terms, setTerms] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newTerm, setNewTerm] = useState({
    title: "",
    body: "",
    is_active: true,
  });
  const [editingTerm, setEditingTerm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [termToDelete, setTermToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTerms = useCallback(async (search = "") => {
    setLoading(true);
    try {
      const data = search ? await searchTerms(search) : await getTerms();
      setTerms(data);
    } catch (err) {
      console.error("Error fetching terms:", err);
      const errorMessage = err.response?.data?.message || "خطا در دریافت شرایط. لطفا دوباره تلاش کنید.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTerms(searchTerm);
  }, [searchTerm, fetchTerms]);

  const handleAddTerm = async () => {
    if (!newTerm.title.trim() || !newTerm.body.trim()) {
      toast.error("تمام فیلدها باید پر شوند");
      return;
    }

    try {
      await addTrems(newTerm);
      toast.success("شرایط با موفقیت افزوده شد");
      setNewTerm({
        title: "",
        body: "",
        is_active: true,
      });
      setShowAddForm(false);
      fetchTerms(searchTerm);
    } catch (err) {
      console.error("Error adding term:", err);
      const errorMessage = err.response?.data?.message || "خطا در افزودن شرایط";
      toast.error(errorMessage);
    }
  };

  const handleEditTerm = async () => {
    if (!editingTerm.title.trim() || !editingTerm.body.trim()) {
      toast.error("تمام فیلدها باید پر شوند");
      return;
    }

    try {
      await editTrems(editingTerm.id, {
        title: editingTerm.title,
        body: editingTerm.body,
        is_active: editingTerm.is_active,
      });
      toast.success("شرایط با موفقیت ویرایش شد");
      setShowEditForm(false);
      setEditingTerm(null);
      fetchTerms(searchTerm);
    } catch (err) {
      console.error("Error editing term:", err);
      const errorMessage = err.response?.data?.message ||  "خطا در ویرایش شرایط";
      toast.error(errorMessage);
    }
  };

  const confirmDeleteTerm = (term) => {
    setTermToDelete(term);
    setShowDeleteConfirm(true);
  };

  const handleDeleteTerm = async () => {
    if (!termToDelete) return;

    try {
      await deleteTerms(termToDelete.id);
      toast.success("شرایط با موفقیت حذف شد");
      setShowDeleteConfirm(false);
      setTermToDelete(null);
      fetchTerms(searchTerm);
    } catch (err) {
      console.error("Error deleting term:", err);
      const errorMessage = err.response?.data?.message ||  "خطا در حذف شرایط";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-mitra">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">مدیریت آداب</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 text-sm font-medium"
        >
          افزودن شرایط جدید
        </motion.button>
      </div>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <AddTermModal
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        newTerm={newTerm}
        setNewTerm={setNewTerm}
        handleAddTerm={handleAddTerm}
      />

      <EditTermModal
        showEditForm={showEditForm}
        setShowEditForm={setShowEditForm}
        editingTerm={editingTerm}
        setEditingTerm={setEditingTerm}
        handleEditTerm={handleEditTerm}
      />

      <DeleteConfirmModal
        showDeleteConfirm={showDeleteConfirm}
        termToDelete={termToDelete}
        cancelDelete={() => {
          setShowDeleteConfirm(false);
          setTermToDelete(null);
        }}
        handleDeleteTerm={handleDeleteTerm}
      />

      <TermList
        terms={terms}
        loading={loading}
        searchTerm={searchTerm}
        confirmDeleteTerm={confirmDeleteTerm}
        setEditingTerm={setEditingTerm}
        setShowEditForm={setShowEditForm}
      />
    </div>
  );
};

export default TermsTab;