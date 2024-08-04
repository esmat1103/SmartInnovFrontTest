import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; 
import returnIcon from '/public/assets/return.svg';
import Image from 'next/image';
import dots from '../../../public/assets/MainDash/dots.svg';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Label } from 'recharts';
import dayjs from 'dayjs'; 
import Filter from '/public/assets/filter.svg';
import deviceG from '@public/assets/Sidebar/device-g.svg';
import sensorG from '@public/assets/Sidebar/sensor-g.svg';
import { fetchDevices } from '../../../app/utils/apis/devices'; 
import { fetchSensorsByDevice } from '../../../app/utils/apis/sensors'; 


const phData = [
  { time: dayjs().subtract(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 4.9 },
  { time: dayjs().subtract(28, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 5.0 },
  { time: dayjs().subtract(26, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 5.2 },
  { time: dayjs().subtract(24, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 5.3 },
  { time: dayjs().subtract(22, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 5.5 },
  { time: dayjs().subtract(20, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 5.6 },
  { time: dayjs().subtract(18, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 5.7 },
  { time: dayjs().subtract(16, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 5.8 },
  { time: dayjs().subtract(14, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 5.9 },
  { time: dayjs().subtract(12, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 6.0 },
  { time: dayjs().subtract(10, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 6.1 },
  { time: dayjs().subtract(8, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 6.2 },
  { time: dayjs().subtract(6, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 6.3 },
  { time: dayjs().subtract(4, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 6.4 },
  { time: dayjs().subtract(2, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 6.5 },
  { time: dayjs().format('YYYY-MM-DD HH:mm:ss'), pH: 6.6 },
  { time: dayjs().add(2, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 4.7 },
  { time: dayjs().add(4, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 6.8 },
  { time: dayjs().add(6, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 6.9 },
  { time: dayjs().add(8, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 7.0 },
  { time: dayjs().add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 6.0 },
  { time: dayjs().add(12, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 7.2 },
  { time: dayjs().add(14, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 5.3 },
  { time: dayjs().add(16, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 7.4 },
  { time: dayjs().add(18, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 12.3 },
  { time: dayjs().add(20, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 7.6 },
  { time: dayjs().add(22, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 7.7 },
  { time: dayjs().add(24, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 7.8 },
  { time: dayjs().add(26, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 7.9 },
  { time: dayjs().add(28, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 8.0 },
  { time: dayjs().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 1.1 },
];
const RANGE_MIN = 0;
const RANGE_MAX = 14;
const THRESHOLD_MIN = 4.7;
const THRESHOLD_MAX = 7.3;

const Sensor = () => {
  const router = useRouter();
  const [data, setData] = useState(phData);
  const [filter, setFilter] = useState('Journalier');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedSensor, setSelectedSensor] = useState('');
  const [devices, setDevices] = useState([]);
  const [sensors, setSensors] = useState([]);

  const handleReturnClick = () => {
    router.push('/SuperAdmin/Home/home');
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    const now = dayjs();
    let filteredData = [];

    switch (newFilter) {
      case 'Journalier':
        filteredData = phData.filter(data =>
          dayjs(data.time).isSame(now, 'day')
        );
        break;
      case 'Hebdomadaire':
        filteredData = phData.filter(data =>
          dayjs(data.time).isSame(now, 'week')
        );
        break;
      case 'Mensuelle':
        filteredData = phData.filter(data =>
          dayjs(data.time).isSame(now, 'month')
        );
        break;
      case 'Annuelle':
        filteredData = phData.filter(data =>
          dayjs(data.time).isSame(now, 'year')
        );
        break;
      default:
        filteredData = phData;
    }

    setData(filteredData);
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

  return (
    <>
      <button className='pt-5' onClick={handleReturnClick} style={{ cursor: 'pointer' }}>
        <Image src={returnIcon} alt='return' width={30} height={30} />
      </button>

      <h2 className="text-white font-bold text-center pb-5 f25 ">PH Sensor Data</h2>

      <div className='flex justify-between items-start'>
        <div className="flex space-x-4 items-center">
          <div className="relative">
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="inputSensorReadings pl-8"
            >
              <option value="" disabled hidden>Select a Device</option>
              {devices.map((device) => (
                <option key={device._id} value={device._id}>
                  {device.deviceName}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
              <Image src={deviceG} width={20} height={20} alt='device' />
            </div>
          </div>

          <div className="relative">
            <select
              value={selectedSensor}
              onChange={(e) => setSelectedSensor(e.target.value)}
              className="inputSensorReadings pl-8"
            >
              <option value="" disabled hidden>Select a Sensor</option>
              {sensors.map((sensor) => (
                <option key={sensor._id} value={sensor._id}>
                 {sensor.sensorReference}: {sensor.sensorName}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
              <Image src={sensorG} width={20} height={20} alt='sensor' />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end ml-4">
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

      <div className='SensorReadingsContainer relative'>
        <div className='dotsImageContainer'>
          <Image src={dots} width={20} height={20} alt='dots' />
        </div>

        <div className="" style={{ textAlign: 'center' }}>
          <LineChart
            width={1200}
            height={500}
            data={data}
            margin={{ top: 50, right: 20, bottom: 20, left: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" />
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#ffffff', fontSize: 12 }} 
              tickFormatter={(tick) => dayjs(tick).format('HH:mm')} 
            />
            <YAxis 
              domain={[RANGE_MIN, RANGE_MAX]} 
              tick={{ fill: '#ffffff', fontSize: 12 }} 
            />
            <Tooltip />
            <Legend wrapperStyle={{ color: '#ffffff' }} />
            <Line 
              type="monotone" 
              dataKey="pH" 
              stroke="#5D69F3" 
              strokeWidth={2} 
              activeDot={{ r: 8 }} 
            />
            <ReferenceLine y={RANGE_MIN} stroke="#CE2D4F" strokeDasharray="3 3" strokeWidth={2}>
              <Label 
                value="Range Min" 
                position="left" 
                offset={19} 
                fill="#ffffff" 
                fontSize={9} 
              />
            </ReferenceLine>
            <ReferenceLine y={RANGE_MAX} stroke="#CE2D4F" strokeDasharray="3 3" strokeWidth={2}>
              <Label 
                value="Range Max" 
                position="left" 
                offset={22} 
                fill="#ffffff" 
                fontSize={9} 
              />
            </ReferenceLine>
            <ReferenceLine y={THRESHOLD_MIN} stroke="#04D5C7" strokeDasharray="3 3" strokeWidth={2}>
              <Label 
                value="Threshold Min" 
                position="left" 
                offset={19} 
                fill="#ffffff" 
                fontSize={9} 
              />
            </ReferenceLine>
            <ReferenceLine y={THRESHOLD_MAX} stroke="#04D5C7" strokeDasharray="3 3" strokeWidth={2}>
              <Label 
                value="Threshold Max" 
                position="left" 
                offset={22} 
                fill="#ffffff" 
                fontSize={9} 
              />
            </ReferenceLine>
          </LineChart>
        </div>
      </div>
    </>
  );
};

export default Sensor;