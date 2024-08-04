import LayoutH from '@components/Admin/LayoutH';
import { getTranslations } from '@app/utils/getTranslations';
import React, { useState, useEffect } from 'react';
import HomeA from '@components/Admin/HomeDashContent/Home';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { getDevicesByAdminId } from '@app/utils/apis/devices';
import { fetchSensorsByDevice } from '@app/utils/apis/sensors';

const Home = ({ initialLanguage }) => {
    const [language, setLanguage] = useState(initialLanguage);
    const [endusers, setEndusers] = useState([]);
    const [devices, setDevices] = useState([]);
    const [sensors, setSensors] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || initialLanguage;
        setLanguage(storedLanguage);

        const fetchEndusers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found.');
                    return;
                }

                const decodedToken = jwt.decode(token);

                if (!decodedToken || !decodedToken.userId) {
                    console.error('Invalid token or unable to extract userId.');
                    return;
                }

                const loggedInAdminId = decodedToken.userId;

                // Fetch endusers
                const endusersResponse = await axios.get('http://localhost:3008/users/role/enduser', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const filteredEndusers = endusersResponse.data.filter(enduser => enduser.createdByAdmin === loggedInAdminId);
                setEndusers(filteredEndusers);

                // Fetch devices
                const devicesResponse = await getDevicesByAdminId(loggedInAdminId);
                setDevices(devicesResponse);

                // Fetch sensors for each device
                const sensorsMap = {};
                for (const device of devicesResponse) {
                    const sensorsResponse = await fetchSensorsByDevice(device.id);
                    sensorsMap[device.id] = sensorsResponse;
                }
                setSensors(sensorsMap);

            } catch (error) {
                setError('Error fetching clients or devices');
                console.error('Error fetching clients or devices', error);
            }
        };

        fetchEndusers();
    }, [initialLanguage]);

    return (
        <LayoutH>
            <div className="mt-3 bg-w">
                <HomeA 
                    endusers={endusers} 
                    devices={devices} 
                    sensors={sensors} 
                />
            </div>
        </LayoutH>
    );
};

export const getServerSideProps = async ({ locale }) => {
    const translations = await getTranslations(locale, ['sidebar', 'logout']);
    return {
        props: {
            initialLanguage: locale,
            ...translations,
        },
    };
};

export default Home;
