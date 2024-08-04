import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import emailIcon from '../public/assets/iconsLogin/mail.svg';
import passwordIcon from '../public/assets/iconsLogin/pass.svg';
import eyeC from '../public/assets/iconsLogin/eyeC.svg';
import eyeO from '../public/assets/iconsLogin/eyeO.svg';
import SubmitButton from '../components/Commun/Buttons/SubmitButton';

const HomePage = () => {
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [language, setLanguage] = useState('English');
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

  const textOptions = {
    English: {
      welcomeMessage: 'Welcome Back!',
      signInMessage: 'Please sign in to continue.',
      emailPlaceholder: 'Enter email',
      passwordPlaceholder: 'Enter password',
      submitButton: 'Sign In',
      forgotPassword: 'Forgot Password?',
      RememberMe: 'Remember me',
      agreeToTerms: 'I agree to the',
      termsLink: 'Terms of Service',
      privacyLink: 'Privacy Policy',
    },
    French: {
      welcomeMessage: 'Bienvenue!',
      signInMessage: 'Veuillez vous connecter pour continuer.',
      emailPlaceholder: 'Entrez votre email',
      passwordPlaceholder: 'Entrez votre mot de passe',
      submitButton: 'Se connecter',
      forgotPassword: 'Mot de passe oublié?',
      RememberMe: 'Se souvenir de moi',
      agreeToTerms: 'J\'accepte les',
      termsLink: 'Conditions d\'utilisation',
      privacyLink: 'Politique de confidentialité',
    },
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    console.log('Email:', inputEmail);
    console.log('Password:', inputPassword);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'English' ? 'French' : 'English');
  };

  const handleForgotPassword = () => {
    router.push('/EmailVerificationPage');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  const {
    welcomeMessage,
    signInMessage,
    emailPlaceholder,
    passwordPlaceholder,
    submitButton,
    forgotPassword,
    RememberMe,
    agreeToTerms,
    termsLink,
    privacyLink,
  } = textOptions[language];

  return (
    <div className="container nunito">
      <div className="left-panel">
        <div className="left-content">
          <h1>{welcomeMessage}</h1>
          <p>{signInMessage}</p>
        </div>
      </div>

      <div className="right-panel">
        <div className="form-container">
          <button className="language-toggle triangle-icon" onClick={toggleLanguage}>
            {language === 'English' ? (
              <>
                <span className="fi fi-gb"></span>
                <span className="ml-2 grey">English</span>
              </>
            ) : (
              <>
                <span className="fi fi-fr"></span>
                <span className="ml-2 grey ">French</span>
              </>
            )}
          </button>

          <form onSubmit={handleSignIn}>
            <h1>{submitButton}</h1>
            <div className="input-group">
              <div className="input-with-icon">
                <Image src={emailIcon} width={20} height={20} alt="email icon" className="icon" />
                <input
                  type="email"
                  id="email"
                  placeholder={emailPlaceholder}
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  aria-label="Email"
                  className="black nunito"
                />
              </div>
            </div>
            <div className="input-group">
              <div className="input-with-icon">
                <Image src={passwordIcon} width={20} height={20} alt="password icon" className="icon" />
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  placeholder={passwordPlaceholder}
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  aria-label="Password"
                />
                <Image
                  src={eyeC}
                  width={20}
                  height={20}
                  alt="visibility icon closed"
                  className={`visibility-icon ${!passwordVisible ? 'visible' : ''}`}
                  onClick={togglePasswordVisibility}
                />
                <Image
                  src={eyeO}
                  width={20}
                  height={20}
                  alt="visibility icon open"
                  className={`visibility-icon ${passwordVisible ? 'visible' : ''}`}
                  onClick={togglePasswordVisibility}
                />
              </div>
            </div>

            <div className="checkbox-container">
              <label>
                <input type="checkbox" />
                {agreeToTerms} <a className="mx-1" href="#">
                  {termsLink}
                </a>{' '}
                {agreeToTerms} <a className="mx-1" href="#">
                  {privacyLink}
                </a>
              </label>
              <label>
                <input type="checkbox" />
                {RememberMe}
              </label>
            </div>
            <SubmitButton onClick={handleFormSubmit}>{submitButton}</SubmitButton>
            <div className="forgot-password grey">
              <span onClick={handleForgotPassword} style={{ cursor: 'pointer' }}>
                {forgotPassword}
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
