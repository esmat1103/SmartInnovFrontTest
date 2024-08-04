import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import emailIcon from '../public/assets/iconsLogin/mail.svg';
import passwordIcon from '../public/assets/iconsLogin/pass.svg';
import eyeC from '../public/assets/iconsLogin/eyeC.svg';
import eyeO from '../public/assets/iconsLogin/eyeO.svg';
import SubmitButton from '../components/Commun/Buttons/SubmitButton';
import axiosInstance from 'utils/axiosConfigAuthSrv';
import jwt from 'jsonwebtoken';
import ErrorAlert from '../components/Commun/Alerts/error-alert';
import SuccessAlert from '../components/Commun/Alerts/success-alert';

const HomePage = () => {
  const { t } = useTranslation('home');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [language, setLanguage] = useState('en');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isRememberMeChecked, setIsRememberMeChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const validate = () => {
    let errors = {};
    if (!inputEmail) {
      errors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(inputEmail)) {
      errors.email = t('emailInvalid');
    }
    if (!inputPassword) {
      errors.password = t('passwordRequired');
    }
    if (!isTermsChecked) {
      errors.terms = t('termsRequired');
    }
    return errors;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      const response = await axiosInstance.post('http://localhost:3389/auth/login', {
        email: inputEmail,
        password: inputPassword,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
    
      const decodedToken = jwt.decode(token);
      const userRole = decodedToken.role;
      const userId = decodedToken.userId; 
      const userName = decodedToken.userName; 
    
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', userName);
    
      setSuccess(t('loginSuccess'));
      setErrors({});
      setTimeout(() => {
        if (userRole === 'superadmin') {
          router.push('/SuperAdmin/Home/home');
        } else if (userRole === 'admin') {
          router.push('/Admin/Home/home');
        } else if (userRole === 'enduser') {
          router.push('/Client/Home/home');
        }
      }, 1000);
    } catch (error) {
      console.error('Error signing in:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        setErrors({ auth: t('invalidCredentials') });
      } else if (error.request) {
        console.error('No response received:', error.request);
        setErrors({ auth: t('networkError') });
      } else {
        console.error('Error setting up request:', error.message);
        setErrors({ auth: t('unexpectedError') });
      }
    }
  }
    

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleLanguage = () => {
    let newLanguage = 'en';
    if (language === 'en') {
      newLanguage = 'fr';
    } else if (language === 'fr') {
      newLanguage = 'ar';
    } else {
      newLanguage = 'en';
    }

    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    router.push(router.pathname, router.asPath, { locale: newLanguage });
  };

  const handleForgotPassword = () => {
    router.push('/EmailVerificationPage');
  };

  return (
    <div className="container nunito">
      <div className="left-panel">
        <div className="left-content">
          <h1 className='white'>{t('welcomeMessage')}</h1>
          <p className='white'>{t('signInMessage')}</p>
        </div>
      </div>

      <div className="right-panel">
        <div className="form-container">
          <button className="language-toggle triangle-icon" onClick={toggleLanguage}>
            {language === 'en' ? (
              <span className="fi fi-gb"></span>
            ) : language === 'fr' ? (
              <span className="fi fi-fr"></span>
            ) : (
              <span className="fi fi-sa"></span>
            )}
          </button>

          <form onSubmit={handleSignIn}>
            <h1 className='sidebargrey'>{t('submitButton')}</h1>
            <div className="input-group">
              <div className="input-with-icon">
                <Image src={emailIcon} width={20} height={20} alt="email icon" className="icon" />
                <input
                  type="email"
                  id="email"
                  placeholder={t('emailPlaceholder')}
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  aria-label="Email"
                  className="black nunito"
                />
              </div>
           <div className='mt-3'>
                {errors.email && <ErrorAlert message={errors.email} />}
           </div>
            </div>
            <div className="input-group">
              <div className="input-with-icon">
                <Image src={passwordIcon} width={20} height={20} alt="password icon" className="icon" />
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  placeholder={t('passwordPlaceholder')}
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  aria-label="Password"
                />
                <Image
                  src={passwordVisible ? eyeO : eyeC}
                  width={20}
                  height={20}
                  alt="visibility icon"
                  className="visibility-icon"
                  onClick={togglePasswordVisibility}
                />
              </div>
              <div className='mt-3'>
                   {errors.password && <ErrorAlert message={errors.password} />}
              </div>
            </div>

            <div className="checkbox-container">
              <label>
                <input 
                  type="checkbox" 
                  checked={isTermsChecked} 
                  onChange={(e) => setIsTermsChecked(e.target.checked)} 
                />
                {t('agreeToTerms')} <a className="mx-1" href="#">
                  {t('termsLink')}
                </a> {t('and')} <a className="mx-1" href="#">
                  {t('privacyLink')}
                </a>
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={isRememberMeChecked} 
                  onChange={(e) => setIsRememberMeChecked(e.target.checked)} 
                />
                {t('RememberMe')}
              </label>
            </div>
            {errors.terms && <ErrorAlert message={errors.terms} />}
            {errors.auth && <ErrorAlert message={errors.auth} />}
            {success && <SuccessAlert message={success} />}
            <SubmitButton onClick={handleSignIn}>{t('submitButton')}</SubmitButton>
            <div className="forgot-password grey">
              <span onClick={handleForgotPassword} style={{ cursor: 'pointer' }}>
                {t('forgotPassword')}
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['home'])),
    },
  };
}
