import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import SubmitButton from '../components/Commun/Buttons/SubmitButton';
import passwordIcon from '../public/assets/iconsLogin/pass.svg';
import eyeC from '../public/assets/iconsLogin/eyeC.svg';
import eyeO from '../public/assets/iconsLogin/eyeO.svg';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [language, setLanguage] = useState('English');
  const [textOptions, setTextOptions] = useState({});
  const router = useRouter();

  const englishTextOptions = {
    welcomeMessage: 'Reset Password',
    instructions: 'Please enter your email address and new password.',
    passwordPlaceholder: 'Enter password',
    confirmPasswordPlaceholder: 'Confirm password',
    submitButton: 'Reset Password',
    passwordsDoNotMatch: 'Passwords do not match',
    passwordResetFor: 'Password reset for:',
  };

  const frenchTextOptions = {
    welcomeMessage: 'Réinitialiser le mot de passe',
    instructions: 'Veuillez saisir votre adresse e-mail et votre nouveau mot de passe.',
    passwordPlaceholder: 'Entrez le mot de passe',
    confirmPasswordPlaceholder: 'Confirmez le mot de passe',
    submitButton: 'Réinitialiser le mot de passe',
    passwordsDoNotMatch: 'Les mots de passe ne correspondent pas',
    passwordResetFor: 'Réinitialisation du mot de passe pour :',
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    if (language === 'English') {
      setTextOptions(englishTextOptions);
    } else if (language === 'French') {
      setTextOptions(frenchTextOptions);
    }
  }, [language]);

  const handleSendVerificationEmail = (e) => {
    e.preventDefault();
    console.log('Verification email sent to:', email);
    router.push('/');
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log(textOptions.passwordsDoNotMatch);
      return;
    }
    console.log(`${textOptions.passwordResetFor} ${email} with password: ${password}`);
  };

  return (
    <div className="container flex justify-center items-center min-h-screen">
      <div className="content-container bg-white p-8 shadow-md max-w-md">
        <h1 className="text-2xl font-bold mb-4">{textOptions.welcomeMessage}</h1>
        <p className="text-gray-600 mb-6">{textOptions.instructions}</p>
        <form onSubmit={handleFormSubmit}>
          <div className="input-group">
            <div className="input-with-icon">
              <Image src={passwordIcon} width={20} height={20} alt="password icon" className="icon" />
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                placeholder={textOptions.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          <div className="input-group">
            <div className="input-with-icon">
              <Image src={passwordIcon} width={20} height={20} alt="password icon" className="icon" />
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                id="confirmPassword"
                placeholder={textOptions.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-label="Confirm Password"
              />
              <Image
                src={eyeC}
                width={20}
                height={20}
                alt="visibility icon closed"
                className={`visibility-icon ${!confirmPasswordVisible ? 'visible' : ''}`}
                onClick={toggleConfirmPasswordVisibility}
              />
              <Image
                src={eyeO}
                width={20}
                height={20}
                alt="visibility icon open"
                className={`visibility-icon ${confirmPasswordVisible ? 'visible' : ''}`}
                onClick={toggleConfirmPasswordVisibility}
              />
            </div>
          </div>
          <SubmitButton onClick={handleFormSubmit}>{textOptions.submitButton}</SubmitButton>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
