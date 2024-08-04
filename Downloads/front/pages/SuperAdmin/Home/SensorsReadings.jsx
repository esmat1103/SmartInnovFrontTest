
//pages/SuperAdmin/SensorsReadings.jsx
import { getTranslations } from '@app/utils/getTranslations';
import { useEffect, useState } from 'react';
import LayoutH from '@components/SuperAdmin/layoutH';
import Sensor from '@components/SuperAdmin/HomeDashContent/SensorReadings';


const SensorsReadings = (initialLanguage) => {
    const [language, setLanguage] = useState(initialLanguage);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || initialLanguage;
        setLanguage(storedLanguage);
    }, []);

    return (
        <>
        <LayoutH >
            <div className="mt-5 bg-w">
                 <Sensor />
            </div>
            
        </LayoutH>       
        </>

    );

}
export const getServerSideProps = async ({ locale }) => {
    const translations = await getTranslations(locale,['HeaderSensorsTab','sidebar','logout'])
    return {
        props: {
          ...translations,
        },
      };
    }
export default SensorsReadings;