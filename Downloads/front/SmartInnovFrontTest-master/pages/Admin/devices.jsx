import Layout from "../../components/Admin/layout";
import { useEffect, useState } from 'react';
import TableD from "@components/Admin/DevicesContent/TableD";
import { getTranslations } from '../../app/utils/getTranslations';


const Devices = ({ initialLanguage }) => {
    const [language, setLanguage] = useState(initialLanguage);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || initialLanguage;
        setLanguage(storedLanguage);
    }, []);

    return (
        <>
            <Layout>
                <div className="mt-5 bg-w">
                    <TableD  />
                </div>
            </Layout>
        </>
    );
}

   
  export const getServerSideProps = async ({ locale }) => {
    const translations = await getTranslations(locale,['HeaderDevicesTab','sidebar','logout'])
    return {
        props: {
          ...translations,
        },
      };
    }

export default Devices;
