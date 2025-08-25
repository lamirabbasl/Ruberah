"use client";
import React from "react";
import RenderInput from "./RenderInput";

const EditModal = ({
  isOpen,
  onClose,
  title,
  fields,
  tempData,
  setTempData,
  onSave,
  saving,
  getLabel,
  getType,
  getOptions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-3xl w-5/6 flex items-center justify-center z-50" dir="rtl">
      <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-xl text-black font-bold mb-4 text-center">{title}</h2>
        <form onSubmit={onSave} className="space-y-4">
          {fields.map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-lg text-gray-500">{getLabel(key)}</label>
              <RenderInput
                type={getType(key)}
                value={tempData[key]}
                onChange={(val) => setTempData((prev) => ({ ...prev, [key]: val }))}
                options={getOptions(key)}
                disabled={saving}
              />
            </div>
          ))}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition-colors duration-200"
              disabled={saving}
            >
              لغو
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
            >
              {saving ? "در حال ذخیره..." : "ذخیره"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;