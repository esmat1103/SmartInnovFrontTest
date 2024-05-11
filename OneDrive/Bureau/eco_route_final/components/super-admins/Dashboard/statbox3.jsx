import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { db } from '@/app/config/firebaseConfig.mjs'; 
import { getDocs, collection } from 'firebase/firestore';

const Stat2 = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchGovernoratesAndFillingLevels = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'bins'));
        const data = querySnapshot.docs.map(doc => ({
          governorate: doc.data().governorate,
          filling_level: doc.data().filling_level,
        }));

        const averages = [];
        data.forEach(item => {
          const govIndex = averages.findIndex(avg => avg.governorate === item.governorate);
          if (govIndex === -1) {
            averages.push({ governorate: item.governorate, total: item.filling_level, count: 1 });
          } else {
            averages[govIndex].total += item.filling_level;
            averages[govIndex].count++;
          }
        });

        averages.forEach(avg => {
          avg.average = avg.total / avg.count;
        });

        const labels = averages.map(avg => avg.governorate.replace('Governorate of ', ''));
        const values = averages.map(avg => avg.average);

        setChartData({
          labels: labels,
          values: values,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchGovernoratesAndFillingLevels();
  }, []);

  useEffect(() => {
    if (chartData) {
      const ctx = document.getElementById('fillLevelChart');
      if (!ctx) return;

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: 'Average Fill Level',
              data: chartData.values,
              borderColor: 'rgb(252,93,128)', // Line color
              borderWidth: 2,
              pointRadius: 3, // Point radius
              pointBackgroundColor: 'rgb(252,93,128)', // Point color
              pointBorderColor: 'rgb(252,93,128)', // Point border color
              fill: true,
              tension: 0.4,
              backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;

                if (!chartArea) {
                  return null;
                }

                const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(1, 'rgb(252,93,128)'); // Pink
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0)'); // White

                return gradient;
              },
            },
          ],
        },
        options: {
          scales: {
            y: {
              display: true,
              grid: {
                display: false,
              },
              ticks: {
                callback: function (value, index, values) {
                  return value.toFixed(2) + ' %'; // Format y-axis labels
                },
              },
            },

            x: {
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: (tooltipItem) => {
                  return tooltipItem[0].label.replace('Governorate of ', ''); // Update tooltip title
                },
              },
            },
            legend: {
              display: false,
            },
          },
          layout: {
            padding: {
              right: 10,
              left: 10,
              top: 10,
              bottom:5,
            },
          },
          elements: {
            line: {
              backgroundColor: 'rgba(255, 99, 132, 0.8)',
            },
          },
        },
      });

    }
  }, [chartData]);

  const [chartDataBins, setChartDataBins] = useState(null);

  useEffect(() => {
    const fetchBinsByGovernorate = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'bins'));
        const binsData = querySnapshot.docs.map(doc => doc.data().governorate);

        const binsCount = {};
        binsData.forEach(governorate => {
          if (governorate in binsCount) {
            binsCount[governorate]++;
          } else {
            binsCount[governorate] = 1;
          }
        });

        const labelsBins = Object.keys(binsCount);
        const valuesBins = Object.values(binsCount);

        setChartDataBins({
          labels: labelsBins,
          values: valuesBins,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchBinsByGovernorate();
  }, []);

  useEffect(() => {
    if (chartDataBins) {
      const ctx = document.getElementById('binsChart');
      if (!ctx) return;

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartDataBins.labels.map(label => label.replace('Governorate of ', '')),
          datasets: [
            {
              label: 'Number of Bins',
              data: chartDataBins.values,
              backgroundColor: 'teal',
              borderColor: 'teal',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: false,
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
          elements: {
            bar:{
              borderRadius:5,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
          layout: {
            padding: {
              right: 10,
              left: 10,
              top: 10,
              bottom:5,
            },
          },
        },
      });
    }
  }, [chartDataBins]);


  return (
    <div className='mx-3 mt-3'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-7 col-md-12 col-sm-12'>
            <div className='stats-box'>
              <p className='dark ml-3 pt-1 poppins fw600'> Average filling level per Governorate</p>
              <canvas id='fillLevelChart' width='400' height='85'></canvas>
            </div>
          </div>
          <div className='col-lg-5 col-md-12 col-sm-12'>
            <div className='stats-box'>
              <p className='dark ml-3 pt-1 poppins fw600'> Number of bins per Governorate</p>
              <canvas id='binsChart' width='400' height='120'></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stat2;
