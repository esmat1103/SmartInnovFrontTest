import { useEffect, useState } from 'react';
import Layout from "../../components/Admin/layout";
import Table from "../../components/Admin/ClientContent/Table";
import { getTranslations } from '../../app/utils/getTranslations';

const Clients = ({ initialLanguage }) => {
    const [language, setLanguage] = useState(initialLanguage);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || initialLanguage;
        setLanguage(storedLanguage);
    }, [initialLanguage]);

    return (
        <Layout>
            <div className="mt-5 bg-w">
                <Table/>
            </div>
        </Layout>
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

export default Clients;
