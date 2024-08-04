import React from 'react';
import Image from 'next/image';
import Notification from '/public/assets/Navbar/notif.svg';
import Search from '/public/assets/Navbar/search.svg';
import Pic from '/public/assets/Navbar/picture.jpg';

const Navbar = () => {
    return (
        <nav className="navbar fixed flex justify-between items-center p-4 z-10 w-full">
        <div className="flex items-center mx-3 mr-3 ml-auto">
            <div className="icons-container mt-2 mr-2 flex items-center justify-center">
                <button className="flex items-center justify-center text-white p-0 m-0">
                    <Image src={Notification} alt='notification' width={15} id="notification-icon" className='m-0' />
                </button>
            </div>
            <div className="profile-container mt-2 mr-2 flex items-center justify-center">
                <button className="flex items-center justify-center text-white p-0 m-0">
                    <Image src={Pic} alt='pic' id="profile-pic" className='m-0' />
                </button>
            </div>
        </div>
    </nav>
    
    );
};

export default Navbar;
