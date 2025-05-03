"use client";
import { useState } from "react";

export function ReserveTimes() {
  const [times, setTimes] = useState([]);
  const [newTime, setNewTime] = useState("");

  const addTime = () => {
    if (newTime) {
      setTimes([...times, newTime]);
      setNewTime("");
    }
  };

  const deleteTime = (index) => {
    const updated = times.filter((_, i) => i !== index);
    setTimes(updated);
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="datetime-local"
          className="input"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={addTime}
        >
          افزودن زمان
        </button>
      </div>

      <div className="space-y-2">
        {times.map((time, idx) => (
          <div
            key={idx}
            className="bg-white shadow p-4 rounded flex justify-between items-center"
          >
            <p>زمان معارفه: {time}</p>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => deleteTime(idx)}
            >
              حذف
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
