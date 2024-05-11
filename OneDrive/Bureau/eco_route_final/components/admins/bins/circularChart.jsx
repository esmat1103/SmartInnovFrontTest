import React from 'react';

const CircularChart = ({ percentage }) => {
  const getColorClass = () => {
    if (percentage < 30) {
      return 'green';
    } else if (percentage < 70) {
      return 'orange';
    } else if (percentage > 80 || percentage < 100){
      return 'red'; 
    } else if (percentage = 100){
      return 'purple';
    }
  };

 const calculateDashArray = () => {
    const circumference = 2 * Math.PI * 15; // Circumference of a circle with radius 15
    const fillLength = (percentage / 100) * circumference;
    const emptyLength = circumference - fillLength;
    return `${fillLength} ${emptyLength}`;
  };

  return (
    <svg viewBox="0 0 36 36" className={`circular-chart ${getColorClass()}`}>
      <path
        className="circle-bg"
        d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <path
        className="circle"
        strokeDasharray={calculateDashArray()}
        d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <text x="18" y="20.35" className="percentage">{percentage}%</text>
    </svg>
  );
};

export default CircularChart;

