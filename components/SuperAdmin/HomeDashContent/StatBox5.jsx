import React, { useEffect, useState } from 'react';
import circle from '../../../public/assets/MainDash/circlePurple.svg';
import location from '../../../public/assets/MainDash/locations.svg';
import Image from 'next/image';
import { fetchDevices } from '@app/utils/apis/devices';

const StatBox5 = () => {
  const [devices, setDevices] = useState([]);
  const [uniqueCountryCount, setUniqueCountryCount] = useState(0);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const devicesData = await fetchDevices();
        setDevices(devicesData);

        // Create a Set to keep track of unique country IDs
        const uniqueCountryIds = new Set(devicesData.map(device => device.countryId));
        
        // Update the unique country count
        setUniqueCountryCount(uniqueCountryIds.size);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    loadDevices();
  }, []);

  return (
    <>
      <div className='StatBoxContainer rounded-lg shadow-md'>
        <div className='flex pl-3 pt-2 items-center'>
          <div className='relative'>
            <Image src={circle} alt="circle" width={30} height={30} />
            <Image src={location} alt="admin" width={20} height={20} className='absolute inset-0 m-auto' />
          </div>
          <h1 className='nunito f24 sidebargrey pl-2 pr-2'>Located in</h1>
          <div className='flex justify-center items-center text-center '>
            <h1 className='nunito f20 fw600 white'>{uniqueCountryCount}</h1>
            <p className='nunito f14 pl-2 sidebargrey'>countries</p>
          </div>
        </div>
        
        {/* Display fetched devices */}
        <div className='pl-3 pt-2'>
          <h2 className='nunito f20 white'>Devices</h2>
          <ul className='pl-4 list-disc'>
            {devices.map((device, index) => (
              <li key={index} className='nunito f16 white'>
                {device.deviceName}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default StatBox5;
