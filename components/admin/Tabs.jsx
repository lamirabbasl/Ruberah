"use client";

export default function Tabs({ activeTab, setActiveTab }) {
  const tabs = ["رزرو شده‌ها", "دوره‌ها", "فرآیند ثبت‌نام"];

  return (
    <div className="flex border-b justify-start flex-row-reverse max-md:mt-10  border-gray-300 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 font-medium ${
            activeTab === tab
              ? "border-b-2 border-primary text-primary"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
