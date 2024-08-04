import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const TableHeaderT = ({ handleHeaderCheckboxChange, allSelected }) => {
  const [language, setLanguage] = useState('en'); 
  const { t } = useTranslation('HeaderSensorsTab'); 

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) { 
      setLanguage(storedLanguage);
    }
  }, []);

  return (
    <thead className="table-header darkgrey">
      <tr className="table-header-row f12 nunito">
        <th>
          <input 
            type="checkbox" 
            className="custom-checkbox" 
            onChange={handleHeaderCheckboxChange} 
            checked={allSelected}
          />
        </th>
        <th className='center'>{t('ref')}</th>
        <th className='pl23 center'>{t('name')}</th>
        <th className='pl23 center'>{t('unit')}</th>
        <th className='pl23 center'>{t('rangeMin')}</th>
        <th className='pl23 center'>{t('rangeMax')}</th>
        <th className="pl23 center">{t('pulse')}</th>
        <th className='pl23 center'>{t('Coefficient')}</th>
        <th className="center">{t('actions')}</th>
      </tr>
    </thead>
  );
};

export default TableHeaderT;
