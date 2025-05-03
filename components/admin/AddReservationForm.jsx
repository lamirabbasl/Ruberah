import React, { useState } from "react";
import { motion } from "framer-motion";

const AddReservationForm = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    "نام ونام خانوادگی": "",
    "نام فرزند": "",
    "زمان معارفه": "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      //reset form
      "نام ونام خانوادگی": "",
      "نام فرزند": "",
      "زمان معارفه": "",
    });
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }, // Slightly darker backdrop
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed inset-0  flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <motion.form
        variants={formVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl relative"
        style={{
          backdropFilter: "blur(12px)",
        }}
      >
        <h2 className="text-2xl font-semibold mb-6 text-right text-gray-800">
          افزودن معارفه
        </h2>
        <div className="mb-4">
          <label
            htmlFor="نام ونام خانوادگی"
            className="block text-gray-700 text-sm font-bold mb-2 text-right"
          >
            : نام و نام خانوادگی
          </label>
          <input
            type="text"
            id="نام ونام خانوادگی"
            name="نام ونام خانوادگی"
            value={formData["نام ونام خانوادگی"]}
            onChange={handleChange}
            className="appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right bg-gray-50 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="نام فرزند"
            className="block text-gray-700 text-sm font-bold mb-2 text-right"
          >
            : نام فرزند
          </label>
          <input
            type="text"
            id="نام فرزند"
            name="نام فرزند"
            value={formData["نام فرزند"]}
            onChange={handleChange}
            className="appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right bg-gray-50 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="زمان معارفه"
            className="block text-gray-700 text-sm font-bold mb-2 text-right"
          >
            : زمان معارفه
          </label>
          <input
            type="text"
            id="زمان معارفه"
            name="زمان معارفه"
            value={formData["زمان معارفه"]}
            onChange={handleChange}
            className="appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right bg-gray-50 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline  transition-colors duration-200 z-10" // Added z-10 and removed ml-2
          >
            انصراف
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 z-10" // Added z-10
          >
            ذخیره
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default AddReservationForm;
