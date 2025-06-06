"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Trash2, X } from "lucide-react";
import { getQuizQuestions, addQuizQuestion, deleteQuizQuestion } from "@/lib/api/api";

const AdminSignupQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [newQuiz, setNewQuiz] = useState({
    question_text: "",
    choices: ["", "", "", ""],
    correct_answer: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getQuizQuestions();
      setQuizzes(data);
    } catch (err) {
      setError(err.message || "خطا در دریافت سوالات");
    } finally {
      setLoading(false);
    }
  };

  const handleChoiceChange = (index, value) => {
    setNewQuiz((prev) => {
      const newChoices = [...prev.choices];
      newChoices[index] = value;
      return { ...prev, choices: newChoices };
    });
  };

  const handleAddQuiz = async () => {
    if (!newQuiz.question_text.trim()) {
      setError("لطفاً سوال را وارد کنید.");
      return;
    }
    if (newQuiz.choices.some((choice) => !choice.trim())) {
      setError("لطفاً هر چهار گزینه را وارد کنید.");
      return;
    }
    if (!newQuiz.correct_answer.trim()) {
      setError("لطفاً پاسخ صحیح را انتخاب کنید.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await addQuizQuestion(newQuiz);
      setNewQuiz({ question_text: "", choices: ["", "", "", ""], correct_answer: "" });
      setIsAddModalOpen(false);
      fetchQuizzes();
    } catch (err) {
      setError(err.message || "خطا در افزودن سوال");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveQuiz = (id, question_text) => {
    setQuizToDelete({ id, question_text });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!quizToDelete) return;
    setLoading(true);
    setError(null);
    try {
      await deleteQuizQuestion(quizToDelete.id);
      setQuizzes(quizzes.filter((quiz) => quiz.id !== quizToDelete.id));
      setIsDeleteModalOpen(false);
      setQuizToDelete(null);
    } catch (err) {
      setError(err.message || "خطا در حذف سوال");
    } finally {
      setLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-mitra text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          سوالات فرآیند ثبت‌نام
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2 w-full sm:w-auto"
        >
          <PlusCircle className="w-5 h-5" />
          افزودن سوال
        </motion.button>
      </div>

      {loading && <p className="text-center text-gray-600">در حال بارگذاری...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition"
                aria-label="بستن فرم افزودن سوال"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6 text-right">
                افزودن سوال جدید
              </h2>
              <div className="mb-5">
                <label
                  htmlFor="question"
                  className="block mb-2 text-sm font-medium text-gray-700 text-right"
                >
                  سوال
                </label>
                <input
                  type="text"
                  id="question"
                  value={newQuiz.question_text}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, question_text: e.target.value })
                  }
                  placeholder="سوال"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-right"
                />
              </div>
              {newQuiz.choices.map((choice, i) => (
                <div key={i} className="mb-3 flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={newQuiz.correct_answer === choice}
                    onChange={() =>
                      setNewQuiz((prev) => ({
                        ...prev,
                        correct_answer: choice,
                      }))
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <input
                    type="text"
                    value={choice}
                    onChange={(e) => handleChoiceChange(i, e.target.value)}
                    placeholder={`گزینه ${i + 1}`}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-right"
                  />
                </div>
              ))}
              {error && <p className="text-red-500 text-sm mb-4 text-right">{error}</p>}
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  لغو
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddQuiz}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-white ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                  } transition`}
                >
                  افزودن
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-sm relative"
            >
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition"
                aria-label="بستن تایید حذف"
              >
                <X size={20} />
              </button>
              <p className="mb-6 text-red-600 font-semibold text-center text-right">
                آیا مطمئن هستید که می‌خواهید سوال "{quizToDelete?.question_text}" را حذف کنید؟
              </p>
              {error && <p className="text-red-500 text-sm mb-4 text-right">{error}</p>}
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  لغو
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  حذف
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {quizzes.length === 0 && !loading ? (
        <p className="text-center text-gray-600">هیچ سوالی وجود ندارد</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {quizzes.map((quiz) => (
              <motion.div
                key={quiz.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="p-4 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800 text-right line-clamp-2">
                    {quiz.question_text}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRemoveQuiz(quiz.id, quiz.question_text)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="حذف سوال"
                    aria-label={`حذف سوال ${quiz.question_text}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
                <div className="p-4 pt-0">
                  <ul className="space-y-1 text-right">
                    {quiz.choices.map((choice, index) => (
                      <li
                        key={index}
                        className={`text-sm ${
                          choice === quiz.correct_answer
                            ? "text-green-600 font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        {choice}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AdminSignupQuiz;