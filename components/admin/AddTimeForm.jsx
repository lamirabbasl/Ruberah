import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle } from "lucide-react";

const AddTimeForm = ({ onSave, onCancel }) => {
  const [newTime, setNewTime] = useState({
    زمان_معارفه: "",
    ساعت: "12",
    دقیقه: "00",
    amPm: "AM",
  });
  const [isAmPmOpen, setIsAmPmOpen] = useState(false);
  const amPmRef = useRef(null);
  const [jalaliDateInput, setJalaliDateInput] = useState(""); // State for Jalali input

  const handleJalaliDateChange = (e) => {
    const jalaliValue = e.target.value;
    setJalaliDateInput(jalaliValue); // Store the raw input
    setNewTime((prevTime) => ({ ...prevTime, زمان_معارفه: jalaliValue }));
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "ساعت") {
      newValue = Math.max(1, Math.min(12, parseInt(value, 10) || 1)).toString();
    } else if (name === "دقیقه") {
      newValue = Math.max(0, Math.min(59, parseInt(value, 10) || 0)).toString();
    }

    setNewTime((prevTime) => ({ ...prevTime, [name]: newValue }));
  };

  const handleAmPmChange = (value) => {
    setNewTime((prevTime) => ({ ...prevTime, amPm: value }));
    setIsAmPmOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedTime = `${newTime.ساعت}:${newTime.دقیقه} ${newTime.amPm}`;
    onSave({
      زمان_معارفه: jalaliDateInput,
      ساعت: formattedTime,
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (amPmRef.current && !amPmRef.current.contains(event.target)) {
        setIsAmPmOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
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
      className="fixed inset-0 flex items-center justify-center z-50"
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
          افزودن آیتم جدید
        </h2>
        <div className="mb-4">
          <label
            htmlFor="زمان_معارفه"
            className="block text-gray-700 text-sm font-bold mb-2 text-right"
          >
            زمان معارفه:
          </label>
          <input
            type="text"
            id="زمان_معارفه"
            name="زمان_معارفه"
            value={jalaliDateInput}
            onChange={handleJalaliDateChange}
            placeholder="روز/ماه/سال"
            className="appearance-none border text-left rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  bg-gray-50 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6 flex flex-row-reverse items-center justify-between">
          <label
            htmlFor="ساعت"
            className="block text-gray-700 text-sm font-bold mb-2 text-right"
          >
            : ساعت
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="ساعت"
              name="ساعت"
              value={newTime.ساعت}
              onChange={handleTimeChange}
              min="1"
              max="12"
              className="appearance-none border rounded-md w-20 py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right bg-gray-50 focus:ring-2 focus:ring-blue-500"
              required
            />
            <span>:</span>
            <input
              type="number"
              id="دقیقه"
              name="دقیقه"
              value={newTime.دقیقه}
              onChange={handleTimeChange}
              min="0"
              max="59"
              className="appearance-none border rounded-md w-20 py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right bg-gray-50 focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="relative inline-block" ref={amPmRef}>
              <button
                type="button"
                onClick={() => setIsAmPmOpen(!isAmPmOpen)}
                className="appearance-none border rounded-md w-24 py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right bg-gray-50 focus:ring-2 focus:ring-blue-500 flex items-center justify-between z-20"
                aria-haspopup="true"
                aria-expanded={isAmPmOpen}
              >
                {newTime.amPm}
                <ChevronDown className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {isAmPmOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-black opacity-100 focus:outline-none z-30"
                    role="listbox"
                    aria-labelledby="am-pm-select"
                    style={{ zIndex: 30 }}
                  >
                    <div className="py-1" role="presentation">
                      <button
                        type="button"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-right"
                        role="option"
                        onClick={() => handleAmPmChange("AM")}
                      >
                        AM
                      </button>
                      <button
                        type="button"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-right"
                        role="option"
                        onClick={() => handleAmPmChange("PM")}
                      >
                        PM
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 z-10"
          >
            انصراف
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 z-10 flex items-center"
          >
            ذخیره
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default AddTimeForm;
