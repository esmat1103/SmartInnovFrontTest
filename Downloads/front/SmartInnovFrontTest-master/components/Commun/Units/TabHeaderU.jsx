import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const TableHeaderU = ({ handleHeaderCheckboxChange, allSelected }) => {
  const { t, i18n } = useTranslation('HeaderUnitsTab');
  const [isTranslationLoaded, setIsTranslationLoaded] = useState(false);

  useEffect(() => {
    const handleLanguageChange = () => {
      setIsTranslationLoaded(true);
    };

    if (i18n.isInitialized) {
      handleLanguageChange();
    } else {
      i18n.on('initialized', handleLanguageChange);
    }

    return () => {
      i18n.off('initialized', handleLanguageChange);
    };
  }, [i18n]);

  if (!isTranslationLoaded) {
    return null; 
  }

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
        <th>{t('SensorType')}</th>
        <th>{t('MeasuredParameter')}</th>
        <th>{t('unitName')}</th>
        <th>{t('Abbreviation')}</th> {/* New column header */}
        <th className="flex justify-end headerrr">{t('actions')}</th>
      </tr>
    </thead>
  );
};

export default TableHeaderU;
