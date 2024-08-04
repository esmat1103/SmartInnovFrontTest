import LayoutH from "@components/SuperAdmin/layoutH";
import ComplaintPage from "@components/Admin/ComplaintContent/complaint";
import { getTranslations } from '../../app/utils/getTranslations';
import React,{useEffect,useState} from "react";

const Complaints = (initialLanguage) => {
    const [language, setLanguage] = useState(initialLanguage);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || initialLanguage;
        setLanguage(storedLanguage);
    }, [initialLanguage]);
    return (
        <>
        <LayoutH >
            
            <ComplaintPage />
            
        </LayoutH>    
        </>
    );

}
export const getServerSideProps = async ({ locale }) => {
    const translations = await getTranslations(locale,['HeaderComplaintsTab','ComplaintsFilter','sidebar','logout'])
    return {
        props: {
          ...translations,
        },
      };
    }
export default Complaints;