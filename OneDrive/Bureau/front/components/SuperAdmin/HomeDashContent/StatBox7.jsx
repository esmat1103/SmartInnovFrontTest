import React from 'react';
import Image from 'next/image';
import image1 from '../../../public/assets/Table/cl4.jpg';
import image2 from '../../../public/assets/Table/cl5.jpg';
import image3 from '../../../public/assets/Table/cl2.jpg';

const StatBox7 = () => {
    return (
        <div className='StatBoxContainer4 p-4 bg-gray-900 rounded-lg shadow-md'>
            <div className='flex justify-between items-center mb-3'>
                <h1 className='text-white font-semibold text-sm'>Last Complaints</h1>
                <p className='text-[#5D69F3] text-xs cursor-pointer hover:underline'>View All</p>
            </div>
            <div className='space-y-2'>
                <div className='flex items-center'>
                    <div className='profile-container'>
                        <Image 
                            src={image1} 
                            alt="Complaint Image" 
                            id="profile-pic" 
                            className='rounded-full high-quality-image'
                        />
                    </div>
                    <div className='ml-2 text-xs'>
                        <p className='text-white font-medium'>John Doe, <span className='text-gray-400'>JohnDoeMsres@gmail.com</span></p>
                        <p className='text-gray-500 text-[10px]'>
                            Date: <span className='text-[#5D69F3] font-semibold'>2024-07-23</span> | 
                            Device: <span className='text-[#CE2D4F] font-semibold'>Temp Sensor</span> | 
                            Status: <span className='text-[#04D5C7] font-semibold'>Pending</span>
                        </p>
                        <p className='text-gray-300 mt-1 text-[10px]'>Issue: Inaccurate data.</p>
                    </div>
                </div>
                <hr className='border-t border-gray-700'/>
                <div className='flex items-center'>
                    <div className='profile-container'>
                        <Image 
                            src={image2} 
                            alt="Complaint Image" 
                            id="profile-pic" 
                            className='rounded-full high-quality-image'
                        />
                    </div>
                    <div className='ml-2 text-xs'>
                        <p className='text-white font-medium'>Jane Smith, <span className='text-gray-400'>JaneSmithIoT@gmail.com</span></p>
                        <p className='text-gray-500 text-[10px]'>
                            Date: <span className='text-[#5D69F3] font-semibold'>2024-07-22</span> | 
                            Device: <span className='text-[#CE2D4F] font-semibold'>Motion Sensor</span> | 
                            Status: <span className='text-[#04D5C7] font-semibold'>Resolved</span>
                        </p>
                        <p className='text-gray-300 mt-1 text-[10px]'>Issue: Connectivity Issue.</p>
                    </div>
                </div>
                <hr className='border-t border-gray-700'/>
                <div className='flex items-center'>
                    <div className='profile-container'>
                        <Image 
                            src={image3} 
                            alt="Complaint Image" 
                            id="profile-pic" 
                            className='rounded-full high-quality-image'
                        />
                    </div>
                    <div className='ml-2 text-xs'>
                        <p className='text-white font-medium'>Alice Johnson, <span className='text-gray-400'>AliceJohnsonIoT@gmail.com</span></p>
                        <p className='text-gray-500 text-[10px]'>
                            Date: <span className='text-[#5D69F3] font-semibold'>2024-07-21</span> | 
                            Device: <span className='text-[#CE2D4F] font-semibold'>Humidity Sensor</span> | 
                            Status: <span className='text-[#04D5C7] font-semibold'>In Progress</span>
                        </p>
                        <p className='text-gray-300 mt-1 text-[10px]'>Issue: Sensor malfunction.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatBox7;
