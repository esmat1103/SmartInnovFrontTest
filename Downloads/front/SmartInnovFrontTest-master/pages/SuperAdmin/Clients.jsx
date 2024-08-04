import { useEffect, useState } from 'react';
import LayoutSuperAdmin from '@components/SuperAdmin/layout';
import Table from "../../components/SuperAdmin/ClientContent/Table";
import { getTranslations } from '../../app/utils/getTranslations';

const Admins = ({ initialLanguage }) => {
    const [language, setLanguage] = useState(initialLanguage);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || initialLanguage;
        setLanguage(storedLanguage);
    }, [initialLanguage]);

    return (
        <LayoutSuperAdmin>
            <div className="mt-5 bg-w">
                <Table />
            </div>
        </LayoutSuperAdmin>
    );
};

export const getServerSideProps = async ({ locale }) => {
    const translations = await getTranslations(locale,['HeaderClientsTab','sidebar','logout']);
    return {
        props: {
            initialLanguage: locale,
            ...translations,
        },
    };
};

export default Admins;
