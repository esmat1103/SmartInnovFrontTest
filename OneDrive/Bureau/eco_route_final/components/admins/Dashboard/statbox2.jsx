import React, { useState, useEffect, useRef } from 'react';
import { db,auth } from '@/app/config/firebaseConfig.mjs';
import { collection, getDocs,query,where,doc,getDoc } from 'firebase/firestore';
import Chart from 'chart.js/auto';
import Table from './employeetab';

const getDocumentIdByUid = async (collectionName, uid) => {
  const collectionRef = collection(db, collectionName);
  const querySnapshot = await getDocs(query(collectionRef, where('uid', '==', uid)));
  
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].id;
  } else {
    return null; 
  }
};

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
        const user = auth.currentUser;
        if (!user) {
          console.error('No user logged in');
          return;
        }
        const uid = user.uid;
        console.log('UID:', uid);
        const documentId = await getDocumentIdByUid('admins', uid);
        console.log('Document ID:', documentId);
    
        if (!documentId) {
          console.error('Document does not exist for user:', uid);
          return;
        }
    
        const adminRef = doc(db, 'admins', documentId);
        const adminSnapshot = await getDoc(adminRef);
        console.log('Admin data:', adminSnapshot.data());
    
        const municipality = adminSnapshot.data().municipality;
    
        // Fetch workers count
        const workersQuery = query(collection(db, 'employees'), where('municipality', '==', municipality));
        const workersSnapshot = await getDocs(workersQuery);
        const workersCount = workersSnapshot.size;
    
        // Fetch bins count
        const binsQuery = query(collection(db, 'bins'), where('municipality', '==', municipality));
        const binsSnapshot = await getDocs(binsQuery);
        const binsData = binsSnapshot.docs.map(doc => doc.data());
        const activeBinsCount = binsData.filter(bin => bin.status === 'Active').length;
        const inactiveBinsCount = binsData.filter(bin => bin.status === 'Inactive').length;
        const stableBinsCount = binsData.filter(bin => bin.tilt_status === 'Stable').length;
        const fallenBinsCount = binsData.filter(bin => bin.tilt_status === 'Fallen').length;
        const totalBins = activeBinsCount + inactiveBinsCount;
    
        setActiveBinsCount(activeBinsCount);
        setInactiveBinsCount(inactiveBinsCount);
        setStableBinsCount(stableBinsCount);
        setFallenBinsCount(fallenBinsCount);
        setTotalBins(totalBins);
      } catch (error) {
        console.error('Error fetching data:', error);
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
            backgroundColor: ['#B75DD9', '#FFCF00'],
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
            align: 'center', // Horizontally aligns the legend items
            labels: {
              boxWidth: 5, // Adjust the width of the legend color boxes
              usePointStyle: true, // Use circle as the legend color indicator
            },
          },
        },
        elements: {
          arc: {
            // Change the border radius here
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
            backgroundColor: ['#40D95B', '#FF6E1D'],
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
            align: 'center', // Horizontally aligns the legend items
            labels: {
              boxWidth: 5, // Adjust the width of the legend color boxes
              usePointStyle: true, // Use circle as the legend color indicator
            },
          },
        },
        elements: {
          arc: {
            // Change the border radius here
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
    <div className='mx-3 mt-2'>
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
                <div className="center-text" style={{ height: '40%' }}>
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
