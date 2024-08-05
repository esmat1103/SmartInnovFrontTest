import React, { useState, useEffect } from "react";
import LayoutH from '@components/SuperAdmin/layoutH';
import { getTranslations } from '@app/utils/getTranslations';
import { fetchDevices } from '@app/utils/apis/devices';
import { fetchSensors } from '@app/utils/apis/sensors';
import { getAllAdmins } from '@app/utils/apis/admins';
import { getAllEndUsers } from '@app/utils/apis/clients';
import HomeSA from '../../../components/SuperAdmin/HomeDashContent/Home';

const Home = (props) => {
    const [language, setLanguage] = useState(props.initialLanguage || 'en');
    const [admins, setAdmins] = useState([]);
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const fetchedAdmins = await getAllAdmins(token);
                setAdmins(fetchedAdmins);
                const fetchedClients = await getAllEndUsers(token);
                setClients(fetchedClients);
               
            } catch (error) {
                console.error('Error fetching ', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || language;
        setLanguage(storedLanguage);
    }, [language]);

    return (
        <>
            <LayoutH>
                <HomeSA
                    devices={props.devices}
                    sensors={props.sensors}
                    admins={admins} 
                    clients={clients}
                      />
            </LayoutH>   
        </>
    );
};

export const getServerSideProps = async ({ locale }) => {
    const translations = await getTranslations(locale, ['sidebar', 'logout']);
    const devices = await fetchDevices(); 
    const sensors = await fetchSensors();
   
    return {
        props: {
            ...translations,
            initialLanguage: locale,
            devices, sensors
        },
    };
};

export default Home;
