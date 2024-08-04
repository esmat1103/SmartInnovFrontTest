import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const HeaderC = ({ handleHeaderCheckboxChange }) => {
  const [language, setLanguage] = useState('en'); 
  const { t } = useTranslation('HeaderComplaintsTab'); 
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
        <th className='f9 nunito'>{t('clientId')}</th>
          <th className='f9 nunito'>{t('clientName')}</th>
          <th className='f9 nunito'>{t('complaintDetails')}</th>
          <th className='f9 nunito'>{t('status')}</th>
          <th className='f9 nunito'>{t('actionDue')}</th>
          <th className='f9 nunito center'>{t('dateTime')}</th>
          <th className='f9 nunito'>{t('sensorId')}</th>
          <th className='f9 nunito'>{t('sensorType')}</th>
          <th className='f9 nunito'>{t('sensorStatus')}</th>
          <th className='f9 nunito'>{t('sensorUrgency')}</th>
          <th className='f9 nunito'>{t('lastRecordedData')}</th>
          <th className='f9 nunito'>{t('lastCommunication')}</th>
       
      </tr>
    </thead>
  );
};

export default HeaderC;
