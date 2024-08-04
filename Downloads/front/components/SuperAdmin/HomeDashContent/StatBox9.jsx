import React, { useState, useEffect } from 'react';
import { fetchDevices } from '../../../app/utils/apis/devices'; 
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./leafletMap'), {
  ssr: false
});

const StatBox9 = () => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const devices = await fetchDevices();
        
        const markersData = devices.map(device => {
          const coordinates = device.location?.coordinates || [0, 0];
          const status = device.status || 'Unknown'; 

          let iconUrl;
          if (status === 'Maintenance') {
            iconUrl = '/assets/MainDash/locationPurple.svg';
          } else if (status === 'Suspended') {
            iconUrl = '/assets/MainDash/locationRed.svg';
          } else if (status === 'In use') {
            iconUrl = '/assets/MainDash/locationGreen.svg';
          }

          return {
            position: coordinates,
            popupContent: {
              ref: device.ref,
              deviceName: device.deviceName,
              status: device.status,
              deviceId: device._id 
            },
            iconUrl: iconUrl
          };
        });

        setMarkers(markersData);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    loadDevices();
  }, []);

  return (
    <>
      <LeafletMap markers={markers} />
    </>
  );
};

export default StatBox9;
