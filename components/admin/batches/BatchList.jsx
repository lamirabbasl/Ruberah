"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import BatchCard from "./BatchCard";
import { cardVariants } from "./BatchAnimations";

const BatchList = ({ batches, courses, seasons, onEdit, onDelete, searchTerm }) => {
  // Removed internal filtering logic as batches prop now comes pre-filtered from API

  if (batches.length === 0 && searchTerm) { // Check searchTerm to differentiate "no results for search" vs "no batches at all"
    return (
      <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">
        هیچ دوره‌ای با عنوان "{searchTerm}" یافت نشد.
      </p>
    );
  }

  if (batches.length === 0) { // If no batches and no search term, means no batches exist
    return (
      <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">
        هیچ دوره‌ای یافت نشد.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {batches.map((batch) => ( // Render 'batches' directly
          <BatchCard
            key={batch.id}
            batch={batch}
            courses={courses}
            seasons={seasons}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default BatchList;