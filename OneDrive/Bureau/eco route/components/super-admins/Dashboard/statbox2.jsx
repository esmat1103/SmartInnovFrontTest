import React, { useState, useEffect, useRef } from 'react';
import { db } from '@/app/config/firebaseConfig.mjs';
import { collection, getDocs } from 'firebase/firestore';
import Chart from 'chart.js/auto';
import Table from './employeetab';

const Stat1 = () => {
  const [activeBinsCount, setActiveBinsCount] = useState(0);
  const [inactiveBinsCount, setInactiveBinsCount] = useState(0);
  const [stableBinsCount, setStableBinsCount] = useState(0);
  const [fallenBinsCount, setFallenBinsCount] = useState(0);
  const [totalBins, setTotalBins] = useState(0);
  const [activePercentage, setActivePercentage] = useState(0);
  const [stablePercentage, setStablePercentage] = useState(0);

  const activeChartContainerRef = useRef(null);
  const activeChartInstance = useRef(null);
  const stableChartContainerRef = useRef(null);
  const stableChartInstance = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'bins'));
        let activeCount = 0;
        let inactiveCount = 0;
        let stableCount = 0;
        let fallenCount = 0;
        querySnapshot.forEach((doc) => {
          const binData = doc.data();
          if (binData.status === 'Active') {
            activeCount++;
          } else if (binData.status === 'Inactive') {
            inactiveCount++;
          }
          if (binData.tilt_status === 'Stable') {
            stableCount++;
          } else if (binData.tilt_status === 'Fallen') {
            fallenCount++;
          }
        });
        setActiveBinsCount(activeCount);
        setInactiveBinsCount(inactiveCount);
        setStableBinsCount(stableCount);
        setFallenBinsCount(fallenCount);
        setTotalBins(activeCount + inactiveCount);
      } catch (error) {
        console.error('Error fetching bins:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setActivePercentage(Math.round((activeBinsCount / totalBins) * 100));
    setStablePercentage(Math.round((stableBinsCount / totalBins) * 100));
  }, [activeBinsCount, stableBinsCount, totalBins]);

  useEffect(() => {
    if (activeChartInstance.current) {
      activeChartInstance.current.destroy(); // Destroy previous chart instance
    }

    const ctx = activeChartContainerRef.current.getContext('2d');
    activeChartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Active Bins', 'Inactive Bins'],
        datasets: [
          {
            label: 'Bins',
            data: [activeBinsCount, inactiveBinsCount],
            backgroundColor:  ['#B75DD9', '#FFCF00'],
            borderWidth: 10,
          },
        ],
      },
      options: {
        cutout: '60%', // Adjust cutout percentage to make space for center text
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            align: 'center', 
            labels: {
              boxWidth: 5, 
              usePointStyle: true, 
            },
          },
        },
        elements: {
          arc: {
            borderRadius: 10,
          },
        },
      },
    });

    return () => {
      if (activeChartInstance.current) {
        activeChartInstance.current.destroy();
      }
    };
  }, [activeBinsCount, inactiveBinsCount]);

  useEffect(() => {
    if (stableChartInstance.current) {
      stableChartInstance.current.destroy(); // Destroy previous chart instance
    }

    const ctx = stableChartContainerRef.current.getContext('2d');
    stableChartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Stable Bins', 'Fallen Bins'],
        datasets: [
          {
            label: 'Bins',
            data: [stableBinsCount, fallenBinsCount],
            backgroundColor: ['#3ed95a', '#FF6E1D'],
            borderWidth: 10,
          },
        ],
      },
      options: {
        cutout: '60%', // Adjust cutout percentage to make space for center text
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            align: 'center', 
            labels: {
              boxWidth: 5, 
              usePointStyle: true,
            },
          },
        },
        elements: {
          arc: {
            borderRadius: 10,
          },
        },
      },
    });

    return () => {
      if (stableChartInstance.current) {
        stableChartInstance.current.destroy();
      }
    };
  }, [stableBinsCount, fallenBinsCount]);

  return (
    <div className='mx-3 mt-3'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-2 col-md-12 col-sm-12'>
            <div className='stats-box' style={{ height: '230px'}}>
                <p className='dark ml-3 pt-1 poppins fw600'> Active Inactive Bins</p>
                <canvas ref={activeChartContainerRef}></canvas>
                <div className="center-text" style={{ height: '40%' }}>
                  <span className='dark ml-3 pt-1 poppins fw600'>{`${activePercentage}% active`}</span>
              </div>
            </div>
          </div>
          <div className='col-lg-2 col-md-12 col-sm-12'>
            <div className='stats-box' style={{ height: '230px'}}>
              
                <p className='dark ml-3 pt-1 poppins fw600'> Tilt mouvement </p>
                <canvas ref={stableChartContainerRef}></canvas>
                <div className="center-text " style={{ height: '40%' }}>
                  <span className='dark ml-3 pt-1 poppins fw600'>{`${stablePercentage}% stable`}</span>
               
              </div>
            </div>
          </div>
          <div className='col-lg-8 col-md-12 col-sm-12'>
            <div className='stats-box ' style={{ height: '230px' }}>
              <p className='dark ml-3 pt-1 poppins fw600'> TOP 3 employees of the day</p>
            <Table/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stat1;
