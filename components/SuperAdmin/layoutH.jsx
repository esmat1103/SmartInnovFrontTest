import React, { useEffect, useState } from 'react';
import SidebarSA from './sidebarSA';
import Content from '../content';
import Navbar from '@components/Commun/navbar';
import { useTranslation } from 'next-i18next';
import NavbarSA from './navbar';

const LayoutH= ({ children }) => {
    const { t } = useTranslation('common');
    const [language, setLanguage] = useState('en');

    const fetchLanguagePreference = () => {
        const preferredLanguage = localStorage.getItem('language') || 'en';
        setLanguage(preferredLanguage);
    };

    useEffect(() => {
        fetchLanguagePreference();
    }, []);

    const toggleLanguage = () => {
        const newLanguage = language === 'en' ? 'fr' : 'en';
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
    };

    return (
        <div className="flex">
            <NavbarSA toggleLanguage={toggleLanguage} />
            <SidebarSA />
            <div className="flex flex-col flex-grow">
                <div className="flex flex-grow ">
                    <Content language={language} getText={t}>
                        {children}
                    </Content>
                </div>
            </div>
        </div>
    );
};

export default LayoutH;