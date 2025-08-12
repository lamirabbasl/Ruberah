"use client";
import React from "react";

const Notification = ({ message }) => {
  return (
    <div className="fixed top-4 font-mitra left-4 bg-red-500 text-white p-4 rounded-lg shadow-lg  text-center w-50 z-50" dir="rtl">
      <p>{message}</p>
    </div>
  );
};

export default Notification;