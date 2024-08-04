import React, { useState } from 'react';
import Image from 'next/image';
import search from '../../public/assets/search.svg';

function SearchBar({ onChange }) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onChange(value);
  };

  return (
    <div className="search-filter-container">
      <div className="icon-container">
        {!searchValue && <Image src={search} alt='search-icon' className='search-icon' width={18} height={18} />}
        <input
          type="text"
          value={searchValue}
          onChange={handleSearch}
          className="search-input"
        />
         {!searchValue && <span className="placeholder-search">Search...</span>}
      </div>
    </div>
  );
}

export default SearchBar;
