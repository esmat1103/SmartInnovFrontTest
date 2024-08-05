import LayoutH from '@components/Client/LayoutH';
import { getTranslations } from '@app/utils/getTranslations';
import React, { useState, useEffect } from 'react';
import HomeA from '@components/Admin/HomeDashContent/Home';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import HomeC from '@components/Client/HomeDashContent/Home';

const Home = ({ initialLanguage }) => {
    const [language, setLanguage] = useState(initialLanguage);
 


    return (
        <LayoutH>
            <div className="mt-3 bg-w">
                <HomeC
                   
                />
            </div>
        </LayoutH>
    );
};

export const getServerSideProps = async ({ locale }) => {
    const translations = await getTranslations(locale, ['sidebar', 'logout']);
    return {
        props: {
            initialLanguage: locale,
            ...translations,
        },
    };
};

export default Home;
