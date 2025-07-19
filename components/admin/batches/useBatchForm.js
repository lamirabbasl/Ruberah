"use client";

import { useState } from "react";
import { validateBatch } from "./BatchValidation";

export const useBatchForm = () => {
  const [formData, setFormData] = useState({
    course: "",
    season: "",
    title: "",
    min_age: "",
    max_age: "",
    schedule: "",
    location: "",
    capacity: "",
    allow_gateway: false,
    allow_receipt: false,
    allow_installment: false,
    price_gateway: "",
    price_receipt: "",
    price_installment: "",
    installment_count: 0,
    colleague_discount_percent: 0,
    loyalty_discount_percent: 0,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateBatch(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }
    
    return true;
  };

  const resetForm = () => {
    setFormData({
      course: "",
      season: "",
      title: "",
      min_age: "",
      max_age: "",
      schedule: "",
      location: "",
      capacity: "",
      allow_gateway: false,
      allow_receipt: false,
      allow_installment: false,
      price_gateway: "",
      price_receipt: "",
      price_installment: "",
      installment_count: 0,
      colleague_discount_percent: 0,
      loyalty_discount_percent: 0,
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    setFormData,
    setErrors
  };
};
