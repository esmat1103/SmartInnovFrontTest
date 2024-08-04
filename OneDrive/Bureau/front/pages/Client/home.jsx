import React from 'react';
import LayoutH from '@components/Client/layoutH';
import { getTranslations } from '../../app/utils/getTranslations';

const Home = () => {

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
