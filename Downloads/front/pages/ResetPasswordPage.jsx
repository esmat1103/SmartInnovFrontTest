import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import SubmitButton from '../components/Commun/Buttons/SubmitButton';
import passwordIcon from '../public/assets/iconsLogin/pass.svg';
import eyeC from '../public/assets/iconsLogin/eyeC.svg';
import eyeO from '../public/assets/iconsLogin/eyeO.svg';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ErrorAlert from '@components/Commun/Alerts/error-alert';
import SuccessAlert from '@components/Commun/Alerts/success-alert';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const router = useRouter();
  const { token } = router.query;
  const { t } = useTranslation('ResetPass');

 
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    console.log('Submitting password reset');
  
    if (password !== confirmPassword) {
      console.log('Password and confirm password do not match');
      setMessage('Passwords do not match.');
      setAlertType('error');
      return;
    }
  
    console.log('Password to be reset:', password);
  
    const apiUrl = `http://localhost:3389/auth/resetPassword?token=${token}`;
    console.log('Reset Password API URL:', apiUrl);
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword: password }),
      });
  
      console.log('Response Status:', response.status);
      
      if (response.ok) {
        console.log('Password reset successful');
        setMessage('Password reset successful!');
        setAlertType('success');
        
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        const errorData = await response.json();
        console.log('Error Response:', errorData);
        setMessage(errorData.message || 'Failed to reset password.');
        setAlertType('error');
      }
    } catch (error) {
      console.log('Network Error:', error);
      setMessage('Network error occurred.');
      setAlertType('error');
    }
  };
  
  return (
    <div className="container flex justify-center items-center min-h-screen">
    <div className="content-container bg-white p-8 shadow-md max-w-md">
      <h1 className="text-2xl sidebargrey font-bold mb-4">{t('title')}</h1>
      <p className="sidebargrey mb-6">{t('instructions')}</p>
      <form className="mb-5" onSubmit={handleFormSubmit}>
        <div className="input-group">
          <div className="input-with-icon">
            <Image src={passwordIcon} width={20} height={20} alt="password icon" className="icon" />
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              placeholder={t('passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
            />
            <Image
              src={passwordVisible ? eyeO : eyeC}
              width={20}
              height={20}
              alt={passwordVisible ? "visibility icon open" : "visibility icon closed"}
              className={`visibility-icon ${!passwordVisible ? 'visible' : ''}`}
              onClick={togglePasswordVisibility}
            />
          </div>
        </div>
        <div className="input-group">
          <div className="input-with-icon">
            <Image src={passwordIcon} width={20} height={20} alt="password icon" className="icon" />
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              id="confirmPassword"
              placeholder={t('confirmPasswordPlaceholder')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-label="Confirm Password"
            />
            <Image
              src={confirmPasswordVisible ? eyeO : eyeC}
              width={20}
              height={20}
              alt={confirmPasswordVisible ? "visibility icon open" : "visibility icon closed"}
              className={`visibility-icon ${!confirmPasswordVisible ? 'visible' : ''}`}
              onClick={toggleConfirmPasswordVisibility}
            />
          </div>
        </div>
        <SubmitButton>{t('submitButton')}</SubmitButton>
      </form>
      {alertType === 'error' && <ErrorAlert message={message} />}
      {alertType === 'success' && <SuccessAlert message={message} />}
    </div>
  </div>
);
};


export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['ResetPass'])),
    },
  };
}

export default ResetPasswordPage;