import React, { useState } from 'react';
import circle from '../../../public/assets/MainDash/circlePurple.svg';
import sensor from '../../../public/assets/Sidebar/sensor-w.svg';
import Image from 'next/image';

const StatBox4 = () => {          



    return (
        <>
          <div className='StatBoxContainer rounded-lg shadow-md'>
          <div className='flex pl-3 pt-2 items-center'>
                <div className='relative'>
                    <Image src={circle} alt="circle" width={30} height={30} />
                    <Image src={sensor} alt="admin" width={20} height={20} className='absolute inset-0 m-auto' />
                </div>
                <h1 className='nunito f24 sidebargrey  pl-2'>Total Sensors</h1>
                <h1 className='nunito f20 fw600 white pl-3 text-center'>963 148</h1>

            </div>
            
          </div>
        </>
     );
};


export default StatBox4;