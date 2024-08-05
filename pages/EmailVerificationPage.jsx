import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import emailIcon from '../public/assets/iconsLogin/mail.svg';
import SubmitButton from '../components/Commun/Buttons/SubmitButton';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ErrorAlert from '@components/Commun/Alerts/error-alert';
import SuccessAlert from '@components/Commun/Alerts/success-alert';

const EmailVerificationPage = () => {
  const { t } = useTranslation('EmailVerif');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState(''); 
  const [language, setLanguage] = useState('en');
  const router = useRouter();

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  const handleSendVerificationEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3389/auth/sendVerificationEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setAlertType('success');
        setMessage(t('verificationSuccess')); 
        setTimeout(() => {
          setAlertType('');
          setMessage('');
        }, 3000); //
      } else {
        const errorData = await response.json();
        setAlertType('error');
        setMessage(`${t('verificationError')}: ${errorData.message}`); 
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setAlertType('error');
      setMessage(t('verificationError')); 
    }
  };

  return (
    <div className="container flex justify-center items-center min-h-screen">
      <div className="content-container bg-white p-8 shadow-md max-w-md">
        <h1 className="text-2xl sidebargrey font-bold mb-4">{t('title')}</h1>
        <p className="sidebargrey mb-6">{t('description')}</p>
        <form className='mb-5' onSubmit={handleSendVerificationEmail}>
          <div className="input-group">
            <div className="input-with-icon">
              <Image src={emailIcon} width={20} height={20} alt="email icon" className="icon" />
              <input
                type="email"
                id="email"
                placeholder={t('placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email"
                className="black nunito"
              />
            </div>
          </div>
          <SubmitButton>{t('submitButton')}</SubmitButton>
        </form>
        {alertType === 'success' && <SuccessAlert message={message} />}
        {alertType === 'error' && <ErrorAlert message={message} />}
      </div>
    </div>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['EmailVerif'])),
    },
  };
}

export default EmailVerificationPage;