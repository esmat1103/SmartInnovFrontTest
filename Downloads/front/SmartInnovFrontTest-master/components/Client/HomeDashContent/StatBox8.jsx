import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Image from 'next/image';
import dots from '../../../public/assets/MainDash/dots.svg';

const data = [
  { name: 'Active', value: 400 },
  { name: 'Inactive', value: 300 },
  { name: 'Faulty', value: 300 },
  { name: 'Pending', value: 200 },
];

const COLORS = ['#04D5C7', '#5D69F3', '#CE2D4F', '#FFBB28'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.67; 
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <g>
      <text x={x} y={y - 10} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <text x={x} y={y + 10} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10}>
        {payload.name}
      </text>
    </g>
  );
};

const StatBox8 = () => {          
  return (
    <>
      <div className='StatBoxContainer5 rounded-lg shadow-md '>
     
        <h1 className='text-white font-bold text-center text-lg pt-2'>Device Status Overview</h1>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={66}
              fill="#5D69F3"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default StatBox8;
