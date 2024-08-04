import React, { useState } from 'react';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Calendar from '/public/assets/calendar.svg';

function DateFilter({ onChange }) {
  const [startDate, setStartDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleCalendar = () => {
    setIsOpen(!isOpen);
  };

  const handleApplyFilter = () => {
    onChange(startDate);
    setIsOpen(false); 
  };

  return (
    <div className="date-filter-container">
      <DatePicker
        selected={startDate}
        onChange={date => setStartDate(date)}
        className="date-picker"
        open={isOpen}
        onClickOutside={() => setIsOpen(false)}
        onCalendarOpen={() => setIsOpen(true)}
        onCalendarClose={() => setIsOpen(false)}
        showYearDropdown
        scrollableYearDropdown
        customInput={
          <button className="icon-container" onClick={toggleCalendar}>
            <Image src={Calendar} alt='calendar-icon' className='calendar-icon' width={18} height={18} />
            <span className="placeholder-text">{startDate ? startDate.toLocaleDateString() : 'Select Date'}</span>
          </button>
        }
      />
    </div>
  );
}

export default DateFilter;
