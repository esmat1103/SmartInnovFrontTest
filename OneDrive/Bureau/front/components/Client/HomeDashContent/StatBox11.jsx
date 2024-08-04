import React from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import Image from 'next/image';
import dots from '../../../public/assets/MainDash/dots.svg';

const batteryLevelData = [
  { name: 'High', value: 40, fill: '#CE2D4F' },
  { name: 'Medium', value: 35, fill: '#FFBB28' },
  { name: 'Low', value: 15, fill: '#04D5C7' },
  { name: 'Critical', value: 10, fill: '#5D69F3' },
];

const StatBox11 = () => {
  return (
    <div className='StatBoxContainer5 rounded-lg shadow-md p-2'>
      <div className='dotsImageContainer mb-2'>
        <Image src={dots} width={16} height={16} alt='dots'/>
      </div>
      <h1 className='text-white font-bold text-center text-lg pt-1'>Battery Level Distribution</h1>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={batteryLevelData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={30}
            outerRadius={60}
          >
            {batteryLevelData.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="horizontal" align="center" verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatBox11;
