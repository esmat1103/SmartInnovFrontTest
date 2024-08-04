import LayoutH from '@components/SuperAdmin/layoutH';
import { getTranslations } from '../../app/utils/getTranslations';
import React, {useState,useEffect} from "react";

const Home = (initialLanguage) => {
    const [language, setLanguage] = useState(initialLanguage);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || initialLanguage;
        setLanguage(storedLanguage);
    }, []);

    return (
        <>
            <LayoutH />    
        </>

    );

}
export const getServerSideProps = async ({ locale }) => {
    const translations = await getTranslations(locale,['sidebar','logout'])
    return {
        props: {
          ...translations,
        },
      };
    }
export default Home;

