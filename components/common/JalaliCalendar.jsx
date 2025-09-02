"use client";

import React, { useState, useEffect } from "react";
import moment from "moment-jalaali";
import "moment/locale/fa";
import { IoIosArrowBack, IoIosArrowForward, IoIosArrowDown } from "react-icons/io";

moment.loadPersian({ usePersianDigits: true, dialect: "persian-modern" });

let daysOfWeek = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

const JalaliCalendar = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(
    moment().locale("fa").startOf("day")
  );
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [selectedDate, setSelectedDate] = useState({
    day: currentDate.jDate(),
    month: currentDate.jMonth() + 1,
    year: currentDate.jYear(),
  });
  const [showYearPicker, setShowYearPicker] = useState(false);

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

  const handleYearClick = () => {
    setShowYearPicker(!showYearPicker);
  };

  const handleYearSelect = (year) => {
    const newDate = moment(currentDate).jYear(year);
    setCurrentDate(newDate);
    setSelectedDate({ day: null, month: null, year: null });
    setShowYearPicker(false);
  };

  const handleDayClick = (day) => {
    if (day) {
      const selected = {
        day,
        month: currentDate.jMonth() + 1,
        year: currentDate.jYear(),
      };

      setSelectedDate(selected);

      // Convert to Gregorian
      const gregorianDate = moment()
        .jYear(selected.year)
        .jMonth(selected.month - 1)
        .jDate(selected.day)
        .format("YYYY-MM-DD");

      if (onDateSelect) {
        onDateSelect(gregorianDate); // send to parent
      }
    }
  };

  // Generate a range of years for the year picker (current year - 70 to current year)
  const systemCurrentYear = moment().jYear(); // always current system year
  const years = Array.from({ length: 100 }, (_, i) => systemCurrentYear - 70 + i);

  return (
    <div className="flex flex-col text-black relative items-center gap-3 w-full h-[460px] max-w-md mx-auto p-5 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="flex justify-between items-center w-full mb-6 mt-5">
        <button
          onClick={prevMonth}
          className="px-3 py-1 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <IoIosArrowForward size={20} className="text-black hover:text-blue-500" />
        </button>
        <div className=" flex items-center">
          <h2 className="text-[23px] flex items-center cursor-pointer" onClick={handleYearClick}>
            {currentDate.format("jYYYY")} {currentDate.format("jMMMM")}
            <IoIosArrowDown size={16} className="ml-2 text-gray-500 hover:text-blue-500" />
          </h2>
          {showYearPicker && (
            <div className="absolute top-22 w-70 right-10 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-4 grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className={`p-2 rounded hover:bg-gray-100 text-sm ${
                    year === currentDate.jYear() ? "bg-blue-100" : ""
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={nextMonth}
          className="px-3 py-1 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <IoIosArrowBack size={20} className="text-black hover:text-blue-500" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2 gap-1 w-full text-md text-right">
        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            className="py-2 text-center font-semibold text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 text-sm gap-[7px] w-full" style={{ direction: "rtl" }}>
        {daysInMonth.map((day, index) => (
          <div
            key={index}
            className={
              day
                ? `flex items-center justify-center h-10 w-10 mx-auto text-center rounded-full hover:border hover:border-gray-200 cursor-pointer transition-colors ${
                    day === selectedDate.day &&
                    currentDate.jMonth() + 1 === selectedDate.month &&
                    currentDate.jYear() === selectedDate.year
                      ? "bg-black text-white"
                      : index % 7 === 6
                      ? "text-red-500"
                      : "text-black"
                  }`
                : ""
            }
            onClick={() => handleDayClick(day)}
          >
            <span className="ltr">{day ? day.toLocaleString("fa-IR") : ""}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JalaliCalendar;