import React, { useState } from 'react';
import circle from '../../../public/assets/MainDash/circlePurple.svg';
import location from '../../../public/assets/MainDash/locations.svg';
import Image from 'next/image';

const StatBox5 = () => {          



    return (
        <>
         <>
  <div className='StatBoxContainer rounded-lg shadow-md'>
    <div className='flex pl-3 pt-2 items-center'>
      <div className='relative'>
        <Image src={circle} alt="circle" width={30} height={30} />
        <Image src={location} alt="admin" width={20} height={20} className='absolute inset-0 m-auto' />
      </div>
      <h1 className='nunito f24 sidebargrey pl-2 pr-2'>Located in</h1>
        <div className='flex justify-center items-center text-center '>
          <h1 className='nunito f20  fw600 white'>963</h1>
          <p className='nunito f14 pl-2  sidebargrey'>countries</p>
      </div>
    </div>
    
  </div>
</>

        </>
     );
};


export default StatBox5;