"use client";

import { useState } from "react";
import Calendar from "./Calendar";

export default function Reservations({
  reservations,
  setReservations,
  introTimes,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [newReservation, setNewReservation] = useState({
    id: "",
    fullName: "",
    childName: "",
    introTime: "",
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");

  const filteredReservations = reservations.filter(
    (res) =>
      res.fullName.includes(searchTerm) ||
      res.childName.includes(searchTerm) ||
      res.id.includes(searchTerm) ||
      res.introTime.includes(searchTerm)
  );

  const addReservation = (e) => {
    e.preventDefault();
    if (
      newReservation.fullName &&
      newReservation.childName &&
      newReservation.introTime
    ) {
      setReservations([...reservations, newReservation]);
      setNewReservation({
        id: "", // Reset to empty for backend to assign
        fullName: "",
        childName: "",
        introTime: "",
      });
      setShowCalendar(false);
      setHour("");
      setMinute("");
      setSelectedPeriod("AM");
    }
  };

  const removeReservation = (id) => {
    setReservations(reservations.filter((res) => res.id !== id));
  };

  const handleDateSelect = (date) => {
    setNewReservation({ ...newReservation, introTime: date });
    setHour("");
    setMinute("");
    setSelectedPeriod("AM");
  };

  const handleTimeSelect = () => {
    if (newReservation.introTime && hour && minute) {
      // Extract the date part by removing any existing time
      const datePart = newReservation.introTime.split(" - ")[0];
      const timeStr = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")} ${
        selectedPeriod === "AM" ? "ق.ظ" : "ب.ظ"
      }`;
      setNewReservation({
        ...newReservation,
        introTime: `${datePart} - ${timeStr}`,
      });
    }
  };

  const handleCalendarOpen = () => {
    setShowCalendar(true);
    // Reset time fields when reopening the calendar
    if (newReservation.introTime) {
      const datePart = newReservation.introTime.split(" - ")[0];
      setNewReservation({ ...newReservation, introTime: datePart });
    }
    setHour("");
    setMinute("");
    setSelectedPeriod("AM");
  };

  return (
    <div className="bg-white p-6  max-md:p-2 rounded-2xl flex-3/5 shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">لیست رزرو شده‌ها</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="جستجو بر اساس کد، نام، یا زمان"
        className="w-full p-3 mb-4 border text-right border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <div className="overflow-x-auto">
        <table className="w-full  text-sm text-gray-800">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-right">عملیات</th>
              <th className="p-3 text-right">زمان معارفه</th>
              <th className="p-3 text-right">نام فرزند</th>
              <th className="p-3 text-right">نام و نام خانوادگی</th>
              <th className="p-3 text-right">کد</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((res) => (
              <tr key={res.id} className="border-b">
                <td className="p-3">
                  <button
                    onClick={() => removeReservation(res.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    حذف
                  </button>
                </td>
                <td className="p-3">{res.introTime}</td>
                <td className="p-3">{res.childName}</td>
                <td className="p-3">{res.fullName}</td>
                <td className="p-3">{res.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form
        onSubmit={addReservation}
        className="mt-6 flex flex-col gap-4 relative"
      >
        <h3 className="text-lg font-bold text-gray-800">افزودن رزرو جدید</h3>
        <input
          type="text"
          value={newReservation.fullName}
          onChange={(e) =>
            setNewReservation({ ...newReservation, fullName: e.target.value })
          }
          placeholder="نام و نام خانوادگی"
          className="p-3 text-right border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
          required
        />
        <input
          type="text"
          value={newReservation.childName}
          onChange={(e) =>
            setNewReservation({ ...newReservation, childName: e.target.value })
          }
          placeholder="نام فرزند"
          className="p-3 text-right border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
          required
        />
        <div className="relative">
          <input
            type="text"
            value={newReservation.introTime}
            placeholder="انتخاب زمان معارفه"
            className="w-full p-3 text-right border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
            onClick={handleCalendarOpen}
            readOnly
          />
          {showCalendar && (
            <div className="absolute left-0 md:top-[-480px] mt-2 w-full max-w-md z-10 bg-white p-4 rounded-lg shadow-lg">
              <Calendar onSelectDate={handleDateSelect} />
              {newReservation.introTime && (
                <div className="mt-2 flex gap-2 flex-row">
                  <input
                    type="text"
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    placeholder="ساعت"
                    className="p-2 border border-gray-300 rounded-lg text-gray-900 w-20"
                  />
                  <input
                    type="text"
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
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
              <div className="flex  justify-between">
                {" "}
                <button
                  onClick={() => {
                    handleTimeSelect();
                    setShowCalendar(false);
                  }}
                  className="mt-2 bg-primary text-white font-bold py-2 px-3 cursor-pointer rounded-lg hover:bg-primary-dark"
                >
                  تأیید زمان
                </button>
                <button
                  onClick={() => setShowCalendar(false)}
                  className="mt-2 ml-2 text-red-500 cursor-pointer hover:text-red-700"
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
