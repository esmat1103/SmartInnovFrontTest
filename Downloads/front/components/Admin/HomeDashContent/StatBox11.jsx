import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Sample data for IoT sensors
const data = [
  { name: 'Temperature Sensors', value: 350 },
  { name: 'Humidity Sensors', value: 250 },
  { name: 'Pressure Sensors', value: 200 },
  { name: 'Motion Sensors', value: 150 },
];

// Colors for each slice
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default class SensorPieChart extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/pie-chart-with-sensor-data-7ux0o';

  render() {
    return (
      <div className='StatBoxContainer5 rounded-lg p-3'>
        <h1 className='text-white font-bold text-center text-lg mb-1'>Sensor Status Overview</h1>

        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              fill="#8884d8"
              paddingAngle={5}
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
  }
}
