"use client";

import Link from "next/link";
import { useState } from "react";

const quizData = [
  {
    question: "پایتخت فرانسه کجاست؟",
    options: ["برلین", "مادرید", "پاریس", "رم"],
    answer: "پاریس",
  },
  {
    question: "کدام سیاره به عنوان سیاره قرمز شناخته می شود؟",
    options: ["زمین", "مریخ", "مشتری", "ونوس"],
    answer: "مریخ",
  },
  {
    question: "بزرگ ترین اقیانوس زمین کدام است؟",
    options: ["آنلانتیک", "هند", "شمال", "آرام"],
    answer: "آرام",
  },
];

export default function QuizEnroll() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [wrong, setWrong] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentQuiz = quizData[currentIndex];

  const handleSelect = (option) => {
    setSelected(option);
    if (option === currentQuiz.answer) {
      setWrong(false);
      if (currentIndex === quizData.length - 1) {
        setCompleted(true);
      } else {
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
          setSelected(null);
        }, 500);
      }
    } else {
      setWrong(true);
    }
  };

  return (
    <div className="h-full flex items-center justify-center font-noto pt-[200px]">
      <div className="bg-gray-950 max-md:w-[95%] h-[440px] mb-[140px] flex flex-col gap-8 border-2 border-white p-8 rounded-2xl shadow-xl w-full max-w-md  text-center">
        {!completed ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-white">
              {currentQuiz.question}
            </h2>
            <div className="space-y-3">
              {currentQuiz.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`w-full py-2 px-4 rounded-xl border text-lg transition-all
                    ${
                      selected === option &&
                      option !== currentQuiz.answer &&
                      wrong
                        ? "bg-red-500 text-white"
                        : " hover:bg-gray-800"
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {wrong && <p className="text-red-500 ">پاسخ درست نمی باشد</p>}
          </>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-white">
              آزمون با موفقیت انجام شد
            </h2>
            <Link href={"/"}>
              <button className="mt-[280px] px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600">
                ادامه روند ثبت نام
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
