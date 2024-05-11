import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css'; 

const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then((m) => m.Polyline), { ssr: false });

const RouteMap = ({ route, correctRouteId, wrongRouteId, color }) => {
    const [Leaflet, setLeaflet] = useState(null);

    useEffect(() => {
        const importLeaflet = async () => {
            const L = await import('leaflet');
            setLeaflet(L);
        };

        if (typeof window !== 'undefined') {
            importLeaflet();
        }

        return () => {
            setLeaflet(null);
        };
    }, []);

    if (!Leaflet || !route) {
        return null;
    }

    const getMapCenter = (route) => {
        if (route.allPoints) {
            return [route.allPoints[0].latitude, route.allPoints[0].longitude];
        } else if (route.allTestPoints) {
            return [route.allTestPoints[0].latitude, route.allTestPoints[0].longitude];
        }
        return [0, 0];
    };

    const getRoutePositions = (route) => {
        if (route.allPoints) {
            return route.allPoints.map(point => [point.latitude, point.longitude]);
        } else if (route.allTestPoints) {
            return route.allTestPoints.map(point => [point.latitude, point.longitude]);
        }
        return [];
    };

    const getRouteColor = () => {
        if (color) {
            return color;
        } else if (route.routeId === correctRouteId) {
            return "limegreen"; 
        } else if (route.routeId === wrongRouteId) {
            return "red"; 
        }
        return "blue"; 
    };

    return (
        <div className='mx-3' style={{ height: '160px', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
            <MapContainer center={getMapCenter(route)} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polyline positions={getRoutePositions(route)} color={getRouteColor()} weight={4} />
            </MapContainer>
        </div>
    );
};

export default RouteMap;
