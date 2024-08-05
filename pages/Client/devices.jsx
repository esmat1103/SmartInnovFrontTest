
import { useEffect, useState } from 'react';
import { getTranslations } from '../../app/utils/getTranslations';

import LayoutClient from "@components/Client/layout";
import TableBodyD from '@components/Admin/DevicesContent/TabBodyD';
import TableD from '@components/Client/DevicesContent/TableD';


const Devices = ({ initialLanguage }) => {
    const [language, setLanguage] = useState(initialLanguage);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || initialLanguage;
        setLanguage(storedLanguage);
    }, []);

    return (
        <>
            <LayoutClient>
                <div className="mt-5 bg-w">
                    <TableD/>
                </div>
            </LayoutClient>
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
