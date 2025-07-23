import React from "react";

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="mb-6">
      <label htmlFor="search" className="sr-only">
        جستجو دوره‌ها
      </label>
      <input
        type="text"
        id="search"
        placeholder="جستجو بر اساس نام دوره..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
      />
    </div>
  );
}

export default SearchBar;