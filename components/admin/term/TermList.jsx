import React from "react";
import { motion } from "framer-motion";
import TermCard from "./TermCard";

function TermList({
  terms,
  loading,
  searchTerm,
  confirmDeleteTerm,
  setEditingTerm,
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
      ) : terms.length === 0 && searchTerm ? (
        <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">
          هیچ شرایطی با عنوان "{searchTerm}" یافت نشد.
        </p>
      ) : terms.length === 0 ? (
        <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">هیچ شرایطی یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {terms.map((term) => (
            <TermCard
              key={term.id}
              term={term}
              confirmDeleteTerm={confirmDeleteTerm}
              setEditingTerm={setEditingTerm}
              setShowEditForm={setShowEditForm}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default TermList;