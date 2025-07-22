"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import BatchRegistration from "./BatchRegistration";

const BatchListRegistration = ({ batches, courses, seasons, searchTerm }) => {

  if (batches.length === 0 && searchTerm) { 
    return (
      <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">
        هیچ دوره‌ای با عنوان "{searchTerm}" یافت نشد.
      </p>
    );
  }

  if (batches.length === 0) { 
    return (
      <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">
        هیچ دوره‌ای یافت نشد.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {batches.map((batch) => (
          <BatchRegistration
            key={batch.id}
            batch={batch}
            courses={courses}
            seasons={seasons}
  
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default BatchListRegistration;