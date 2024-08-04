import React, { useState } from 'react';
import Image from 'next/image';
import search from '../../../public/assets/search.svg';

function SearchBar({ onChange }) {
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const toggleSearch = () => {
    setIsOpen(!isOpen);
    setSearchValue('');
  };

  const handleApplyFilter = () => {
    onChange(searchValue);
    setIsOpen(false);
  };

  return (
    <div className="search-filter-container">
      <div className="icon-container">
        {!searchValue && <Image src={search} alt='search-icon' className='search-icon' width={18} height={18} />}
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
        />
         {!searchValue && <span className="placeholder-search">Search client...</span>}
      </div>
      {isOpen && (
        <div>
          </div>
      )}
    </div>
  );
}

export default SearchBar;
