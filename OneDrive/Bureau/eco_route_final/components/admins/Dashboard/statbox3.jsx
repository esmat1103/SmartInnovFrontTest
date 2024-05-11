import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { db, auth } from '@/app/config/firebaseConfig.mjs'; // Assuming Firebase config import
import { collection, query, where, getDoc, getDocs, doc, onSnapshot } from 'firebase/firestore';

const getDocumentIdByUid = async (collectionName, uid) => {
  const collectionRef = collection(db, collectionName);
  const querySnapshot = await getDocs(query(collectionRef, where('uid', '==', uid)));

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].id;
  } else {
    return null;
  }
};

const Stat2 = () => {
  const [routeChartData, setRouteChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error('No user logged in');
          return;
        }

        const uid = user.uid;
        const documentId = await getDocumentIdByUid('admins', uid);

        if (!documentId) {
          console.error('Document does not exist for user:', uid);
          return;
        }

        const adminRef = doc(db, 'admins', documentId);
        const adminSnapshot = await getDoc(adminRef);
        console.log('Admin data:', adminSnapshot.data());

        const municipality = adminSnapshot.data().municipality;

        // Fetch route data from the Firestore collection 'routes'
        const routesQuery = query(collection(db, 'routes'), where('municipality', '==', municipality));
        const unsubscribeRoutes = onSnapshot(routesQuery, (querySnapshot) => {
          const updatedRoutesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            date: doc.data().date,
            distance: doc.data().distance,
            duration: doc.data().duration,
            fuelConsumption: doc.data().fuelConsumption, 
          }));
          setRouteChartData(updatedRoutesData);
          console.log('data', updatedRoutesData);
        });

        // Clean up snapshot listener when component unmounts
        return () => {
          unsubscribeRoutes();
        };
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (routeChartData.length > 0) {
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      // Prepare data for distance chart
      const distanceData = daysOfWeek.map(day => ({
        day,
        distances: routeChartData.filter(route => new Date(route.date.toDate()).getDay() === daysOfWeek.indexOf(day)).map(route => route.distance)
      }));

      // Prepare data for duration chart
      const durationData = daysOfWeek.map(day => ({
        day,
        durations: routeChartData.filter(route => new Date(route.date.toDate()).getDay() === daysOfWeek.indexOf(day)).map(route => route.duration)
      }));

      // Prepare data for fuel consumption chart
      const fuelConsumptionData = daysOfWeek.map(day => ({
        day,
        fuelConsumption: routeChartData.filter(route => new Date(route.date.toDate()).getDay() === daysOfWeek.indexOf(day)).map(route => route.fuelConsumption)
      }));

      const ctxDistance = document.getElementById('routeChartDistance').getContext('2d');
      new Chart(ctxDistance, {
        type: 'bar',
        data: {
          labels: daysOfWeek,
          datasets: [{
            label: 'Distance',
            data: distanceData.map(day => day.distances.reduce((acc, curr) => acc + curr, 0)),
            backgroundColor: '#87CDFE',
            borderColor: '#87CDFE', // Change color for current day
            borderWidth: 0,
          }],
        },
        options: {
          plugins: {
            datalabels: {
              display: true,
              color: 'black',
              font: {
                weight: 'bold'
              },
              formatter: (value) => `${value} km`
            }
          },
          layout: {
            padding: {
              right: 10,
              left: 10,
              top: 20,
              bottom: 25,
            },
          },
          elements: {
            bar: {
              borderRadius: 5,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              stacked: false,
            },
            y: {
              grid: {
                display: false,
              },
              stacked: false,
              title: {
                display: true,
                text: 'Total Distance (km)'
              }
            },
          }
        }
      });

      const ctxDuration = document.getElementById('routeChartDuration').getContext('2d');
      new Chart(ctxDuration, {
        type: 'bar',
        data: {
          labels: daysOfWeek,
          datasets: [{
            label: 'Duration',
            data: durationData.map(day => day.durations.reduce((acc, curr) => acc + curr, 0)),
            backgroundColor: '#FFCF00',
            borderColor: '#FFCF00',
            borderWidth: 1,
          }],
        },
        options: {
          plugins: {
            datalabels: {
              display: true,
              color: 'black',
              font: {
                weight: 'bold'
              },
              formatter: (value) => `${value} min`
            }
          },
          elements: {
            bar: {
              borderRadius: 5,
            },
          },
          layout: {
            padding: {
              right: 10,
              left: 10,
              top: 20,
              bottom: 25,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              stacked: false,
            },
            y: {
              grid: {
                display: false,
              },
              stacked: false,
              title: {
                display: true,
                text: 'Total Duration (min)'
              }
            },
          }
        }
      });

      const ctxFuelConsumption = document.getElementById('routeChartFuelConsumption').getContext('2d');
      new Chart(ctxFuelConsumption, {
        type: 'bar',
        data: {
          labels: daysOfWeek,
          datasets: [{
            label: 'Fuel Consumption',
            data: fuelConsumptionData.map(day => day.fuelConsumption.reduce((acc, curr) => acc + curr, 0)),
            backgroundColor: '#FE6470',
            borderColor: '#FE6470',
            borderWidth: 1,
          }],
        },
        options: {
          plugins: {
            datalabels: {
              display: true,
              color: 'black',
              font: {
                weight: 'bold'
              },
              formatter: (value) => `${value} litres`
            }
          },
          elements: {
            bar: {
              borderRadius: 5,
            },
          },
          layout: {
            padding: {
              right: 10,
              left: 10,
              top: 20,
              bottom: 25,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              stacked: false,
            },
            y: {
              grid: {
                display: false,
              },
              stacked: false,
              title: {
                display: true,
                text: 'Fuel Consumption'
              }
            },
          }
        }
      });
    }
  }, [routeChartData]);

  return (
    <div className={`mx-3 mt-2`}>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-4 col-md-12 col-sm-12'>
            <div className='stats-box'>
              <p className='dark ml-3 pt-1 poppins fw600'> Total routes distance (km) </p>
              <canvas id="routeChartDistance" />
            </div>
          </div>
          <div className='col-lg-4 col-md-12 col-sm-12'>
            <div className='stats-box'>
              <p className='dark ml-3 pt-1 poppins fw600'> Total routes duration (min)</p>
              <canvas id="routeChartDuration" />
            </div>
          </div>
          <div className='col-lg-4 col-md-12 col-sm-12'>
            <div className='stats-box'>
              <p className='dark ml-3 pt-1 poppins fw600'> Total fuel consumption (litres)</p>
              <canvas id="routeChartFuelConsumption" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stat2;
