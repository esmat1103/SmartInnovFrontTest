import React from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Image from 'next/image';
import dots from '../../../public/assets/MainDash/dots.svg';

const data = [
  { device: 'Device 1', sensor: 'Sensor A', value: 200 },
  { device: 'Device 1', sensor: 'Sensor B', value: 300 },
  { device: 'Device 2', sensor: 'Sensor C', value: 150 },
  { device: 'Device 2', sensor: 'Sensor D', value: 150 },
];

const StatBox7 = () => {
  return (
    <div className='StatBoxContainer4 rounded-lg '>
      <div className='dotsImageContainer'>
          <Image src={dots} width={20} height={20} alt='dots'/>
        </div>
      <BarChart width={300} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="sensor" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default StatBox7;


