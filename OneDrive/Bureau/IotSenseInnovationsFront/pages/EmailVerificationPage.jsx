import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import emailIcon from '../public/assets/iconsLogin/mail.svg';
import SubmitButton from '../components/Commun/Buttons/SubmitButton';

const EmailVerificationPage = () => {
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('English'); // Default language
  const router = useRouter();

  // Retrieve language from local storage on initial render
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  const textOptions = {
    English: {
      title: 'Forgot Password',
      description: 'Please enter your email address to receive a verification link.',
      placeholder: 'Enter email',
      submitButton: 'Send Verification Email',
    },
    French: {
      title: 'Mot de passe oublié',
      description: 'Veuillez entrer votre adresse e-mail pour recevoir un lien de vérification.',
      placeholder: 'Entrez votre email',
      submitButton: 'Envoyer un e-mail de vérification',
    },
  };

  const handleSendVerificationEmail = (e) => {
    e.preventDefault();
    console.log('Verification email sent to:', email);
    router.push('/reset-password');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  const { title, description, placeholder, submitButton } = textOptions[language];

  return (
    <div className="container flex justify-center items-center min-h-screen">
      <div className="content-container bg-white p-8 shadow-md max-w-md">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p className="text-gray-600 mb-6">{description}</p>
        <form onSubmit={handleSendVerificationEmail}>
          <div className="input-group">
            <div className="input-with-icon">
              <Image src={emailIcon} width={20} height={20} alt="email icon" className="icon" />
              <input
                type="email"
                id="email"
                placeholder={placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email"
                className="black nunito"
              />
            </div>
          </div>
          <SubmitButton onClick={handleFormSubmit}>{submitButton}</SubmitButton>
        </form>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
