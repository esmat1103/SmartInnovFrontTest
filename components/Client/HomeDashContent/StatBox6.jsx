import React from 'react';

import Image from 'next/image';
import dots from '../../../public/assets/MainDash/dots.svg';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const sensorData = [
  { time: '2024-01', temperature: 22.5, humidity: 60 },
  { time: '2024-02', temperature: 23.0, humidity: 65 },
  { time: '2024-03', temperature: 24.5, humidity: 70 },
  { time: '2024-04', temperature: 26.0, humidity: 75 },
  { time: '2024-05', temperature: 27.5, humidity: 80 },
  { time: '2024-06', temperature: 28.0, humidity: 85 },
  { time: '2024-07', temperature: 29.0, humidity: 90 },
];

const StatBox6 = () => {
  return (
    <div className='StatBoxContainer4 rounded-lg shadow-md p-4'>
      <div className='dotsImageContainer'>
          <Image src={dots} width={20} height={20} alt='dots'/>
        </div>

      <h1 className='text-white font-bold text-center text-lg mb-3'>Sensor Readings Over Time</h1>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={sensorData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="temperature" stroke="#8884d8" strokeWidth={2} />
          <Line type="monotone" dataKey="humidity" stroke="#82ca9d" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatBox6;
