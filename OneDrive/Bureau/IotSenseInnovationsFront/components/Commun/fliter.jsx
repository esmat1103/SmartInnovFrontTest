import React, { useState } from 'react';
import Image from 'next/image';
import Filter from '/public/assets/filter.svg';

function DropdownFilter({ options, onChange }) {
  const [selectedOption, setSelectedOption] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="dropdown-filter-container">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        <div className="icon-container">
          <Image src={Filter} alt="placeholder-icon" className="filter-icon" width={18} height={18} />
          <span className="placeholder-text">{selectedOption || 'Filter'}</span>
        </div>
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option, index) => (
            <div
              key={index}
              className="dropdown-item"
              onClick={() => handleSelectOption(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DropdownFilter;
