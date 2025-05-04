"use client";

import React, { useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import AddTimeForm from "./AddTimeForm";

const ReserveTimes = () => {
  // Renamed to ReserveTimes
  const [items, setItems] = useState([
    { id: "1", کد: "ITEM001", زمان_معارفه: "2025-05-10", ساعت: "10:00" },
    { id: "2", کد: "ITEM002", زمان_معارفه: "2025-05-12", ساعت: "14:30" },
    { id: "3", کد: "ITEM003", زمان_معارفه: "2025-05-15", ساعت: "11:15" },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    setShowAddForm(true);
  };

  const handleSaveNewItem = (newItem) => {
    // Receive newItem from the form
    setItems([...items, { id: String(Date.now()), ...newItem }]);
    setShowAddForm(false);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  return (
    <div className=" max-md:w-screen min-h-screen bg-white text-black p-6 text-right">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <button
          onClick={handleAddItem}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center mb-4 sm:mb-0"
        >
          <FaPlus className="mr-2" />
          افزودن آیتم
        </button>
        {showAddForm && (
          <AddTimeForm // Use the imported component
            onSave={handleSaveNewItem}
            onCancel={handleCancelAdd}
          />
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-gray-600">هیچ آیتمی در لیست وجود ندارد</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">حذف</span>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ساعت
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  زمان معارفه
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  کد
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <FaTrash />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {item.ساعت}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {item.زمان_معارفه}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {item.کد}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReserveTimes; // Export the component
