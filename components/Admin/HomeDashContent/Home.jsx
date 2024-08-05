import React from 'react';
import StatBox1 from './StatBox1';
import StatBox2 from './StatBox2';
import StatBox3 from './StatBox3';
import StatBox4 from './StatBox4';
import StatBox5 from './StatBox5';
import StatBox6 from './StatBox6';
import StatBox7 from './StatBox7';
import StatBox8 from './StatBox8';
import StatBox9 from './StatBox9';
import StatBox10 from './StatBox10';
import StatBox11 from './StatBox11';
import Image from 'next/image';
import filter from '../../../public/assets/MainDash/filter.svg';
import square from '../../../public/assets/MainDash/squareB.svg';
import chevronD from '../../../public/assets/MainDash/chevronD.svg';

const HomeA = ({ endusers,devices, sensors}) => {
    console.log('Endusers:', endusers);
    console.log('Devices:', devices);
    console.log('Sensors:', sensors);

    return (
        <>
            <h1 className="pl-2 fw600 f14 nunito white f30 pb-1 pt-2">Dashboard Overview</h1>
            {/* <div className='pl-2 filter-bar flex mb-2 mt-2'>
                <Image src={filter} alt='filter' width={20} height={20} />
                <p className='white mx-2 f14 nunito'> Filter : </p>
                <Image src={square} alt='square' width={23} height={30} className='ml-3' />
                <p className='white nunito f14'>Main dashboard Data</p>
                <Image src={chevronD} alt='square' width={10} height={20} className='ml-2' />
                <p className='sidebargrey nunito ml-5'>Dates :</p>
                <p className='white nunito ml-2 f14'>Year 2022 </p>
                <Image src={chevronD} alt='square' width={10} height={20} className='ml-2' />
                <p className='sidebargrey nunito f14 ml-5'>Status :</p>
                <p className='white nunito ml-2 f14'>Current </p>
                <Image src={chevronD} alt='square' width={10} height={20} className='ml-2' />
            </div> */}

            <div className='flex'>
                <div className='ml-3 mr-1'>
                    <StatBox1 />
                </div>
                <div className='mx-1'>
                    <StatBox2 endusers={endusers} />
                </div>
                <div className='mx-1'>
                    <StatBox3 devices={devices} />
                </div>
                <div className='mx-1'>
                    <StatBox4  sensors={sensors}/>
                </div>
                <div className='mx-1'>
                    <StatBox5 />
                </div>
            </div>

            <div className='mt-2 flex mx-2'>
                <div className='mx-1 '>
                    <StatBox8 />
                </div>
                <div className='mx-1 '>
                    <StatBox11 />
                </div>
                <div className='mx-1 '>
                    <StatBox9 />
                </div>
            </div>
            <div className='mt-2 flex mx-2'>
                <div className='mx-1 '>
                     <StatBox7 />
                </div>
                <div className='mx-1 '>
                    <StatBox10 />
                </div>
                <div className='mx-1 '>
                <StatBox6 />

                </div>
            </div>
        </>
    );
};

export default HomeA;
