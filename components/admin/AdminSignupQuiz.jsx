import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Trash2 } from "lucide-react";

// Mock quiz data for demonstration
const initialQuizzes = [
  {
    id: "1",
    question: "پایتخت ایران کجاست؟",
    answers: [
      { text: "تهران", isCorrect: true },
      { text: "اصفهان", isCorrect: false },
      { text: "شیراز", isCorrect: false },
      { text: "مشهد", isCorrect: false },
    ],
  },
  {
    id: "2",
    question: "بزرگترین اقیانوس جهان کدام است؟",
    answers: [
      { text: "آرام", isCorrect: true },
      { text: "اطلس", isCorrect: false },
      { text: "هند", isCorrect: false },
      { text: "منجمد شمالی", isCorrect: false },
    ],
  },
];

const AdminSignupQuiz = () => {
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [newQuiz, setNewQuiz] = useState({
    question: "",
    answers: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });

  const handleAnswerTextChange = (index, text) => {
    setNewQuiz((prev) => ({
      ...prev,
      answers: prev.answers.map((ans, i) =>
        i === index ? { ...ans, text } : ans
      ),
    }));
  };

  const handleCorrectAnswerChange = (index) => {
    setNewQuiz((prev) => ({
      ...prev,
      answers: prev.answers.map((ans, i) => ({
        ...ans,
        isCorrect: i === index,
      })),
    }));
  };

  const handleAddQuiz = () => {
    if (!newQuiz.question.trim()) {
      alert("لطفاً سوال را وارد کنید.");
      return;
    }
    const filledAnswers = newQuiz.answers.filter((ans) => ans.text.trim());
    if (filledAnswers.length !== 4) {
      alert("لطفاً هر چهار گزینه را وارد کنید.");
      return;
    }
    const correctAnswers = newQuiz.answers.filter((ans) => ans.isCorrect);
    if (correctAnswers.length !== 1) {
      alert("لطفاً دقیقاً یک گزینه را به عنوان پاسخ صحیح انتخاب کنید.");
      return;
    }
    const newId = String(Date.now());
    setQuizzes([...quizzes, { id: newId, ...newQuiz }]);
    setNewQuiz({
      question: "",
      answers: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    });
    setIsAddModalOpen(false);
  };

  const handleRemoveQuiz = (id, question) => {
    setQuizToDelete({ id, question });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setQuizzes(quizzes.filter((quiz) => quiz.id !== quizToDelete.id));
    setIsDeleteModalOpen(false);
    setQuizToDelete(null);
  };

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
    <div className="p-4 sm:p-6 font-noto bg-white min-h-screen" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">
          سوالات فرآیند ثبت‌نام
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-md shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 w-full sm:w-auto"
        >
          <PlusCircle className="w-5 h-5" />
          افزودن سوال
        </button>
      </div>

      {/* Modal for Adding Quiz */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-[90%] sm:max-w-md shadow-2xl relative border border-gray-300"
              style={{ backdropFilter: "blur(12px)" }}
            >
              <h2 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-6 text-right text-gray-800">
                افزودن سوال جدید
              </h2>
              <div className="mb-4">
                <label
                  htmlFor="question"
                  className="block text-gray-700 text-sm font-bold mb-2 text-right"
                >
                  سوال:
                </label>
                <input
                  type="text"
                  id="question"
                  value={newQuiz.question}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, question: e.target.value })
                  }
                  placeholder="سوال"
                  className="appearance-none border border-gray-300 text-right rounded-md w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
                />
              </div>
              {newQuiz.answers.map((ans, i) => (
                <div key={i} className="mb-2 flex items-center space-x-2">
                  <input
                    type="text"
                    value={ans.text}
                    onChange={(e) => handleAnswerTextChange(i, e.target.value)}
                    placeholder={`گزینه ${i + 1}`}
                    className="flex-1 appearance-none border border-gray-300 text-right rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200"
                  />
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={ans.isCorrect}
                    onChange={() => handleCorrectAnswerChange(i)}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                </div>
              ))}
              <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-md focus:outline-none shadow-md hover:shadow-lg transition-all duration-200 z-10 w-full sm:w-auto"
                >
                  لغو
                </button>
                <button
                  onClick={handleAddQuiz}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-md shadow-md hover:shadow-lg transition-all duration-200 z-10 w-full sm:w-auto"
                >
                  افزودن
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for Delete Confirmation */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-[90%] sm:max-w-md shadow-2xl relative border border-gray-300"
              style={{ backdropFilter: "blur(12px)" }}
            >
              <h2 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-6 text-right text-gray-800">
                حذف سوال
              </h2>
              <p className="text-gray-700 mb-4 sm:mb-6 text-right">
                آیا مطمئن هستید که می‌خواهید سوال "{quizToDelete?.question}" را
                حذف کنید؟
              </p>
              <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-md focus:outline-none shadow-md hover:shadow-lg transition-all duration-200 z-10 w-full sm:w-auto"
                >
                  لغو
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-md focus:outline-none shadow-md hover:shadow-lg transition-all duration-200 z-10 w-full sm:w-auto"
                >
                  حذف
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence>
          {quizzes.map((quiz) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white border border-gray-300 rounded-md shadow-md hover:shadow-lg transition-all duration-200 p-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-base sm:text-lg font-semibold text-black text-right">
                    {quiz.question}
                  </h2>
                  <button
                    onClick={() => handleRemoveQuiz(quiz.id, quiz.question)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                    title="حذف سوال"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <ul className="space-y-1">
                  {quiz.answers.map((ans, index) => (
                    <li
                      key={index}
                      className={`text-right ${
                        ans.isCorrect
                          ? "text-green-600 font-bold"
                          : "text-gray-700"
                      }`}
                    >
                      {ans.text}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminSignupQuiz;
