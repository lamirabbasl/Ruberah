import React from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";

function BankAccountCard({ account, confirmDeleteBankAccount, setEditingBankAccount, setShowEditForm }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-gray-900">{account.display_name}</h3>
      <p className="text-sm text-gray-600 mt-2">بانک: {account.bank_name}</p>
      <p className="text-sm text-gray-600">شبا: {account.iban}</p>
      <p className="text-sm text-gray-600">شماره حساب: {account.account_number}</p>
      <p className="text-sm text-gray-600">شماره کارت: {account.card_number}</p>
      <p className="text-sm text-gray-600">وضعیت: {account.is_active ? "فعال" : "غیرفعال"}</p>
      <div className="flex justify-end space-x-2 mt-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setEditingBankAccount(account);
            setShowEditForm(true);
          }}
          className="text-indigo-600 hover:text-indigo-800"
        >
          <FaEdit className="h-5 w-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => confirmDeleteBankAccount(account)}
          className="text-red-600 hover:text-red-800"
        >
          <FaTrash className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default BankAccountCard;