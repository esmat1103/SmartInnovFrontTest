import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const TableHeaderD = ({ handleHeaderCheckboxChange }) => {
  const [language, setLanguage] = useState('en'); 
  const { t } = useTranslation('HeaderDevicesTab'); 


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
        <th className='f12 nunito pl23 center'>{t('name')}</th>
        <th className='f12 nunito center'>{t('macAddress')}</th>
        <th className='f12 nunito pl17 center'>{t('country')}</th>
        <th className='f12 nunito pl17 center'>{t('state')}</th>
        <th className='f12 nunito pl23 center'>{t('admin')}</th>
        <th className='f12 nunito pr30'>{t('sensors')}</th>
        <th className='f12 nunito pl70 center'>{t('status')}</th>
        <th className='f12 nunito pl35 '>{t('actions')}</th>
      </tr>
    </thead>
  );
};

export default TableHeaderD;
