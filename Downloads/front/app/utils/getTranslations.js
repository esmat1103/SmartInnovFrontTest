import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getTranslations = async (locale, namespaces) => {
  return await serverSideTranslations(locale, namespaces);
};
