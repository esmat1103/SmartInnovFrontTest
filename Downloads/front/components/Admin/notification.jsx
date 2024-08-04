import React, { useState } from 'react';
import Image from 'next/image';
import tick from '/public/assets/tick-double.svg';
import dot from '/public/assets/dot.svg';

const NotificationPopup = ({ onClose }) => {
    const [filter, setFilter] = useState('All');

    const notifications = [
        {
            title: 'New Message',
            content: 'You have received a new message from John Doe.You have received a new message from John DoeYou have received a new message from John Doe',
            date: '2024-06-20',
            time: '14:30',
            type: 'Devices'
        },
        {
            title: 'System Alert',
            content: 'Your system will undergo maintenance at midnight.You have received a new message from John DoeYou have received a new message from John Doe',
            date: '2024-06-19',
            time: '12:00',
            type: 'Devices'
        },
        {
            title: 'Reminder',
            content: 'Don\'t forget your meeting at 3 PM today.You have received a new message from John DoeYou have received a new message from John Doe',
            date: '2024-06-18',
            time: '09:00',
            type: 'Devices'
        },
        {
            title: 'Meeting Notification',
            content: 'You have a meeting with the team at 4 PM tomorrow.You have received a new message from John Doe',
            date: '2024-06-21',
            time: '10:00',
            type: 'Sensors'
        },
        {
            title: 'Project Update',
            content: 'Project update meeting rescheduled to 2 PM.You have received a new message from John Doe',
            date: '2024-06-20',
            time: '11:00',
            type: 'Sensors'
        },
        {
            title: 'Sensor Alert',
            content: 'Sensor #123 is reporting high temperature.You have received a new message from John Doe',
            date: '2024-06-20',
            time: '15:00',
            type: 'Clients'
        },
        {
            title: 'Client Message',
            content: 'Client X has sent a new message.',
            date: '2024-06-21',
            time: '16:00',
            type: 'Clients'
        }
    ];

    const filteredNotifications = filter === 'All' 
    ? notifications 
    : notifications.filter(notification => notification.type === filter);

    const totalNotificationCount = notifications.length;

    const markAllAsRead = () => {
        console.log("Marking all notifications as read");
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    return (
        <div className="notification-popup">
            <div className="notification-header">
                <span className='notification-span'>Notifications</span>
                <button className="mark-all-read-button" onClick={markAllAsRead}>
                    <Image src={tick} alt="Mark all read" className="button-icon" width={15} />
                    <span className="button-text">Mark all read</span>
                </button>
            </div>
            <div className="notification-filters">
                {['All', 'Devices', 'Sensors', 'Clients'].map(type => (
                    <button key={type} onClick={() => handleFilterChange(type)} className={`filter-button  ${filter === type ? 'active' : ''}`}>
                        {type === 'All' ? 'All' : type} 
                        {type === 'All' && <span className={`notification-count ${filter === 'All' ? 'active' : ''}`}>{totalNotificationCount}</span>}
                        {type !== 'All' && <span className={`notification-count ${filter === type ? 'active' : ''}`}>{notifications.filter(notification => notification.type === type).length}</span>}
                    </button>
                ))}
            </div>
            <div className="notification-list">
                {filteredNotifications.map((notification, index) => (
                    <div key={index} className="notification-item">
                        <div className="notification-title flex">{notification.title} 
                          <div className="notification-icon">
                            <Image src={dot} alt="Notification Icon" height={30} />
                          </div>
                        </div>
                        <div className="notification-content">{notification.content}</div>
                        <div className="notification-date">{notification.date} at {notification.time}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationPopup;
