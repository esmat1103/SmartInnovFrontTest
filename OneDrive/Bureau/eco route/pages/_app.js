import React from 'react';
import { useState,useEffect } from 'react';
import '../app/globals.css';
import { auth } from '@/app/config/firebaseConfig.mjs';
import { browserLocalPersistence } from 'firebase/auth';
import { setPersistence } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';


setPersistence(auth, browserLocalPersistence);

export default function App({ Component, pageProps }) {
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setAuthInitialized(true);
      } else {
        // User is signed out
        setAuthInitialized(true); 
        console.error('User not authenticated.');
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <>
      {authInitialized && <Component {...pageProps} />}
    </>
  );
}
