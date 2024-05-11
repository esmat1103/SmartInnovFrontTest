import React, { useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from '@/app/config/firebaseConfig.mjs';
import { auth } from '@/app/config/firebaseConfig.mjs';
import { GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import SuccessAlert from '../utils/successAlert';
import ErrorAlert from '../utils/errorAlert';


const HomePage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [role, setRole] = useState(""); // Define role state
  const router = useRouter();
  
  const signIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User signed in:", user);
  
      // Check user permissions and store in session storage
      let role = '';
      if (user.email === "esmateddinekhamassi@gmail.com" || user.email === "siwarmelliti072@gmail.com") {
        role = 'superadmin';
      } else {
        role = 'admin';
      }
  
      sessionStorage.setItem('role', role);
  
      setShowError(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);

        // Redirect based on user role
        if (role === 'superadmin') {
          router.push('superadmins/dashboard');
        } else {
          router.push('admins/dashboard');
        }
      }, 2000);
    } catch (error) {
      console.error(error);
      if (error.code === "auth/invalid-email") {
        setErrorMessage("Invalid email format. Please check and try again.");
      } else if (error.code === "auth/wrong-password") {
        setErrorMessage("Incorrect password. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        setErrorMessage("The email address is not registered.");
      } else {
        setErrorMessage("Failed to sign in. Please check your credentials and try again.");
      }
      setShowError(true);
      setShowSuccess(false);
    }
  };
  
// Signin with Goggle
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, GoogleAuthProvider);
      setShowError(false);
      setShowSuccess(true);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setShowError(true);
    }
  };

  // Function to handle navigation to the register page
  const redirectToRegister = () => {
    router.push('/register');
  };

  return (
    <div className="background-container">
      <div className="login-page">
        <section className="login-container">
          <h2 className='mb-3 black rajdhani pt-3 f26'>Login</h2>
          <form className="login-form" onSubmit={(e) => { e.preventDefault(); signIn(); }}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                autoComplete="current-email"
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn submit-button">
              Login
            </button>
          </form>
          <div className="or-line">
            <div className="line"></div>
            <p>or</p>
            <div className="line"></div>
          </div>
          <button onClick={signInWithGoogle} className="google-button">
            <div className="center-content">
              <Image src="/login/google.svg" width={24} height={24} alt="google_icon" className="hauto mt-1 google-icon" />
              <span className='grey ml-3'> Login with Google</span>
            </div>
          </button>
          <div className="form-footer">
            <label className="remember-me grey pl-2 mb-3">
              <input type="checkbox" /> <span className='ml-1 '>Remember Me</span>
            </label>
            <a href="" className="grey mb-3">Forgot Password</a>
          </div>
        </section>
        <section className="welcome-container">
          <h1 className="f32">Don t Have An Account ?</h1>
          <button className="sign-up-button open-sans f14" onClick={redirectToRegister}>Sign Up</button>
        </section>
      </div>
      {showSuccess && (
        <SuccessAlert  message= {role == 'superadmin' ? "Super Admin signed in successfully." : "Signed in successfully."} />
      )}
      {showError && (
        <ErrorAlert message={errorMessage} />
      )}
    </div>
  );
};

export default HomePage;
