import React from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Image from 'next/image';
import dots from '../../../public/assets/MainDash/dots.svg';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const StatBox10 = () => {          
  return (
    <>

      <div className='StatBoxContainer4 rounded-lg shadow-md'>
      <div className='dotsImageContainer'>
          <Image src={dots} width={20} height={20} alt='dots'/>
        </div>
        <h1 className='text-white font-bold text-center text-lg  pb-3'>Page Views and Unique Visitors</h1>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            width={300}
            height={200}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" fill="#D4D9F1"  />
            <Bar dataKey="uv" fill="#5D69F3" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default StatBox10;
