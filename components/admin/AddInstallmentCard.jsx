"use client";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { getBatches, addInstallmentTemplates } from "@/lib/api/api";

const AddInstallmentCard = ({ onClose, onAdded }) => {
  const [batches, setBatches] = useState([]);
  const [selectedBatchName, setSelectedBatchName] = useState("");
  const [templates, setTemplates] = useState([
    { order: 1, title: "", amount: "", deadline_month: 0 },
  ]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await getBatches();
        setBatches(data);
      } catch (err) {
        setError("خطا در بارگذاری بچه‌ها");
      }
    };
    fetchBatches();
  }, []);

  const handleTemplateChange = (index, field, value) => {
    const newTemplates = [...templates];
    newTemplates[index][field] = value;
    setTemplates(newTemplates);
  };

  const addTemplate = () => {
    setTemplates([
      ...templates,
      { order: templates.length + 1, title: "", amount: "", deadline_month: 0 },
    ]);
  };

  const removeTemplate = (index) => {
    const newTemplates = templates.filter((_, i) => i !== index);
    setTemplates(newTemplates);
  };

  const handleSubmit = async () => {
    if (!selectedBatchName) {
      setError("لطفا یک بچه انتخاب کنید");
      return;
    }
    for (const t of templates) {
      if (!t.title.trim() || !t.amount) {
        setError("لطفا تمام فیلدهای قالب را پر کنید");
        return;
      }
    }
    setError(null);
    setLoading(true);
    try {
      // Find batch id by name
      const batch = batches.find((b) => b.title === selectedBatchName || b.name === selectedBatchName);
      if (!batch) {
        setError("بچه انتخاب شده نامعتبر است");
        setLoading(false);
        return;
      }
      // Prepare data
      const data = {
        batch: batch.id,
        templates: templates.map((t) => ({
          order: Number(t.order),
          title: t.title,
          amount: Number(t.amount),
          deadline_month: Number(t.deadline_month),
        })),
      };
      await addInstallmentTemplates(data);
      setLoading(false);
      onAdded();
      onClose();
    } catch (err) {
      setError("خطا در افزودن اقساط");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl relative">

        <h2 className="text-xl font-bold mb-4">افزودن اقساط جدید</h2>

        <div className="mb-4">
          <label className="block mb-1">انتخاب بچه</label>
          <select
            value={selectedBatchName}
            onChange={(e) => setSelectedBatchName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">انتخاب بچه</option>
            {batches.map((batch) => (
              <option key={batch.id} value={batch.title || batch.name}>
                {batch.title || batch.name}
              </option>
            ))}
          </select>
        </div>

        {templates.map((template, index) => (
          <div key={index} className="border rounded p-4 mb-4 relative">
            {templates.length > 1 && (
              <button
                onClick={() => removeTemplate(index)}
                className="absolute top-2 left-2 text-red-600 hover:text-red-900"
                aria-label="حذف قالب"
              >
                <IoClose size={20} />
              </button>
            )}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block mb-1">ردیف</label>
                <input
                  type="number"
                  value={template.order}
                  onChange={(e) =>
                    handleTemplateChange(index, "order", e.target.value)
                  }
                  className="w-full border rounded px-3 py-2"
                  min={1}
                />
              </div>
              <div>
                <label className="block mb-1">عنوان</label>
                <input
                  type="text"
                  value={template.title}
                  onChange={(e) =>
                    handleTemplateChange(index, "title", e.target.value)
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1">مبلغ</label>
                <input
                  type="number"
                  value={template.amount}
                  onChange={(e) =>
                    handleTemplateChange(index, "amount", e.target.value)
                  }
                  className="w-full border rounded px-3 py-2"
                  min={0}
                />
              </div>
              <div>
                <label className="block mb-1">ماه سررسید</label>
                <input
                  type="number"
                  value={template.deadline_month}
                  onChange={(e) =>
                    handleTemplateChange(index, "deadline_month", e.target.value)
                  }
                  className="w-full border rounded px-3 py-2"
                  min={0}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addTemplate}
          className="mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          افزودن قالب جدید
        </button>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
          >
            انصراف
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "در حال ارسال..." : "ذخیره"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInstallmentCard;
