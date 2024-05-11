import { useState } from 'react';
import { createUserWithEmailAndPassword, auth,db } from '../app/config/firebaseConfig.mjs'; 
import { useRouter } from 'next/router'; 
import { collection, addDoc } from 'firebase/firestore';
const RegisterPage = () => {
  const router = useRouter(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setShowError(true);
      setShowSuccess(false); // Ensure success alert is hidden
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a document in the 'superadmins' collection in Firestore
      const superadminData = {
        email: email,
        password: password,
        role: 'superadmin',
      };
      await addSuperadminDocument(user.uid, superadminData);

      setShowSuccess(true);
      setShowError(false); // Ensure error alert is hidden
      setTimeout(() => {
        router.push('/'); // Redirect to '/' after successful signup
      }, 1000);
    } catch (error) {
      setShowError(true);
      setShowSuccess(false); // Ensure success alert is hidden
      console.error('Error signing up:', error.message);
    }
  };

  const addSuperadminDocument = async (userId, superadminData) => {
    try {
      // Add superadmin document to Firestore
      await addDoc(collection(db, 'superadmins'), superadminData);
      console.log('Superadmin added with ID:', userId);
    } catch (error) {
      console.error('Error adding superadmin document:', error);
      throw error;
    }
  };

  return (
    <div className="background-container pb-5">
      <div className="login-page mt-5">
        <section className="login-container">
          <h2 className='mb-3 black rajdhani f26'>Sign Up</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <button type="submit" className="btn  mb-5 submit-button">
              Sign Up
            </button>
          </form>
        </section>
        <section className="welcome-container">
          <h1 className='f32'>Already have an account ?</h1>
          <button className="sign-up-button open-sans f14" onClick={() => router.push('/')}>Login</button>
        </section>
      </div>
      {showSuccess && (
        <div className="success-message">User signed up successfully. Redirecting to login...</div>
      )}
      {showError && (
        <div className="error-message">Failed to sign up. Please try again.</div>
      )}
    </div>
  );
};

export default RegisterPage;
