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

const UpdateAdmin = ({ isOpen, onClose, adminData }) => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [adminDataState, setAdminDataState] = useState(adminData);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      console.log('Token retrieved from localStorage:', storedToken);
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


  useEffect(() => {
    if (adminData) {
      setPhone(adminData.phoneNumber || '');
      setProfileImage(adminData.profileImage || '');
    }
  }, [adminData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formObject = {};
    formData.forEach(function (value, key) {
      formObject[key] = value;
    });

    formObject.phoneNumber = phone; 

    if (!validatePassword(password)) {
      setErrorMessage('Password must be at least 8 characters long, including a number, an uppercase letter, and a special character.');
      setShowErrorAlert(true);
      return;
    }


    console.log('Form data before sending:', formObject);

    try {
      const response = await axios.put(
        `http://localhost:3008/users/updateAdmin/${adminData._id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Update admin response:', response);

      if (response.status === 200) {
        const updatedAdmin = response.data.user;
        setAdminDataState(updatedAdmin);
        setShowErrorAlert(false);
        setShowSuccessAlert(true);
        setTimeout(() => {
          setShowSuccessAlert(false);
          onClose();
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      setErrorMessage('Error updating admin. Please try again.');
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000); 
    }
  };

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3008');

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);
    };
    
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, []);

  const closeSuccessAlert = () => {
    setShowSuccessAlert(false);
  };

  const closeErrorAlert = () => {
    setShowErrorAlert(false);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(file); 
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
      {showSuccessAlert && <SuccessAlert message="Admin updated successfully!" onClose={closeSuccessAlert} />}
      {showErrorAlert && <ErrorAlert message={errorMessage} onClose={closeErrorAlert} />}

      <form className="mt-5" onSubmit={handleSubmit}>
        {selectedImage ? (
          <div className="image-container flex justify-center items-center" onClick={handleFileSelect}>
            <Image src={URL.createObjectURL(selectedImage)} className="selected-image" alt="Selected Image" width={80} height={80} />
          </div>
        ) : (
          <div className="image-container flex justify-center items-center" onClick={handleFileSelect}>
            <Image
              className="selected-image"
              src={adminData && adminData.profileImage ? `http://localhost:3008/uploads/${adminData.profileImage}` : profilePlaceholder}
              alt="placeholder"
              width={80}
              height={80}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = profilePlaceholder;
              }}
            />
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
        )}
        <div className="form-group mt-5">
          <div className="flex mt-5">
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="input-field mr-2"
              placeholder="First Name"
              defaultValue={adminData && adminData.firstName ? adminData.firstName : ''}
              required
            />
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="input-field"
              placeholder="Last Name"
              defaultValue={adminData && adminData.lastName ? adminData.lastName : ''}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            className="input-field read-only"
            placeholder="Email"
            defaultValue={adminData && adminData.email ? adminData.email : ''}
            readOnly
            required
          />
        </div>

        <div className="form-group">
          <PhoneInput
            country={'us'}
            value={phone}
            onChange={(phone) => setPhone(phone)}
            inputClass="phone-input"
            inputProps={{
              name: 'phoneNumber', 
              required: true,
              autoFocus: false,
            }}
          />
        </div>
        <div className="form-group mt-5 relative">
          <input
            type={passwordVisible ? 'text' : 'password'}
            id="password"
            name="password"
            className="input-field"
            placeholder="Enter new password (optional)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-0 top-0 mt-1 mr-1 p-2 focus:outline-none"
            onClick={togglePasswordVisibility}
          >
            <Image src={passwordVisible ? eyeO : eyeC} alt="Toggle password visibility" width={20} height={20} />
          </button>
        </div>

        <div className="flex justify-center items-center">
          <button type="submit" className="submit-button">
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAdmin;
