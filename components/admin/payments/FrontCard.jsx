import React from "react";

const FrontCard = ({ reg, child, batch }) => {
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
            وضعیت:
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                reg.payment_status === "paid"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {reg.payment_status === "partial" ? "پرداخت جزئی" : reg.payment_status === "paid" ? "پرداخت شده" : "پرداخت نشده"} 
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
    </div>
  );
};

export default FrontCard;