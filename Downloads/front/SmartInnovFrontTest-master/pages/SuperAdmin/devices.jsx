import LayoutSuperAdmin from "@components/SuperAdmin/layout";
import { getTranslations } from '../../app/utils/getTranslations';
import TableD from "@components/SuperAdmin/DevicesContent/TableD"; 
import React, {useState, useEffect} from "react";

const Devices = (initialLanguage) => {
    const [language, setLanguage] = useState(initialLanguage);
    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || initialLanguage;
        setLanguage(storedLanguage);
    }, [initialLanguage]);

    return (
        <>
        <LayoutSuperAdmin> 
               <div className="mt-5 bg-w">
                    <TableD  />
                </div>
         </LayoutSuperAdmin>    
        </>
    );

}
export const getServerSideProps = async ({ locale }) => {
    const translations = await getTranslations(locale,['HeaderDevicesTab','sidebar','logout']);
    return {
        props: {
            initialLanguage: locale,
            ...translations,
        },
    };
};

export default Devices;