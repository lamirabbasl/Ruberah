"use client";

import React, { useState, useEffect, useCallback } from "react"; 
import { motion } from "framer-motion";
import {
  getBatches,
  getCourses,
  getSeasons,
  searchBatches, 
} from "@/lib/api/api";

import BatchSearch from "../../../../components/admin/batches/BatchSearch";
import BatchListRegistration from "@/components/admin/BatchListRegistration";

const RegistrationsBatchesTab = () => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 

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
  }, []); 

  useEffect(() => {
    fetchBatches(searchTerm); 
  }, [searchTerm, fetchBatches]);

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

  useEffect(() => {
    fetchCourses();
    fetchSeasons();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-b text-black text-right w-5/6 max-md:w-screen from-gray-50 to-gray-100 min-h-screen font-mitra">
      <h1 className="text-4xl mb-10">دوره‌های آموزشی</h1>

      <BatchSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm} 
      />
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
        <BatchListRegistration
          batches={batches}
          courses={courses}
          seasons={seasons}
          searchTerm={searchTerm}
        />
      )}
    </div>
  );
};

export default RegistrationsBatchesTab;