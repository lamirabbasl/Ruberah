import React from "react";
import { FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";

function ReservationTable({ reservations, handleToggleActivation, openConfirmDelete }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-x-auto border border-gray-200 rounded-xl shadow-md"
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              فعال‌سازی کد
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              کد
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              نام و نام خانوادگی
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              شماره همراه
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ایمیل
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
              حذف
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reservations.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <input
                  type="checkbox"
                  checked={item.code_activated}
                  onChange={() => handleToggleActivation(item.id)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                {item.registration_code}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                {item.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                {item.phone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                {item.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                {item.sessionData ? new Date(item.sessionData.date_time).toLocaleString("fa-IR") : "Unknown"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openConfirmDelete(item.id)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                  aria-label={`حذف رزرو ${item.registration_code}`}
                >
                  <FaTrash size={16} />
                </motion.button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

export default ReservationTable;