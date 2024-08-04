import React, { useState } from 'react';
import Image from 'next/image';
import dots from '../../../public/assets/MainDash/dots.svg';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Label } from 'recharts';
import dayjs from 'dayjs'; // Make sure dayjs is installed

// Define data with consistent time format
const phData = [
  { time: dayjs().subtract(10, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 5 },
  { time: dayjs().subtract(8, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 6 },
  { time: dayjs().subtract(6, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 7 },
  { time: dayjs().subtract(4, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 8 },
  { time: dayjs().subtract(2, 'minutes').format('YYYY-MM-DD HH:mm:ss'), pH: 7.5 },
  { time: dayjs().format('YYYY-MM-DD HH:mm:ss'), pH: 7 },
];

const RANGE_MIN = 0;
const RANGE_MAX = 14;
const THRESHOLD_MIN = 4.7;
const THRESHOLD_MAX = 7.3;

const StatBox10 = () => {
  const [data, setData] = useState(phData);

  return (
    <>
      <div className='StatBoxContainer4 relative rounded-lg pl-5'>
        <div className='dotsImageContainer'>
          <Image src={dots} width={20} height={20} alt='dots' />
        </div>
        <div className="chart-container" style={{ textAlign: 'center' }}>
          <h2 className="text-white font-bold text-center text-lg pt-3 pb-3">PH Sensor Data</h2>
          <LineChart
            width={370}
            height={240}
            data={data}
            margin={{ top:10, bottom: 37}}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" />
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#ffffff', fontSize: 8}} 
              tickFormatter={(tick) => dayjs(tick).format('HH:mm')} 
            />
            <YAxis 
              domain={[RANGE_MIN, RANGE_MAX]} 
              tick={{ fill: '#ffffff', fontSize: 8 }} 
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
                fontSize={7} 
              />
            </ReferenceLine>
            <ReferenceLine y={RANGE_MAX} stroke="#CE2D4F" strokeDasharray="3 3" strokeWidth={2}>
              <Label 
                value="Range Max" 
                position="left" 
                offset={22} 
                fill="#ffffff" 
                fontSize={7} 
              />
            </ReferenceLine>
            <ReferenceLine y={THRESHOLD_MIN} stroke="#04D5C7" strokeDasharray="3 3" strokeWidth={2}>
              <Label 
                value="Threshold Min" 
                position="left" 
                offset={16} 
                fill="#ffffff" 
                fontSize={8} 
              />
            </ReferenceLine>
            <ReferenceLine y={THRESHOLD_MAX} stroke="#04D5C7" strokeDasharray="3 3" strokeWidth={2}>
              <Label 
                value="Threshold Max" 
                position="left" 
                offset={15} 
                fill="#ffffff" 
                fontSize={8} 
              />
            </ReferenceLine>
          </LineChart>
        </div>
      </div>
    </>
  );
};

export default StatBox10;
