"use client";

import React from "react";
import { motion } from "framer-motion";
import { modalVariants } from "./BatchAnimations";
import { FormField, TextInput, SelectInput, CheckboxInput } from "./BatchFormFields";

const BatchForm = ({ 
  formData, 
  onChange, 
  onSubmit, 
  onCancel, 
  courses, 
  seasons, 
  errors = {},
  isEdit = false 
}) => {
  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white p-8 rounded-2xl min-h-screen max-md:mt-20 mt-[540px] shadow-2xl w-full max-w-lg relative my-8"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">
        {isEdit ? "ویرایش دوره" : "افزودن دوره جدید"}
      </h3>
      
      <div className="space-y-5">
        <FormField label="دوره" error={errors.course}>
          <SelectInput
            value={formData.course}
            onChange={(e) => onChange({ ...formData, course: e.target.value })}
            options={courses}
            placeholder="انتخاب دوره"
          />
        </FormField>

        <FormField label="فصل" error={errors.season}>
          <SelectInput
            value={formData.season}
            onChange={(e) => onChange({ ...formData, season: e.target.value })}
            options={seasons}
            placeholder="انتخاب فصل"
          />
        </FormField>

        <FormField label="عنوان" error={errors.title}>
          <TextInput
            value={formData.title}
            onChange={(e) => onChange({ ...formData, title: e.target.value })}
            placeholder="عنوان دوره"
          />
        </FormField>

        <div className="flex space-x-4">
          <div className="flex-1">
            <FormField label="حداقل سن" error={errors.min_age}>
              <TextInput
                type="number"
                value={formData.min_age}
                onChange={(e) => onChange({ ...formData, min_age: e.target.value })}
                placeholder="حداقل سن"
              />
            </FormField>
          </div>
          <div className="flex-1">
            <FormField label="حداکثر سن" error={errors.max_age}>
              <TextInput
                type="number"
                value={formData.max_age}
                onChange={(e) => onChange({ ...formData, max_age: e.target.value })}
                placeholder="حداکثر سن"
              />
            </FormField>
          </div>
        </div>

        <FormField label="برنامه زمانی" error={errors.schedule}>
          <TextInput
            value={formData.schedule}
            onChange={(e) => onChange({ ...formData, schedule: e.target.value })}
            placeholder="برنامه زمانی"
          />
        </FormField>

        <FormField label="مکان" error={errors.location}>
          <TextInput
            value={formData.location}
            onChange={(e) => onChange({ ...formData, location: e.target.value })}
            placeholder="مکان"
          />
        </FormField>

        <FormField label="ظرفیت" error={errors.capacity}>
          <TextInput
            type="number"
            value={formData.capacity}
            onChange={(e) => onChange({ ...formData, capacity: e.target.value })}
            placeholder="ظرفیت"
          />
        </FormField>

        <div className="flex space-x-4">
          <div className="flex-1 flex items-center space-x-2">
            <CheckboxInput
              checked={formData.allow_gateway}
              onChange={(e) => onChange({ ...formData, allow_gateway: e.target.checked })}
              label="اجازه درگاه"
            />
          </div>
          <div className="flex-1 flex items-center space-x-2">
            <CheckboxInput
              checked={formData.allow_receipt}
              onChange={(e) => onChange({ ...formData, allow_receipt: e.target.checked })}
              label="اجازه رسید"
            />
          </div>
          <div className="flex-1 flex items-center space-x-2">
            <CheckboxInput
              checked={formData.allow_installment}
              onChange={(e) => onChange({ ...formData, allow_installment: e.target.checked })}
              label="اجازه اقساط"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <FormField label="قیمت درگاه">
              <TextInput
                type="number"
                value={formData.price_gateway}
                onChange={(e) => onChange({ ...formData, price_gateway: e.target.value })}
                placeholder="قیمت درگاه"
              />
            </FormField>
          </div>
          <div className="flex-1">
            <FormField label="قیمت رسید">
              <TextInput
                type="number"
                value={formData.price_receipt}
                onChange={(e) => onChange({ ...formData, price_receipt: e.target.value })}
                placeholder="قیمت رسید"
              />
            </FormField>
          </div>
          <div className="flex-1">
            <FormField label="قیمت اقساط">
              <TextInput
                type="number"
                value={formData.price_installment}
                onChange={(e) => onChange({ ...formData, price_installment: e.target.value })}
                placeholder="قیمت اقساط"
              />
            </FormField>
          </div>
        </div>

        <div>
          <FormField label="تعداد اقساط">
            <TextInput
              type="number"
              value={formData.installment_count}
              onChange={(e) => onChange({ ...formData, installment_count: e.target.value })}
              placeholder="تعداد اقساط"
            />
          </FormField>
        </div>

        <div>
          <FormField label="درصد تخفیف همکار">
            <TextInput
              type="number"
              value={formData.colleague_discount_percent}
              onChange={(e) => onChange({ ...formData, colleague_discount_percent: e.target.value })}
              placeholder="درصد تخفیف همکار"
            />
          </FormField>
        </div>

        <div>
          <FormField label="درصد تخفیف وفاداری">
            <TextInput
              type="number"
              value={formData.loyalty_discount_percent}
              onChange={(e) => onChange({ ...formData, loyalty_discount_percent: e.target.value })}
              placeholder="درصد تخفیف وفاداری"
            />
          </FormField>
        </div>

        <div className="flex items-center space-x-2">
          <CheckboxInput
            checked={formData.booking_open}
            onChange={(e) => onChange({ ...formData, booking_open: e.target.checked })}
            label="فعال بودن دوره"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium"
        >
          انصراف
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSubmit}
          className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 text-sm font-medium"
        >
          ذخیره
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BatchForm;