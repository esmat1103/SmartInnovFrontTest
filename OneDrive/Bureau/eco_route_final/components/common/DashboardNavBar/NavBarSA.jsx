import React, { useState,useEffect } from 'react';
import Image from 'next/image';
import { collection, query, getDocs, onSnapshot } from 'firebase/firestore';
import searchIcon from '@/public/main_content/search.svg';
import dash from '@/public/main_content/dash.svg';
import chevron from '@/public/main_content/bell.svg';
import SuperAdmin from '../popups/profile/SuperAdmin';
import { db,auth } from '@/app/config/firebaseConfig.mjs';
import { sendPasswordResetEmail } from '@/app/config/firebaseConfig.mjs';
import NotifSuperAdminPopup from '../../common/popups/Notifications/Superadmin';
import {startSensorStatusListener}from '@/app/config/maintenanceNotifier';


const NavBar = () => {
    const [showModal, setShowModal] = useState(false);
    const [showNotifModal, setShowNotifModal] = useState(false);
    const [sensorStatus, setSensorStatus] = useState({}); 
    const [notifications, setNotifications] = useState([]);

    const user = auth.currentUser;

    useEffect(() => {
       

        const fetchNotifications = async () => {
            try {
                const q = query(collection(db, 'notifications'));
                const querySnapshot = await getDocs(q);
                const notificationData = querySnapshot.docs.map((doc) => doc.data());
                setNotifications(notificationData);
            } catch (error) {
                console.error('Error getting notifications:', error);
            }
        };

        if (user) {
            
            fetchNotifications();

            const unsubscribe = onSnapshot(collection(db, 'notifications'), (snapshot) => {
                const newNotifications = snapshot.docs.map((doc) => doc.data());
                setNotifications((prevNotifications) => [...prevNotifications, ...newNotifications]);
            });

          

            return () => unsubscribe();
        }
    }, [user]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            startSensorStatusListener(setSensorStatus);
        }, 5000); 
    
        return () => clearInterval(intervalId); 
    }, []);

    const handleProfileClick = () => {
        setShowModal(true);
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleResetPassword = () => {
        try {
            if (!user) {
                console.error('User is not authenticated');
                alert('User is not authenticated');
                return;
            }
    
            sendPasswordResetEmail(auth, user.email)
                .then(() => {
                    console.log('Password reset email sent!');
                    alert('Password reset email sent!');
                })
                .catch((error) => {
                    console.error('Error sending password reset email:', error.message);
                    alert('Failed to send password reset email. Please try again later.');
                });
        } catch (error) {
            console.error('Error sending password reset email:', error.message);
            alert('Failed to send password reset email. Please try again later.');
        }
    };
    const handleNotifClick = () => {
        setShowNotifModal(true);
    };

    const handleCloseNotifModal = () => {
        setShowNotifModal(false);
    };
    

    return (
        <nav className="flex items-center justify-between bg-white p-3">
            <div className="flex items-center">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search here..."
                        style={{ backgroundColor: '#FFFF' }}
                        className="ml-3 py-1 px-4 pr-10 border border-gray-200 rounded-md focus:outline-none"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Image src={searchIcon} alt="Search" width={20} height={20} />
                    </div>
                </div>
            </div>
           <div className="fixed top-0 right-0 mr-3 mt-3">
                <div className="flex items-center">
                    <div className="mr-3 flex ">
                        <div className='notif-container mt-2 mr-2 flex items-center justify-center'>
                            <Image src={chevron} width={15} height={15} alt='chevron'  onClick={handleNotifClick} />
                        </div>
                        <Image src={dash} alt="Profile" width={50} height={50} className="rounded-full cursor-pointer" onClick={handleProfileClick} />
                    </div>
                </div>
            </div>
            {showModal && (
                <div className={'popup open'}>
                    <SuperAdmin
                        userEmail={user.email}
                        onClose={handleCloseModal}
                        onResetPassword={handleResetPassword}
                    />
                </div>
            )}
             <NotifSuperAdminPopup isOpen={showNotifModal} onClose={handleCloseNotifModal}    sensorStatus={sensorStatus} />
        </nav>
    );
};

export default NavBar;
