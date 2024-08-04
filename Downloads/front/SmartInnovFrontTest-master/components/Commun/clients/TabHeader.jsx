import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';


const TableHeader = ({ handleHeaderCheckboxChange }) => {
  const [language, setLanguage] = useState('en'); 
  const { t } = useTranslation('HeaderClientsTab'); 


  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);


  return (
    <thead className="table-header darkgrey">
      <tr className="table-header-row">
        <th>
          <input 
            type="checkbox" 
            className="custom-checkbox" 
            onChange={handleHeaderCheckboxChange} 
          />
        </th>
        <th className='f12 nunito center'>{t('id')}</th>
        <th className='f12 nunito'>{t('name')}</th>
        <th className='f12 nunito center'>{t('email')}</th>
        <th className='f12 nunito pl17 center'>{t('phoneNumber')}</th>
        <th className='f12 nunito pl17 center'>{t('createdAt')}</th>
        <th className='f12 nunito  center'>{t('actions')}</th>
      </tr>
    </thead>
  );
};

export default TableHeader;