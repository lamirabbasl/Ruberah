"use client"
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { patchOtherParent } from "@/lib/api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import EditableField from "./EditableField";

const OtherParentModal = ({ isOpen, onClose, initialData, onSaveSuccess }) => {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "first_name",
      "last_name",
      "date_of_birth",
      "place_of_birth",
      "marital_status",
      "occupation",
      "field_of_study",
      "highest_education",
      "phone_number",
      "national_id",
      "full_address",
      "landline_number",
      "emergency_contact_number",
      "gender",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "این فیلد اجباری است.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("لطفاً تمام فیلدهای اجباری را پر کنید.");
      return;
    }
    setLoading(true);
    try {
      const response = await patchOtherParent(formData);
      toast.success(response.data?.message || "اطلاعات والد دیگر با موفقیت بروزرسانی شد.");
      onSaveSuccess(response);
      onClose();
    } catch (err) {
      console.error("Error updating other parent info:", err);
      toast.error(err.response?.data?.message || err.message || "خطا در بروزرسانی اطلاعات والد دیگر");
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { label: "نام", field: "first_name", type: "text" },
    { label: "نام خانوادگی", field: "last_name", type: "text" },
    { label: "شماره تماس", field: "phone_number", type: "text" },
    { label: "کد ملی", field: "national_id", type: "text" },
    { label: "آدرس", field: "full_address", type: "text" },
    { label: "تاریخ تولد", field: "date_of_birth", type: "date" },
    { label: "محل تولد", field: "place_of_birth", type: "text" },
    {
      label: "وضعیت تأهل",
      field: "marital_status",
      type: "select",
      options: [
        { value: "single", label: "مجرد" },
        { value: "married", label: "متأهل" },
        { value: "divorced", label: "طلاق گرفته" },
        { value: "widowed", label: "بیوه" },
      ],
    },
    { label: "شغل", field: "occupation", type: "text" },
    { label: "رشته تحصیلی", field: "field_of_study", type: "text" },
    { label: "بالاترین مدرک تحصیلی", field: "highest_education", type: "text" },
    { label: "شماره ثابت", field: "landline_number", type: "text" },
    { label: "شماره اضطراری", field: "emergency_contact_number", type: "text" },
    {
      label: "جنسیت",
      field: "gender",
      type: "select",
      options: [
        { value: "father", label: "پدر" },
        { value: "mother", label: "مادر" },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative p-6 border w-96 max-md:w-screen shadow-lg rounded-md bg-white font-mitra"
        dir="rtl"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">ویرایش اطلاعات والد دیگر</h3>
        <div className="space-y-4">
          {inputFields.map((input) => (
            <div key={input.field}>
              <EditableField
                label={input.label}
                value={formData[input.field]}
                onChange={(val) => handleChange(input.field, val)}
                type={input.type}
                options={input.options}
                editing={true}
                error={errors[input.field]}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6 space-x-2 space-x-reverse">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? <LoadingSpinner size="sm" /> : "ذخیره"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            لغو
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OtherParentModal;