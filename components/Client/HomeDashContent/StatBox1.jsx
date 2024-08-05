import React, { useState } from 'react';
import Image from 'next/image';
import circle from '../../../public/assets/MainDash/3.svg';

const StatBox1 = () => {          



    return (
        <>
        
  <div className='StatBoxContainer rounded-lg shadow-md'>
    <div className='flex pl-3 pt-2 items-center'>
        <div className='relative'>
            <Image src={circle} alt="circle" width={30} height={30} />
        </div>
        <h1 className='nunito f24 sidebargrey pl-2'>Total Admins</h1>
        <h1 className='nunito f20 fw600 white pl-3 text-center'>369 148</h1>
    </div>
       
   
  </div>
</>

      
     );
};


export default StatBox1;