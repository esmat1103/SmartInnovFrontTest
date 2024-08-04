
import { getTranslations } from '../../app/utils/getTranslations';
import { useEffect, useState } from 'react';
import LayoutClient from "@components/Client/layout";
import TableS from '@components/Client/SensorsContent/TabS';



const Sensors = (initialLanguage) => {
    const [language, setLanguage] = useState(initialLanguage);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || initialLanguage;
        setLanguage(storedLanguage);
    }, []);

    return (
        <>
        <LayoutClient >
            <div className="mt-5 bg-w">
                 <TableS/>
            </div>
            
        </LayoutClient>       
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
export default Sensors;