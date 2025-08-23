"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getQuizQuestions, validateQuizAnswers } from "@/lib/api/api";

export default function QuizEnroll() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validating, setValidating] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const data = await getQuizQuestions();
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        setError("خطا در دریافت سوالات");
        setLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  const handleSelect = async (questionId, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));

    if (currentIndex === questions.length - 1) {
      setValidating(true);
      try {
        const formattedAnswers = Object.entries(userAnswers).map(([qId, answer]) => ({
          question_id: parseInt(qId),
          answer,
        }));
        formattedAnswers.push({
          question_id: questionId,
          answer,
        });

        const result = await validateQuizAnswers(formattedAnswers);
        setQuizResult(result);
      } catch (err) {
        setError("خطا در بررسی پاسخ‌ها");
      } finally {
        setValidating(false);
      }
    } else {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 300);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, y: 30, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans pt-48 bg-gradient-to-b from-gray-900 to-gray-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-t-indigo-500 border-gray-600 rounded-full"
        ></motion.div>
      </div>
    );
  }


  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans pt-48 bg-gradient-to-b from-gray-900 to-gray-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-t-indigo-500 border-gray-600 rounded-full"
        ></motion.div>
      </div>
    );
  }

  if (quizResult) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mitra pt-0 ">
        <AnimatePresence>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-gray-950 max-md:w-[95%] flex flex-col gap-8  border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center text-white"
          >
            <h2 className="text-4xl  tracking-tight">
              {quizResult.result === "passed" ? "آزمون با موفقیت انجام شد" : "متاسفانه در آزمون قبول نشدید"}
            </h2>
            <div className="text-xl text-gray-300 space-y-2">
              <p>تعداد پاسخ‌های درست: {quizResult.correct_answers}</p>
              <p>تعداد کل سوالات: {quizResult.total_questions}</p>
            </div>
            {quizResult.result === "passed" ? (
              <Link href="/enroll/sessions">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="mt-8 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all duration-200 text-lg font-medium"
                >
                  ادامه روند ثبت نام
                </motion.button>
              </Link>
            ) : (
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => {
                  setCurrentIndex(0);
                  setUserAnswers({});
                  setQuizResult(null);
                }}
                className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 text-sm font-medium"
              >
                تلاش مجدد
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen flex items-center justify-center font-mitra pt-0 ">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-gray-950 max-md:w-[95%] flex flex-col gap-6 border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center text-white"
        >
          <h2 className="text-3xl  tracking-tight">{currentQuestion.question_text}</h2>
          <div className="space-y-3">
            {currentQuestion.choices.map((choice) => (
              <motion.button
                key={choice}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleSelect(currentQuestion.id, choice)}
                className={`w-full py-3 px-4 rounded-lg border text-xl  transition-all duration-200 ${
                  userAnswers[currentQuestion.id] === choice
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "border-gray-600 hover:bg-gray-800 text-gray-300"
                }`}
              >
                {choice}
              </motion.button>
            ))}
          </div>
          <div className="text-gray-400 text-sm">
            سوال {currentIndex + 1} از {questions.length}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}