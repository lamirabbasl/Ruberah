"use client";

import { useState } from "react";
import Calendar from "./Calendar";

export default function IntroTimes({ introTimes, setIntroTimes }) {
  const [newIntroTime, setNewIntroTime] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");

  const addIntroTime = (e) => {
    e.preventDefault();
    if (newIntroTime) {
      setIntroTimes([...introTimes, newIntroTime]);
      setNewIntroTime("");
      setShowCalendar(false);
      setHour("");
      setMinute("");
      setSelectedPeriod("AM");
    }
  };

  const removeIntroTime = (time) => {
    setIntroTimes(introTimes.filter((t) => t !== time));
  };

  const handleDateSelect = (date) => {
    setNewIntroTime(date);
    setHour("");
    setMinute("");
    setSelectedPeriod("AM");
  };

  const handleTimeSelect = () => {
    if (newIntroTime && hour && minute) {
      // Extract the date part by removing any existing time
      const datePart = newIntroTime.split(" - ")[0];
      const timeStr = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")} ${
        selectedPeriod === "AM" ? "ق.ظ" : "ب.ظ"
      }`;
      setNewIntroTime(`${datePart} - ${timeStr}`);
    }
  };

  const handleCalendarOpen = (e) => {
    e.stopPropagation();
    setShowCalendar(true);
    // Reset time fields when reopening the calendar
    if (newIntroTime) {
      const datePart = newIntroTime.split(" - ")[0];
      setNewIntroTime(datePart);
    }
    setHour("");
    setMinute("");
    setSelectedPeriod("AM");
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const preventFormSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="bg-white text-black p-6 rounded-2xl flex-2/5 shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">زمان‌های معارفه</h2>
      <ul className="mb-4">
        {introTimes.map((time, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-2 border-b"
          >
            <button
              onClick={() => removeIntroTime(time)}
              className="text-red-500 hover:text-red-700"
            >
              حذف
            </button>
            <span>{time}</span>
          </li>
        ))}
      </ul>
      <form onSubmit={addIntroTime} className="  flex flex-col gap-4">
        <h3 className="text-lg font-bold text-gray-800">افزودن زمان جدید</h3>
        <div className="relative">
          <input
            type="text"
            value={newIntroTime}
            placeholder="انتخاب زمان معارفه"
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
            onClick={handleCalendarOpen}
            readOnly
          />
          {showCalendar && (
            <div
              className="absolute right-0 md:top-[-280px] mt-2 w-full max-w-md z-10 bg-white p-4 rounded-lg shadow-lg"
              onClick={stopPropagation}
            >
              <Calendar onSelectDate={handleDateSelect} />
              {newIntroTime && (
                <div className="mt-2 flex gap-2 flex-row">
                  <input
                    type="text"
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    onKeyDown={preventFormSubmit}
                    placeholder="ساعت"
                    className="p-2 border border-gray-300 rounded-lg text-gray-900 w-20"
                  />
                  <input
                    type="text"
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                    onKeyDown={preventFormSubmit}
                    placeholder="دقیقه"
                    className="p-2 border border-gray-300 rounded-lg text-gray-900 w-20"
                  />
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    onBlur={handleTimeSelect}
                    className="p-2 border border-gray-300 rounded-lg text-gray-900"
                  >
                    <option value="AM">ق.ظ</option>
                    <option value="PM">ب.ظ</option>
                  </select>
                </div>
              )}
              <div className="flex justify-between">
                {" "}
                <button
                  onClick={() => {
                    handleTimeSelect();
                    setShowCalendar(false);
                  }}
                  className="mt-2 bg-primary cursor-pointer text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark"
                >
                  تأیید زمان
                </button>
                <button
                  onClick={() => setShowCalendar(false)}
                  className="mt-2 ml-2 cursor-pointer text-red-500 hover:text-red-700"
                >
                  بستن
                </button>
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark"
        >
          افزودن
        </button>
      </form>
    </div>
  );
}
