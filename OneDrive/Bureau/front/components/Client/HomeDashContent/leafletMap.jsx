import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: '', 
  iconRetinaUrl: '',
  shadowUrl: ''
});

const createCustomIcon = (url) => {
  return L.icon({
    iconUrl: url,
    iconSize: [16, 16], 
    iconAnchor: [8, 16], 
    popupAnchor: [0, -24], 
  });
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
                {marker.popupContent}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
};

export default LeafletMap;
