"use client";

import { useState, useEffect } from "react";
import moment from "moment-jalaali";
import "moment/locale/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

moment.loadPersian({ usePersianDigits: true, dialect: "persian-modern" });

const daysOfWeek = ["ش", "ی", "د", "س", "چ", "پ", "ج"].reverse();

export default function Calendar({ onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(
    moment().locale("fa").startOf("day")
  );
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [selectedDate, setSelectedDate] = useState({
    day: null,
    month: null,
    year: null,
  });

  useEffect(() => {
    const firstDayOfMonth = moment(currentDate).jDate(1);
    const lastDayOfMonth = moment(currentDate).endOf("jMonth");
    const daysArray = [];
    let startDay = firstDayOfMonth.day();

    for (let i = -1; i < startDay; i++) {
      daysArray.push(null);
    }

    for (let i = 1; i <= lastDayOfMonth.jDate(); i++) {
      daysArray.push(i);
    }

    setDaysInMonth(daysArray);
  }, [currentDate]);

  const nextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, "jMonth"));
    setSelectedDate({ day: null, month: null, year: null });
  };

  const prevMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, "jMonth"));
    setSelectedDate({ day: null, month: null, year: null });
  };

  const handleDayClick = (day) => {
    if (day) {
      const newSelectedDate = {
        day,
        month: currentDate.jMonth() + 1,
        year: currentDate.jYear(),
      };
      setSelectedDate(newSelectedDate);
      const formattedDate = moment()
        .jYear(newSelectedDate.year)
        .jMonth(newSelectedDate.month - 1)
        .jDate(newSelectedDate.day)
        .format("jYYYY/jMM/jDD");
      onSelectDate(formattedDate);
    }
  };

  return (
    <div className=" flex flex-col items-center gap-3 w-full max-w-md mx-auto p-5 bg-white rounded-lg shadow-lg border border-gray-200 font-noto text-right dir-rtl">
      <div className="flex justify-between items-center w-full mb-6 mt-5">
        <button
          onClick={nextMonth}
          className="px-3 py-1 text-primary hover:text-primary-dark"
        >
          <IoIosArrowBack size={20} />
        </button>
        <h2 className="text-xl text-gray-900">
          {currentDate.format("jYYYY")} {currentDate.format("jMMMM")}
        </h2>
        <button
          onClick={prevMonth}
          className="px-3 py-1 text-primary hover:text-primary-dark"
        >
          <IoIosArrowForward size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-2 gap-1 w-full text-md text-right">
        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            className="py-2 text-center font-semibold text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>
      <div
        className="grid grid-cols-7 text-sm gap-2 w-full"
        style={{ direction: "rtl" }}
      >
        {daysInMonth.map((day, index) => (
          <div
            key={index}
            className={
              day
                ? `flex items-center justify-center h-10 w-10 mx-auto text-center rounded-full hover:border hover:border-gray-200 cursor-pointer transition-colors ${
                    day === selectedDate.day &&
                    currentDate.jMonth() + 1 === selectedDate.month &&
                    currentDate.jYear() === selectedDate.year
                      ? "bg-primary text-white"
                      : index % 7 === 6
                      ? "text-red-500"
                      : "text-gray-900"
                  }`
                : ""
            }
            onClick={() => handleDayClick(day)}
          >
            <span className="ltr">
              {day ? day.toLocaleString("fa-IR") : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
