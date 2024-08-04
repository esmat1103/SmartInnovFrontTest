import React, { useEffect } from 'react';
import Image from 'next/image';
import circle from '../../../public/assets/MainDash/circlePurple.svg';
import sensor from '../../../public/assets/Sidebar/sensor-w.svg';

const StatBox4 = ({ sensors }) => {
  useEffect(() => {
    console.log('Sensors array:', sensors);
  }, [sensors]);

  const sensorCount = sensors.length;

  return (
    <div className='StatBoxContainer rounded-lg shadow-md'>
      <div className='flex pl-3 pt-2 items-center'>
        <div className='relative'>
          <Image src={circle} alt="circle" width={30} height={30} />
          <Image src={sensor} alt="sensor" width={20} height={20} className='absolute inset-0 m-auto' />
        </div>
        <h1 className='nunito f24 sidebargrey pl-2'>Total Sensors</h1>
        <h1 className='nunito f20 fw600 white pl-3 text-center'>{sensorCount}</h1>
      </div>
    </div>
  );
};

export default StatBox4;
