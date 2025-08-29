import React, { useState } from "react";
import JalaliCalendar from "@/components/common/JalaliCalendar";
import { convertToJalali } from "@/lib/utils/convertDate";
import { persianToEnglishNumbers} from "@/lib/utils/persianToEnglish"

function SearchBar({ searchTerm, setSearchTerm, searchType, setSearchType, sessionDate, setSessionDate }) {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateSelect = (date) => {
    // Convert Jalali date to Gregorian
    const gregorianDate = persianToEnglishNumbers(date);
    setSessionDate(gregorianDate);
    setShowCalendar(false);
  };

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4 relative">
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-right sm:w-40"
      >
        <option value="name">نام</option>
        <option value="phone">شماره تلفن</option>
      </select>
      <input
        type="text"
        placeholder={`جستجو بر اساس ${searchType === "name" ? "نام" : "شماره تلفن"}`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-right"
      />
      <div className="relative w-full sm:w-40">
        <input
          type="text"
          placeholder="تاریخ جلسه"
          value={sessionDate ? convertToJalali(sessionDate) : ""}
          onClick={() => setShowCalendar(!showCalendar)}
          readOnly
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-right cursor-pointer"
        />
        {showCalendar && (
          <div className="absolute z-50 w-80 mt-2 bg-white shadow-lg rounded-lg">
            <JalaliCalendar
              onDateSelect={handleDateSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;