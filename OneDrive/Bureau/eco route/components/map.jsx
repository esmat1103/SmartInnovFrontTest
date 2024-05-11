import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

const Map = ({ bins }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    import('leaflet').then(L => {
      if (mapRef.current !== null && mapInstance.current === null) {
        mapInstance.current = L.map(mapRef.current).setView([34, 9], 5);

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(mapInstance.current);
      }

      // Update markers when bins change
      if (mapInstance.current && bins) {
        // Define custom icon options
        const customIcon = L.icon({
          iconUrl: '/main_content/binmap.png',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          popupAnchor: [0, -10],
        });

        // Clear existing markers
        mapInstance.current.eachLayer(layer => {
          if (layer instanceof L.Marker) {
            mapInstance.current.removeLayer(layer);
          }
        });

        // Add markers for each bin location with custom icon
        bins.forEach(bin => {
          const { latitude, longitude } = bin.location;
          L.marker([latitude, longitude], { icon: customIcon }).addTo(mapInstance.current);
        });
      }
    });

    return () => {
      // Clean up map instance
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [bins]);

  return <div className='stats-box' ref={mapRef} style={{ height: '100%', width: '100%' }}></div>;
};

export default Map;
