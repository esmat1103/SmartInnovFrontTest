import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import dots from '../../../public/assets/MainDash/dots.svg';
import zoom from '../../../public/assets/MainDash/Zoomin.svg';
import zoomBlue from '../../../public/assets/MainDash/ZoominBlue.svg';
import { useRouter } from 'next/router'; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDevicesByAdminId } from '@app/utils/apis/devices';

const staticData = [
  { device: 'Device 1', temperature: 30, light: 20 },
  { device: 'Device 2', temperature: 15, co2: 8 },
  { device: 'Device 3', humidity: 9, light: 25},
  { device: 'Device 4', temperature: 25, humidity: 60 },
  
];

const StatBox6 = ({ admins }) => {
  const router = useRouter(); 
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [devicesData, setDevicesData] = useState(staticData);
  const [isZoomHovered, setIsZoomHovered] = useState(false);

  useEffect(() => {
    if (selectedAdminId) {
      const fetchDevices = async () => {
        try {
          const devices = await getDevicesByAdminId(selectedAdminId);
          setDevicesData(devices);
          console.log('Fetched devices for admin:', devices);
        } catch (error) {
          console.error('Error fetching devices:', error);
        }
      };

      fetchDevices();

      const admin = admins.find(admin => admin._id === selectedAdminId);
      setSelectedAdmin(admin);
    } else {
      setDevicesData(staticData);
      setSelectedAdmin(null);
    }
  }, [selectedAdminId]);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleAdminSelect = (adminId) => {
    setSelectedAdminId(adminId);
    setDropdownOpen(false);
  };

  const handleZoomClick = () => {
    router.push('/SuperAdmin/Home/Devices');
  };

  return (
    <div className='StatBoxContainer4'>
      <div className='relative'>
        <div className='dotsImageContainer' onClick={toggleDropdown}>
          <Image src={dots} width={20} height={20} alt='dots' />
        </div>
        <div 
          className='ZoominImageContainer' 
          onClick={handleZoomClick} 
          onMouseEnter={() => setIsZoomHovered(true)}
          onMouseLeave={() => setIsZoomHovered(false)}
        >
          <Image src={isZoomHovered ? zoomBlue : zoom} width={20} height={20} alt='zoom' />
        </div>
        {isDropdownOpen && (
          <div className='dropdownMenu'>
            <ul>
              {admins.map((admin, index) => (
                <li
                  key={index}
                  className='p-2 hover:bg-gray-700 cursor-pointer'
                  onClick={() => handleAdminSelect(admin._id)}
                >
                  <span className='fw600 f9'>{admin.firstName} {admin.lastName} :</span>
                  <span className='f10'> {admin.email} </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="chart-container text-center pb-5 pr-5">
        <h2 className="text-white pt-3 fw600 f14 pt-2 pb-2">
          {selectedAdmin ? `${selectedAdmin.firstName} ${selectedAdmin.lastName}'s Device Sensor Composition` : 'Device Sensor Composition'}
        </h2>
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={devicesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="device" tick={{ fill: 'white', fontSize: 10 }} />
            <YAxis tick={{ fill: 'white', fontSize: 10 }} /> 
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '10px', paddingLeft: '50px' }} />
            <Bar dataKey="temperature" stackId="a" fill="#5D69F3" />
            <Bar dataKey="light" stackId="a" fill="#04D5C7" />
            <Bar dataKey="humidity" stackId="a" fill="#FFBB28" />
            <Bar dataKey="pressure" stackId="a" fill="#FE996C" />
            <Bar dataKey="sound" stackId="a" fill="#8a2be2" />
            <Bar dataKey="motion" stackId="a" fill="#CE2D4F" />
            <Bar dataKey="co2" stackId="a" fill="#ff1493" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatBox6;
