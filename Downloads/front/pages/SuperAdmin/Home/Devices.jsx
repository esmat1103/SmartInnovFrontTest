import { useEffect, useState } from 'react';
import LayoutH from '@components/SuperAdmin/layoutH';
import Device from '@components/SuperAdmin/HomeDashContent/DeviceZoom';
import { fetchSensors } from '@app/utils/apis/sensors';
import { getAllAdmins } from '@app/utils/apis/admins';
import { getAllEndUsers } from '@app/utils/apis/clients';
import { fetchDevices } from '@app/utils/apis/devices';
import { getTranslations } from '@app/utils/getTranslations';

const DeviceZ = (props) => {
    const { initialLanguage, devices, sensors } = props;
    const [language, setLanguage] = useState(initialLanguage || 'en');
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
        const storedLanguage = localStorage.getItem('language') || initialLanguage;
        setLanguage(storedLanguage);
    }, [initialLanguage]);

    return (
        <LayoutH>
            <div className="mt-5 bg-w">
                <Device
                    admins={admins}
                    clients={clients}
                />
            </div>
        </LayoutH>
    );
}

export const getServerSideProps = async ({ locale }) => {
    const translations = await getTranslations(locale, ['HeaderSensorsTab', 'sidebar', 'logout']);
    const devices = await fetchDevices();
    const sensors = await fetchSensors();
    return {
        props: {
            ...translations,
            initialLanguage: locale,
            devices,
            sensors
        },
    };
}

export default DeviceZ;
