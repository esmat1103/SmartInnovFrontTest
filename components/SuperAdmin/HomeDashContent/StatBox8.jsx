import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const API_URL = 'http://localhost:4002/devices';

const fetchDevices = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const COLORS = ['#04D5C7', '#5D69F3', '#CE2D4F', '#FFBB28'];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.59; 
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
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const devices = await fetchDevices();

        // Count devices by status
        const statusCounts = {
          'In use': 0,
          'Maintenance': 0,
          'Suspended': 0
        };

        devices.forEach(device => {
          if (statusCounts.hasOwnProperty(device.status)) {
            statusCounts[device.status]++;
          }
        });

        // Prepare data, excluding zero-value entries
        const preparedData = Object.keys(statusCounts)
          .filter(status => statusCounts[status] > 0)
          .map(status => ({
            name: status,
            value: statusCounts[status]
          }));

        setData(preparedData);
      } catch (error) {
        console.error('Error fetching device data:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className='StatBoxContainer5 rounded-lg shadow-md'>
      <h1 className='text-white font-bold text-center text-lg pt-2'>Device Status Overview</h1>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={70}
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
  );
};

export default StatBox8;
