"use client";

import React from "react";

export const FormField = ({ label, children, error }) => (
  <div>
    <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export const TextInput = ({ value, onChange, placeholder, type = "text" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
  />
);

export const SelectInput = ({ value, onChange, options, placeholder }) => (
  <select
    value={value}
    onChange={onChange}
    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option.id || option.value} value={option.id || option.value}>
        {option.name || option.label}
      </option>
    ))}
  </select>
);

export const CheckboxInput = ({ checked, onChange, label }) => (
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
    />
    <label className="text-sm text-gray-700">{label}</label>
  </div>
);
