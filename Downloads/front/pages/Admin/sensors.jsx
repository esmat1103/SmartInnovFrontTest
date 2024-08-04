import Layout from "../../components/Admin/layout";
import TableS from "@components/Admin/SensorsContent/TabS";
import { getTranslations } from '../../app/utils/getTranslations';
import { useEffect, useState } from 'react';



const Sensors = (initialLanguage) => {
    const [language, setLanguage] = useState(initialLanguage);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || initialLanguage;
        setLanguage(storedLanguage);
    }, []);

    return (
        <>
        <Layout >
            <div className="mt-5 bg-w">
                 <TableS />
            </div>
            
        </Layout>       
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