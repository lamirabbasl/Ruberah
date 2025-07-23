import React from "react";
import { FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const rowVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

function UsersTable({ users, openConfirmDelete }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={rowVariants}
      className="overflow-x-auto bg-white border border-gray-200 rounded-2xl shadow-lg"
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider"
            >
              نام کاربری
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider"
            >
              شماره تلفن
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider"
            >
              نقش
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider"
            >
              آدرس
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider"
            >
              کد ملی
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider"
            >
              عملیات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <AnimatePresence>
            {users.map((user) => (
              <motion.tr
                key={user.id}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="hover:bg-gray-50 transition-all duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                  {user.phone_number || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                  {user.groups && user.groups.length > 0 ? user.groups.join(", ") : "-"}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-600">
                  {user.address || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                  {user.national_id || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openConfirmDelete(user.id)}
                    className="text-red-500 hover:text-red-700 transition-all duration-200 p-2 rounded-full bg-red-50 hover:bg-red-100"
                    aria-label={`حذف کاربر ${user.username}`}
                  >
                    <FaTrash size={16} />
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </motion.div>
  );
}

export default UsersTable;