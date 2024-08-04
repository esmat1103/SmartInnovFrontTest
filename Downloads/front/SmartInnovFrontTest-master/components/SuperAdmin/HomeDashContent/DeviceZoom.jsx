import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; 
import returnIcon from '/public/assets/return.svg';
import Image from 'next/image';
import dots from '../../../public/assets/MainDash/dots.svg';
import dayjs from 'dayjs'; 
import Filter from '/public/assets/filter.svg';
import deviceG from '@public/assets/Sidebar/device-g.svg';
import sensorG from '@public/assets/Sidebar/sensor-g.svg';
import adminG from '@public/assets/Sidebar/adminG.svg';

import { fetchDevices } from '../../../app/utils/apis/devices'; 
import { fetchSensorsByDevice } from '../../../app/utils/apis/sensors'; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDevicesByAdminId } from '@app/utils/apis/devices';

const staticData = [
  { device: 'Device 1', temperature: 30, light: 20},
  { device: 'Device 2', temperature: 15, pressure: 50, light: 35},
  { device: 'Device 3', humidity: 40, light: 25, sound: 15 },
  { device: 'Device 4', temperature: 25, humidity: 30 , co2: 12},
 
];

const Device = ({ admins, clients }) => {
  const router = useRouter();
  const [filter, setFilter] = useState('Journalier');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedSensor, setSelectedSensor] = useState('');
  const [devices, setDevices] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [devicesData, setDevicesData] = useState(staticData);

  const handleReturnClick = () => {
    router.push('/SuperAdmin/Home/home');
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    const now = dayjs();
    let filteredData = [];

    switch (newFilter) {
      case 'Journalier':
        filteredData = devicesData.filter(data =>
          dayjs(data.time).isSame(now, 'day')
        );
        break;
      case 'Hebdomadaire':
        filteredData = devicesData.filter(data =>
          dayjs(data.time).isSame(now, 'week')
        );
        break;
      case 'Mensuelle':
        filteredData = devicesData.filter(data =>
          dayjs(data.time).isSame(now, 'month')
        );
        break;
      case 'Annuelle':
        filteredData = devicesData.filter(data =>
          dayjs(data.time).isSame(now, 'year')
        );
        break;
      default:
        filteredData = devicesData;
    }

    setDevicesData(filteredData);
  };

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devicesData = await fetchDevices();
        setDevices(devicesData);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    getDevices();
  }, []);

  useEffect(() => {
    const getSensors = async () => {
      if (selectedDevice) {
        try {
          const sensorsData = await fetchSensorsByDevice(selectedDevice);
          setSensors(sensorsData);
        } catch (error) {
          console.error("Error fetching sensors:", error);
        }
      } else {
        setSensors([]);
      }
    };

    getSensors();
  }, [selectedDevice]);

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
  }, [selectedAdminId, admins]);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleAdminSelect = (adminId) => {
    setSelectedAdminId(adminId);
    setDropdownOpen(false);
  };

  useEffect(() => {
    console.log('admin', admins);
    console.log('clients', clients);
  }, [admins, clients]);

  return (
    <>
      <button className='pt-5' onClick={handleReturnClick} style={{ cursor: 'pointer' }}>
        <Image src={returnIcon} alt='return' width={30} height={30} />
      </button>

      <h2 className="text-white font-bold text-center pb-5 f25">Device Sensor Composition</h2>

      <div className='flex justify-between items-start'>
        <div className="flex space-x-4 items-center">
          <div className="relative">
            <select
              value={selectedAdmin ? selectedAdmin._id : ''}
              onChange={(e) => handleAdminSelect(e.target.value)}
              className="inputSensorReadings pl-8"
            >
              <option value="" disabled hidden>Select an Admin</option>
              {admins.map((admin) => (
                <option key={admin._id} value={admin._id}>
                  {admin.firstName} {admin.lastName} : {admin.email}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
              <Image src={adminG} width={20} height={20} alt='admin' />
            </div>
          </div>

          <div className="relative">
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="inputSensorReadings pl-8"
            >
              <option value="" disabled hidden>Select a device</option>
              {devices.map((device) => (
                <option key={device._id} value={device._id}>
                  {device.sensorReference}: {device.sensorName}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
              <Image src={deviceG} width={20} height={20} alt='device' />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end ml-4 ">
          <div className="notification-filters">
            {['Journalier', 'Hebdomadaire', 'Mensuelle', 'Annuelle'].map(type => (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                className={`filter-button ${filter === type ? 'active' : ''}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className='SensorReadingsContainer relative  pt-5'>
        
        <div className="chart-container text-center pb-5 pr-5">
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={devicesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="device" tick={{ fill: 'white', fontSize: 10 }} />
              <YAxis tick={{ fill: 'white', fontSize: 10 }} /> 
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '15px', paddingLeft: '50px', paddingTop:'10px' }} />
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
    </>
  );
};

export default Device;
