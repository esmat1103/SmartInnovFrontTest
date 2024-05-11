import React, { useState, useEffect } from 'react';
import { db } from '@/app/config/firebaseConfig.mjs';
import { collection, getDocs } from 'firebase/firestore';

const FilterBar = ({ filterData }) => {
  const [selectedOption, setSelectedOption] = useState('all');
  const [governorates, setGovernorates] = useState([]);

  useEffect(() => {
    const fetchGovernorates = async () => {
      try {
        const governoratesRef = collection(db, 'governorates');
        const snapshot = await getDocs(governoratesRef);
        const governoratesList = snapshot.docs.map(doc => doc.data().name);
        setGovernorates(governoratesList);
      } catch (error) {
        console.error('Error fetching governorates:', error);
      }
    };

    fetchGovernorates();
  }, []);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    filterData(selectedValue);
  };

  return (
    <div className="relative search-bar mt-3 mx-3">
      <form>
        <select
          value={selectedOption}
          onChange={handleSelectChange}
          className="px-2 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All</option>
          {governorates.map(governorate => (
            <option key={governorate} value={governorate}>{governorate}</option>
          ))}
        </select>
      </form>
    </div>
  );
};

export default FilterBar;
