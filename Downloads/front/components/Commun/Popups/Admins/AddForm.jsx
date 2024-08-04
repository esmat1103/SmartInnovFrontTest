import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import returnIcon from '/public/assets/return.svg';
import SuccessAlert from '../../Alerts/success-alert';
import ErrorAlert from '../../Alerts/error-alert';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import eyeC from '../../../../public/assets/iconsLogin/eyeC.svg';
import eyeO from '../../../../public/assets/iconsLogin/eyeO.svg';
import profilePlaceholder from '../../../../public/assets/profile.svg'; 
import axios from 'axios';

const AddAdmin = ({ isOpen, onClose }) => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (showErrorAlert) {
      const timer = setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000); 

      return () => clearTimeout(timer); 
    }
  }, [showErrorAlert]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const role = 'admin';

    if (!firstName || !lastName || !email || !password ) {
      setErrorMessage('Please fill in all the fields.');
      setShowErrorAlert(true);
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      setShowErrorAlert(true);
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage('Password must be at least 8 characters long, including a number, an uppercase letter, and a special character.');
      setShowErrorAlert(true);
      return;
    }


    try {
      const userResponse = await axios.get(`http://localhost:3008/users/email/${email}`);
      if (userResponse.status === 200) {
        setErrorMessage('User already exists.');
        setShowErrorAlert(true);
        return;
      }
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        setErrorMessage('Error checking user existence.');
        setShowErrorAlert(true);
        return;
      }
    }

    

    try {
      const formattedPhone = phone.replace(/(\+\d{1,3})?(\d{3})(\d{3})(\d{4})/, function(match, country, firstPart, secondPart, thirdPart) {
        if (country) {
          return `${country} ${firstPart} ${secondPart} ${thirdPart}`;
        } else {
          return `+${firstPart} ${secondPart} ${thirdPart}`;
        }
      });

      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('phoneNumber', formattedPhone);
      formData.append('role', role);

      if (fileInputRef.current && fileInputRef.current.files[0]) {
        formData.append('profileImage', fileInputRef.current.files[0]);
      }

      const response = await axios.post(
        'http://localhost:3008/users/admins',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201) {
        setShowErrorAlert(false);
        setShowSuccessAlert(true);
        setTimeout(() => {
          setShowSuccessAlert(false);
          onClose();
        }, 3000);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setErrorMessage('Error creating user. Please try again.');
      setShowErrorAlert(true);
    }
  };

  const closeSuccessAlert = () => {
    setShowSuccessAlert(false);
  };

  const closeErrorAlert = () => {
    setShowErrorAlert(false);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="form-container-popup nunito">
      <button className="return-button mb-5" onClick={onClose}>
        <Image src={returnIcon} alt="Return" className="return-icon" width={25} height={25} />
      </button>
      {showSuccessAlert && <SuccessAlert message="Admin added successfully!" onClose={closeSuccessAlert} />}
      {showErrorAlert && <ErrorAlert message={errorMessage} onClose={closeErrorAlert} />}

      <form className="mt-5" onSubmit={handleSubmit}>
        {selectedImage ? (
          <div className="image-container flex justify-center items-center" onClick={handleFileSelect}>
            <Image src={selectedImage} className='selected-image' alt="Selected Image" width={80} height={80} />
          </div>
        ) : (
          <div className="image-placeholder flex justify-center items-center" onClick={handleFileSelect}>
            <Image src={profilePlaceholder} alt="placeholder" width={80} height={80} />
          </div>
        )}
        <input
          type="file"
          id="profileImage"
          name="profileImage"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <div className="form-group mt-5">
          <div className="flex mt-5">
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="input-field mr-2"
              placeholder="First Name"
              required
            />
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="input-field"
              placeholder="Last Name"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            className="input-field"
            placeholder="Email"
            required
            pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
            title="Enter a valid email address"
          />
        </div>
        <div className="form-group">
          <PhoneInput
            country={'tn'}
            value={phone}
            onChange={(phone) => setPhone(phone)}
            inputProps={{
              name: 'phone',
              autoFocus: false
            }}
            containerClass="react-tel-input"
            inputClass="form-control"
          />
        </div>
        <div className="form-group">
          <div className="input-with-icon">
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              className="input-field"
              placeholder="Password"
              required
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
        </div>
        <button type="submit" className="submit-button">Add</button>
      </form>
    </div>
  );
};

export default AddAdmin;
