import React, { useEffect } from 'react';
import Image from 'next/image';
import circle from '../../../public/assets/MainDash/circlePurple.svg';
import admin from '../../../public/assets/Sidebar/team-w.svg';

const StatBox2 = ({ endusers }) => {      
    useEffect(() => {
        console.log('Endusers array:', endusers);
    }, [endusers]);

    const enduserCount = endusers.length;

    return (
        <div className='StatBoxContainer rounded-lg shadow-md'>
            <div className='flex pl-3 pt-2 items-center'>
                <div className='relative'>
                    <Image src={circle} alt="circle" width={30} height={30} />
                    <Image src={admin} alt="admin" width={17} height={17} className='absolute inset-0 m-auto' />
                </div>
                <h1 className='nunito f24 sidebargrey pl-2'>Total Clients</h1>
                <h1 className='nunito f20 fw600 white pl-3 text-center'>{enduserCount}</h1>
            </div>
        </div>
    );
};

export default StatBox2;
