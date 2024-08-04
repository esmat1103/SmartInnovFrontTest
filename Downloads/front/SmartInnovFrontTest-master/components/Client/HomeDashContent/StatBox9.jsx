import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getDevicesByClientId } from '@app/utils/apis/devices';
import jwt from 'jsonwebtoken';

const LeafletMap = dynamic(() => import('./leafletMap'), {
  ssr: false
});

const StatBox9 = () => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const decodedToken = jwt.decode(token);
        if (!decodedToken || !decodedToken.userId) {
          throw new Error('Invalid token');
        }

        const loggedInClient = decodedToken.userId;

        const devices = await getDevicesByClientId(loggedInClient);

        const markersData = devices.map(device => {
          const coordinates = device.location?.coordinates || [0, 0];
          const status = device.status || 'Unknown';

          let iconUrl;
          if (status === 'In use') {
            iconUrl = '/assets/MainDash/locationGreen.svg';
          } else if (status === 'Maintenance') {
            iconUrl = '/assets/MainDash/locationPurple.svg';
          } else if (status === 'Suspended') {
            iconUrl = '/assets/MainDash/locationRed.svg';
          }

      

          return {
            position: coordinates,
            popupContent: `Device ${device.deviceName}`,
            iconUrl: iconUrl
          };
        });


        setMarkers(markersData);
      } catch (error) {
        console.error('Error loading devices:', error);
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
