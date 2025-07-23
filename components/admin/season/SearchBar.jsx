import React from "react";
import { IoSearch } from "react-icons/io5";

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="mb-8 relative rounded-lg shadow-sm">
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <IoSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        name="season-search"
        id="season-search"
        className="block w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="جستجو بر اساس نام فصل..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;