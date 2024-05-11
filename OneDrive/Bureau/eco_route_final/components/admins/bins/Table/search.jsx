import React, { useState } from 'react';
import Image from 'next/image';
import searchIcon from '@/public/main_content/search.svg';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="relative search-bar mt-3 mx-3">
      <form>
        <input
          type="text"
          placeholder="Search here..."
          value={searchTerm}
          onChange={handleInputChange}
          className="px-2 py-1 flex-grow border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3">
          <Image src={searchIcon} alt="Search" width={20} height={20} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
