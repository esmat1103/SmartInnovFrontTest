import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import chevron from '@/public/main_content/bell.svg';
import searchIcon from '@/public/main_content/search.svg';
import Admin from '../popups/profile/Admin';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/app/config/firebaseConfig.mjs';
import NotifAdminPopup from '../popups/Notifications/Admin/AdminNotif';
import {startSensorStatusListener}from '@/app/config/maintenanceNotifier';


const NavBarAdmin = () => {
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showNotifModal, setShowNotifModal] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [sensorStatus, setSensorStatus] = useState({}); 

    const user = auth.currentUser;

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const q = query(collection(db, 'admins'), where('uid', '==', user.uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, ' => ', doc.data());
                    const userData = doc.data();
                    setFirstName(userData.first_name);
                    setLastName(userData.last_name);
                    setEmail(userData.email);
                    setProfilePic(userData.imageUrl);
                });
            } catch (error) {
                console.error('Error getting user document:', error);
            }
        };

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
            fetchProfileData();
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
        setShowProfileModal(true);
    };

    const handleCloseProfileModal = () => {
        setShowProfileModal(false);
    };

    const handleNotifClick = () => {
        setShowNotifModal(true);
    };

    const handleCloseNotifModal = () => {
        setShowNotifModal(false);
    };

    const handleResetPassword = () => {
        try {
            auth.sendPasswordResetEmail(user.email);
            alert('Password reset email sent!');
        } catch (error) {
            console.error('Error sending password reset email:', error);
            alert('Failed to send password reset email. Please try again later.');
        }
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
            <div className="fixed top-0 right-0 mr-3 mt-2">
                <div className="flex items-center">
                    <div className="mr-3 flex">
                        <div className='notif-container  mr-2 flex items-center justify-center' onClick={handleNotifClick}>
                            <Image src={chevron} width={15} height={15} alt='chevron' />
                        </div>
                        <Image src={profilePic} alt="Profile" width={50} height={50} className="rounded-full cursor-pointer" onClick={handleProfileClick} />
                    </div>
                </div>
            </div>
            {showProfileModal && (
                <div className={'popup open'}>
                    <Admin
                        userfirstName={firstName}
                        userlastName={lastName}
                        userEmail={email}
                        onClose={handleCloseProfileModal}
                        onResetPassword={handleResetPassword}
                    />
                </div>
            )}
            <NotifAdminPopup isOpen={showNotifModal} onClose={handleCloseNotifModal} notifications={notifications} sensorStatus={sensorStatus} />
        </nav>
    );
};

export default NavBarAdmin;
