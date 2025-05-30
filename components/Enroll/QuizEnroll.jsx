"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
    // Store the answer
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // If this was the last question, validate all answers
    if (currentIndex === questions.length - 1) {
      setValidating(true);
      try {
        // Format answers for API
        const formattedAnswers = Object.entries(userAnswers).map(([qId, answer]) => ({
          question_id: parseInt(qId),
          answer
        }));
        // Add the current answer
        formattedAnswers.push({
          question_id: questionId,
          answer
        });

        const result = await validateQuizAnswers(formattedAnswers);
        setQuizResult(result);
      } catch (err) {
        setError("خطا در بررسی پاسخ‌ها");
      } finally {
        setValidating(false);
      }
    } else {
      // Move to next question after a short delay
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 500);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center font-noto pt-[200px]">
        <div className="text-xl">در حال بارگذاری سوالات...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center font-noto pt-[200px]">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (validating) {
    return (
      <div className="h-full flex items-center justify-center font-noto pt-[200px]">
        <div className="text-xl">در حال بررسی پاسخ‌ها...</div>
      </div>
    );
  }

  if (quizResult) {
    return (
      <div className="h-full flex items-center justify-center font-noto pt-[200px]">
        <div className="bg-gray-950 max-md:w-[95%] h-[440px] mb-[140px] flex flex-col gap-8 border-2 border-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">
            {quizResult.result === "passed" ? "آزمون با موفقیت انجام شد" : "متاسفانه در آزمون قبول نشدید"}
          </h2>
          <div className="text-lg text-gray-300">
            <p>تعداد پاسخ‌های درست: {quizResult.correct_answers}</p>
            <p>تعداد کل سوالات: {quizResult.total_questions}</p>
          </div>
          {quizResult.result === "passed" ? (
            <Link href="/enroll/sessions">
              <button className="mt-[180px] px-6 py-2 cursor-pointer bg-green-500 text-white rounded-xl hover:bg-green-600">
                ادامه روند ثبت نام
              </button>
            </Link>
          ) : (
            <button 
              onClick={() => {
                setCurrentIndex(0);
                setUserAnswers({});
                setQuizResult(null);
              }}
              className="mt-[180px] px-6 py-2 cursor-pointer bg-blue-500 text-white rounded-xl hover:bg-blue-600"
            >
              تلاش مجدد
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="h-full flex items-center justify-center font-noto pt-[200px]">
      <div className="bg-gray-950 max-md:w-[95%] h-[440px] mb-[140px] flex flex-col gap-8 border-2 border-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">
          {currentQuestion.question_text}
        </h2>
        <div className="space-y-3">
          {currentQuestion.choices.map((choice) => (
            <button
              key={choice}
              onClick={() => handleSelect(currentQuestion.id, choice)}
              className={`w-full py-2 px-4 rounded-xl border text-lg transition-all
                ${userAnswers[currentQuestion.id] === choice 
                  ? "bg-blue-500 text-white" 
                  : "hover:bg-gray-800"}`}
            >
              {choice}
            </button>
          ))}
        </div>
        <div className="text-gray-400 mt-4">
          سوال {currentIndex + 1} از {questions.length}
        </div>
      </div>
    </div>
  );
}
