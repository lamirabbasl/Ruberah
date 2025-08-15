"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getBankAccounts,
  addBankAccounts,
  editBankAccount,
  deleteBankAccount,
  searchBankAccount,
} from "@/lib/api/api";

import SearchBar from "@/components/admin/bank/SearchBar";
import AddBankAccountModal from "@/components/admin/bank/AddBankAccountModal";
import EditBankAccountModal from "@/components/admin/bank/EditBankAccountModal";
import DeleteConfirmModal from "@/components/admin/bank/DeleteConfirmModal";
import BankAccountList from "@/components/admin/bank/BankAccountList";

const BankAccountsTab = () => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newBankAccount, setNewBankAccount] = useState({
    display_name: "",
    bank_name: "",
    iban: "",
    account_number: "",
    card_number: "",
    is_active: true,
  });
  const [editingBankAccount, setEditingBankAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBankAccounts = useCallback(async (search = "") => {
    setLoading(true);
    try {
      const data = search ? await searchBankAccount(search) : await getBankAccounts();
      setBankAccounts(data);
    } catch (err) {
      console.error("Error fetching bank accounts:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطا در دریافت حساب‌های بانکی. لطفا دوباره تلاش کنید.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBankAccounts(searchTerm);
  }, [searchTerm, fetchBankAccounts]);

  const handleAddBankAccount = async () => {
    if (
      !newBankAccount.display_name.trim() ||
      !newBankAccount.bank_name.trim() ||
      !newBankAccount.iban.trim() ||
      !newBankAccount.account_number.trim() ||
      !newBankAccount.card_number.trim()
    ) {
      toast.error("تمام فیلدها باید پر شوند");
      return;
    }

    try {
      await addBankAccounts(newBankAccount);
      toast.success("حساب بانکی با موفقیت افزوده شد");
      setNewBankAccount({
        display_name: "",
        bank_name: "",
        iban: "",
        account_number: "",
        card_number: "",
        is_active: true,
      });
      setShowAddForm(false);
      fetchBankAccounts(searchTerm);
    } catch (err) {
      console.error("Error adding bank account:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطا در افزودن حساب بانکی";
      toast.error(errorMessage);
    }
  };

  const handleEditBankAccount = async () => {
    if (
      !editingBankAccount.display_name.trim() ||
      !editingBankAccount.bank_name.trim() ||
      !editingBankAccount.iban.trim() ||
      !editingBankAccount.account_number.trim() ||
      !editingBankAccount.card_number.trim()
    ) {
      toast.error("تمام فیلدها باید پر شوند");
      return;
    }

    try {
      await editBankAccount(editingBankAccount.id, {
        display_name: editingBankAccount.display_name,
        bank_name: editingBankAccount.bank_name,
        iban: editingBankAccount.iban,
        account_number: editingBankAccount.account_number,
        card_number: editingBankAccount.card_number,
        is_active: editingBankAccount.is_active,
      });
      toast.success("حساب بانکی با موفقیت ویرایش شد");
      setShowEditForm(false);
      setEditingBankAccount(null);
      fetchBankAccounts(searchTerm);
    } catch (err) {
      console.error("Error editing bank account:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطا در ویرایش حساب بانکی";
      toast.error(errorMessage);
    }
  };

  const confirmDeleteBankAccount = (account) => {
    setAccountToDelete(account);
    setShowDeleteConfirm(true);
  };

  const handleDeleteBankAccount = async () => {
    if (!accountToDelete) return;

    try {
      await deleteBankAccount(accountToDelete.id);
      toast.success("حساب بانکی با موفقیت حذف شد");
      setShowDeleteConfirm(false);
      setAccountToDelete(null);
      fetchBankAccounts(searchTerm);
    } catch (err) {
      console.error("Error deleting bank account:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطا در حذف حساب بانکی";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-mitra">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">مدیریت حساب‌های بانکی</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 text-sm font-medium"
        >
          افزودن حساب بانکی جدید
        </motion.button>
      </div>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <AddBankAccountModal
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        newBankAccount={newBankAccount}
        setNewBankAccount={setNewBankAccount}
        handleAddBankAccount={handleAddBankAccount}
      />

      <EditBankAccountModal
        showEditForm={showEditForm}
        setShowEditForm={setShowEditForm}
        editingBankAccount={editingBankAccount}
        setEditingBankAccount={setEditingBankAccount}
        handleEditBankAccount={handleEditBankAccount}
      />

      <DeleteConfirmModal
        showDeleteConfirm={showDeleteConfirm}
        accountToDelete={accountToDelete}
        cancelDelete={() => {
          setShowDeleteConfirm(false);
          setAccountToDelete(null);
        }}
        handleDeleteBankAccount={handleDeleteBankAccount}
      />

      <BankAccountList
        bankAccounts={bankAccounts}
        loading={loading}
        searchTerm={searchTerm}
        confirmDeleteBankAccount={confirmDeleteBankAccount}
        setEditingBankAccount={setEditingBankAccount}
        setShowEditForm={setShowEditForm}
      />
    </div>
  );
};

export default BankAccountsTab;