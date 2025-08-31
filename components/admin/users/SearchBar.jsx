import React from "react";

function SearchBar({ searchTerm, setSearchTerm, setCurrentPage }) {
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="mb-6 w-78 text-black">
      <input
        type="text"
        placeholder="جستجو بر اساس نام کاربری یا شماره تلفن"
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm text-right"
      />
    </div>
  );
}

export default SearchBar;