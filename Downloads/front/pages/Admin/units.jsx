import TableU from '@components/SuperAdmin/UnitsContent/TabU'; 
import { useEffect, useState } from 'react';
import { getTranslations } from '../../app/utils/getTranslations';
import LayoutAdmin from "@components/Admin/layout";

const Units =  ({ initialLanguage }) => {
    const [language, setLanguage] = useState(initialLanguage);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || initialLanguage;
        setLanguage(storedLanguage);
    }, []);
    return (
        <>
        <LayoutAdmin>  
        <div className="mt-5 bg-w">
            <TableU language={language} />
        </div>
        </LayoutAdmin >         
        </>
    );

}

export const getServerSideProps = async ({ locale }) => {
    const translations = await getTranslations(locale,['HeaderUnitsTab','sidebar'])
    return {
        props: {
          ...translations,
        },
      };
    }


export default Units;