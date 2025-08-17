import React from "react";
import { motion } from "framer-motion";

const FrontCard = ({ reg, child, batch, rejectingSignupIds, rejectedSignupIds, requestRejectSignup }) => {
  return (
    <div
      className="absolute w-full h-full p-5 overflow-y-auto bg-white rounded-xl"
      style={{ backfaceVisibility: "hidden" }}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
        {child ? child.full_name : reg.child || "نامشخص"}
      </h3>
      <div className="space-y-1 text-lg text-right text-gray-700">
        <p className="">
          {reg.parent_name || "نامشخص"} :نام والد
        </p>
        <p className="">
          {reg.parent_username || "نامشخص"} :نام کاربری والد
        </p>
      </div>
      {batch ? (
        <div className="space-y-2 text-right text-xl">
          <p className="">
            {batch.capacity} :ظرفیت
          </p>
          <p className="">
            وضعیت پرداخت:
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                reg.payment_status === "paid"
                  ? "bg-green-100 text-green-700"
                  : reg.payment_status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {reg.payment_status === "partial" ? "پرداخت جزئی" : reg.payment_status === "paid" ? "پرداخت شده" : reg.payment_status === "rejected" ? "رد شده" : "پرداخت نشده"} 
            </span>
          </p>
          <p className="">
            وضعیت تایید:
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                reg.approval_status === "approved"
                  ? "bg-green-100 text-green-700"
                  : reg.approval_status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {reg.approval_status === "pending" ? "در انتظار" : reg.approval_status === "approved" ? "تایید شده" : reg.approval_status === "rejected" ? "رد شده" : reg.approval_status}
            </span>
          </p>
          <p className="">
            مبلغ:
            <span className="text-gray-600 mr-2">
              {reg.final_price}
            </span>
          </p>
        </div>
      ) : (
        <p className="text-gray-600 text-sm">
          بچ نامشخص
        </p>
      )}
      {!rejectedSignupIds.has(reg.id) ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={rejectingSignupIds.has(reg.id)}
          onClick={(e) => {
            e.stopPropagation();
            requestRejectSignup(reg.id);
          }}
          className={`mt-4 px-5 py-2 rounded-lg text-white text-xl font-medium transition-all duration-200 ${
            rejectingSignupIds.has(reg.id)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {rejectingSignupIds.has(reg.id) ? "در حال رد..." : "رد ثبت نام"}
        </motion.button>
      ) : (
        <p className="mt-4 text-red-600 font-medium">ثبت نام رد شده</p>
      )}
    </div>
  );
};

export default FrontCard;