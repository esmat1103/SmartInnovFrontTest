import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Image from 'next/image';
import close from '@/public/main_content/arrow1.svg';
import danger from '@/public/main_content/notif2.svg';
import tick from '@/public/main_content/tick.svg';
import NotificationPopupContent from './Admin/NotificationPopupContent';
import sensor1 from '@/public/main_content/notif3.svg';

const NotifSuperAdminPopup = ({ isOpen, onClose , sensorStatus }) => {
    const [filter, setFilter] = useState('all');
    const [notifications, setNotifications] = useState([]);
    const [employeeDetails, setEmployeeDetails] = useState({});
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [db, setDb] = useState(null);

    useEffect(() => {
        const firestore = getFirestore();
        setDb(firestore);
    
        const fetchNotifications = async () => {
            try {
                const notificationsCollection = collection(firestore, 'notifications');
                const q = query(notificationsCollection, orderBy('timestamp', 'desc'));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const newNotifications = querySnapshot.docs.map(doc => {
                        const data = doc.data();
                        const timestamp = data.timestamp.toDate().toLocaleString('en-US', { timeZone: 'UTC' });
                        return {
                            id: doc.id,
                            routeId: data.routeId,
                            timestamp,
                            type: data.type,
                            userUID: data.userUID
                        };
                    });
                    setNotifications(newNotifications);
                });
    
                return unsubscribe;
            } catch (error) {
                console.error('Error fetching notifications:', error);
                return () => {}; 
            }
        };
    
        const unsubscribe = fetchNotifications();
    
        return () => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, []);
    
    useEffect(() => {
        if (db && notifications.length > 0) {
            const fetchEmployeeDetails = async () => {
                const employeeDetailsObj = {};
                const auth = getAuth();
                try {
                    const employeesCollection = collection(db, 'employees');
                    for (const notification of notifications) {
                        const employeeQuery = query(employeesCollection, where('uid', '==', notification.userUID));
                        const unsubscribe = onSnapshot(employeeQuery, (employeeSnapshot) => {
                            employeeSnapshot.forEach(doc => {
                                const employeeData = doc.data();
                                if (notification.type === 'wrong_route') {
                                    employeeDetailsObj[notification.userUID] = {
                                        ...employeeData,
                                        type: 'wrong_route'
                                    };
                                } else if (notification.type === 'correct_route') {
                                    employeeDetailsObj[notification.userUID] = {
                                        ...employeeData,
                                        type: 'correct_route'
                                    };
                                }
                                setEmployeeDetails(prevDetails => ({
                                    ...prevDetails,
                                    ...employeeDetailsObj
                                }));
                            });
                        });
                    }
                } catch (error) {
                    console.error('Error fetching employee details:', error);
                }
            };
            
            fetchEmployeeDetails();
        }
    }, [db, notifications]);
    
    useEffect(() => {
        console.log("Sensor status received:", sensorStatus);
    }, [sensorStatus]);
    
    const handleFilter = (type) => {
        setFilter(type);
    };

    const groupedNotifications = notifications.reduce((acc, notification) => {
        const date = notification.timestamp.split(',')[0];
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(notification);
        return acc;
    }, {});

    
    const filteredNotifications = Object.entries(groupedNotifications)
        .filter(([date]) => {
            if (filter === 'all') return true;
            const today = new Date();
            const notificationDate = new Date(date);
            if (filter === 'day') {
                return (
                    notificationDate.getDate() === today.getDate() &&
                    notificationDate.getMonth() === today.getMonth() &&
                    notificationDate.getFullYear() === today.getFullYear()
                );
            }
            if (filter === 'week') {
                const daysDifference = Math.ceil((today - notificationDate) / (1000 * 60 * 60 * 24));
                return daysDifference <= 7;
            }
            if (filter === 'month') {
                return (
                    notificationDate.getMonth() === today.getMonth() &&
                    notificationDate.getFullYear() === today.getFullYear()
                );
            }
            return true;
        });

    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification);
    };

    const closePopup = () => {
        setSelectedNotification(null);
    };


    return (
        
         <>
            {isOpen && db && (
                <>
                    <div className="overlay" onClick={onClose}></div>
                    <div className="popupNotif">
                        <button onClick={onClose} className="closeBtn">
                            <Image src={close} alt="close" width={30} />
                        </button>
                        <div className="Notifcontent">
                            <h1 className='notificationHeader'>Notifications</h1>
                            <div className="filterButtons">
                                <button onClick={() => handleFilter('all')} className={`filterButton ${filter === 'all' ? 'active' : ''}`}>All</button>
                                <button onClick={() => handleFilter('day')} className={`filterButton ${filter === 'day' ? 'active' : ''}`}>Day</button>
                                <button onClick={() => handleFilter('week')} className={`filterButton ${filter === 'week' ? 'active' : ''}`}>Week</button>
                                <button onClick={() => handleFilter('month')} className={`filterButton ${filter === 'month' ? 'active' : ''}`}>Month</button>
                            </div>
                            <ul className="notificationList">
                                {filteredNotifications.map(([date, notifications]) => (
                                    <React.Fragment key={date}>
                                        <div className="dateContainer">
                                            <div className="date">{date}</div>
                                        </div>
                                        {notifications.map((notification, index) => (
                                            <li key={`${date}_${index}`} className={`notificationItem ${notification.type === 'wrong_route' ? 'notificationItemPink' : 'notificationItemGreen'}`} onClick={() => handleNotificationClick(notification)}>
                                                <div className="icon">
                                                    <Image src={notification.type === 'wrong_route' ? danger : tick} alt="icon" width={20} height={20} />
                                                </div>
                                                <div className="text">
                                                    <div className="message">
                                                        {notification.type === 'wrong_route' && employeeDetails[notification.userUID] ? (
                                                            <p><strong>Employee Deviation Alert:</strong> {`${employeeDetails[notification.userUID].first_name} ${employeeDetails[notification.userUID].last_name} working in ${employeeDetails[notification.userUID].governorate}, ${employeeDetails[notification.userUID].municipality} has deviated from their assigned route.`}</p>
                                                        ) : notification.type === 'correct_route' && employeeDetails[notification.userUID] ? (
                                                            <p><strong>Route Completion Success:</strong> {`${employeeDetails[notification.userUID].first_name} ${employeeDetails[notification.userUID].last_name} working in ${employeeDetails[notification.userUID].governorate}, ${employeeDetails[notification.userUID].municipality} has successfully completed their assigned route.`}</p>
                                                        ) : (
                                                            <>
                                                                <p>Route ID: {notification.routeId}</p>
                                                                <p>User UID: {notification.userUID}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="timestamp">{notification.timestamp.split(',')[1]}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </React.Fragment>
                                ))}
                                {Object.entries(sensorStatus).map(([sensor, status], index) => (
                                    status === "Not working" && (
                                        <li key={`sensor_${sensor}_${index}`} className="notificationItem notificationItemlila">
                                            <div className="icon">
                                                <Image src={sensor1} alt="icon" width={17} height={17} />
                                            </div>
                                            <div className="text">
                                                <div className="message">
                                                    <p className='mt-2'><strong>{sensor} Sensor Alert:</strong> Sensor is not working.</p>
                                                </div>
                                                <div className="timestamp">{new Date().toLocaleTimeString()} PM</div>
                                            </div>
                                        </li>
                                    )
                                ))}
                            </ul>
                        </div>
                    </div>
                </>
            )}
            {selectedNotification && (
                <NotificationPopupContent 
                    notification={selectedNotification} 
                    employeeDetails={employeeDetails[selectedNotification.userUID]} 
                    onClose={closePopup} 
                />
            )}
        </>
    );
};


export default NotifSuperAdminPopup;
