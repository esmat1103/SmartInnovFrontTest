import { useState, useEffect } from 'react';
import { fetchDevices } from '../../../app/utils/apis/devices'; 

const useFetchCoordinates = () => {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const devices = await fetchDevices();
        const fetchedMarkers = devices.map(device => ({
          position: device.location.coordinates,
          popupContent: `Device: ${device.deviceName}`,
          iconUrl: '/assets/MainDash/locationGreen.svg' 
        }));

        setMarkers(fetchedMarkers);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, []);

  return { markers, loading, error };
};

export default useFetchCoordinates;
