import React, { useState, useEffect } from 'react';
import {
  Tooltip, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import { fetchSensorTypes } from '@app/utils/apis/sensorTypes';
import { fetchSensors } from '@app/utils/apis/sensors';

const CustomPolarAngleAxisTick = ({ x, y, value }) => (
  <text x={x} y={y} fill="white" fontSize={10} textAnchor="middle" dy={5}>
    {value}
  </text>
);

const StatBox11 = () => {
  const [sensorTypeData, setSensorTypeData] = useState([]);

  useEffect(() => {
    const loadSensorData = async () => {
      try {
        const sensorTypes = await fetchSensorTypes();
        const sensors = await fetchSensors();
        console.log('Fetched sensor types:', sensorTypes);
        console.log('Fetched sensors:', sensors);

        // Count sensors by type
        const typeCounts = sensors.reduce((acc, sensor) => {
          if (sensor.type) {
            acc[sensor.type] = (acc[sensor.type] || 0) + 1;
          }
          return acc;
        }, {});

        // Convert typeCounts to the format required by RadarChart
        const formattedData = Object.keys(typeCounts).map(type => ({
          type,
          count: typeCounts[type]
        }));

        setSensorTypeData(formattedData);
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    loadSensorData();
  }, []);

  return (
    <div className='StatBoxContainer5 rounded-lg shadow-md pl-4 pr-4'>
      <h3 className="text-white font-bold text-center text-lg pt-2">Distribution of Sensors by Type</h3>
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={sensorTypeData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="type" tick={<CustomPolarAngleAxisTick />} />
          <PolarRadiusAxis />
          <Radar name="Sensors" dataKey="count" stroke="#04D5C7" fill="#5D69F3" fillOpacity={0.6} />
          <Tooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatBox11;
