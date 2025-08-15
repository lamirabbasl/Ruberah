import React from "react";
import { motion } from "framer-motion";
import BankAccountCard from "./BankAccountCard";

function BankAccountList({
  bankAccounts,
  loading,
  searchTerm,
  confirmDeleteBankAccount,
  setEditingBankAccount,
  setShowEditForm,
}) {
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-t-indigo-600 border-gray-200 rounded-full"
          ></motion.div>
        </div>
      ) : bankAccounts.length === 0 && searchTerm ? (
        <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">
          هیچ حساب بانکی با نام "{searchTerm}" یافت نشد.
        </p>
      ) : bankAccounts.length === 0 ? (
        <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">هیچ حساب بانکی یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bankAccounts.map((account) => (
            <BankAccountCard
              key={account.id}
              account={account}
              confirmDeleteBankAccount={confirmDeleteBankAccount}
              setEditingBankAccount={setEditingBankAccount}
              setShowEditForm={setShowEditForm}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default BankAccountList;