import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix missing icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: '',
  iconRetinaUrl: '',
  shadowUrl: ''
});

// Function to create custom icon
const createCustomIcon = (url) => {
  return L.icon({
    iconUrl: url,
    iconSize: [16, 16], 
    iconAnchor: [8, 16], 
    popupAnchor: [0, -16], 
  });
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Maintenance':
      return '#9385F7';
    case 'In use':
      return '#04D5C7';
    case 'Suspended':
      return '#CE2D4F';
    default:
      return '#b0b0b0'; 
  }
};

const LeafletMap = ({ markers }) => {
  return (
    <>
      <style jsx global>{`
        .leaflet-layer,
        .leaflet-control-zoom-in,
        .leaflet-control-zoom-out,
        .leaflet-control-attribution {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }

        .leaflet-popup-content-wrapper,
        .leaflet-popup-tip {
          background-color: #24282F;
          border: none;
          color: #e0e0e0;
        }

        .custom-popup-content {
          font-size: 11px;
          color: #e0e0e0;
          background-color: #24282F;
          border-radius: 8px;
          width: 50px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .custom-popup-content strong {
          margin-bottom: 4px;
          font-weight: 700;
          color: #ffffff;
          cursor: pointer;
          text-decoration: underline;
        }

        .custom-popup-content strong:hover {
          color: #5D69F3;
        }

        .custom-popup-content span {
          display: block;
          margin-bottom: 2px;
        }
      `}</style>
      <div className='StatBoxContainer6 custom-map-container'>
        <MapContainer 
          center={[40.7128, -74.0060]} 
          zoom={2} 
          style={{ height: '100%', width: '100%' }} 
          attributionControl={false} 
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((marker, index) => (
            <Marker 
              key={index} 
              position={marker.position} 
              icon={createCustomIcon(marker.iconUrl)}
            >
              <Popup>
                <div className="custom-popup-content">
                  <strong onClick={() => window.location.href = `/SuperAdmin/Home/SensorsReadings?deviceId=${marker.popupContent.deviceId}`}>
                       {marker.popupContent.deviceName}         
                  </strong>
                  <span style={{ color: getStatusColor(marker.popupContent.status) }}>
                    {marker.popupContent.status}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
};

export default LeafletMap;
