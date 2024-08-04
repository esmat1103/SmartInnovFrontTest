import React, { useRef, useState } from 'react';
import Image from 'next/image';
import returnIcon from '/public/assets/return.svg';
import profile from '/public/assets/profile.svg';
import SuccessAlert from '../../Alerts/success-alert';
import ErrorAlert from '../../Alerts/error-alert';


const FormClient = ({ isOpen, onClose }) => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData(e.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
  
    if (!firstName || !lastName || !email || !phone || !password) {
      setShowErrorAlert(true); // Show error alert if any field is empty
      return;
    }
    setShowSuccessAlert(true);
    e.target.reset();
    setSelectedImage(null);
  };
  

  const closeSuccessAlert = () => {
    setShowSuccessAlert(false);
  };

  const closeErrorAlert = () => {
    setShowErrorAlert(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="form-container nunito">
       {showSuccessAlert && <SuccessAlert message="Client added successfully !" onClose={closeSuccessAlert} />}
       {showErrorAlert && <ErrorAlert message="Please fill in all the fields !" onClose={closeErrorAlert} />}
      <button className="return-button mb-5" onClick={onClose}>
        <Image src={returnIcon} alt="Return" className="return-icon" height={25} />
      </button>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          {selectedImage && (
            <div className="image-container flex " style={{ backgroundImage: `url(${selectedImage})` }}></div>
          )}
          {!selectedImage && (
            <div className="image-placeholder flex justify-center items-center">
              <Image src={profile} alt='placeholder' width={80} />
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
        </div>
        <div className="form-group">
          <div className="flex">
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="input-field mr-2"
              placeholder="First Name"
            />
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="input-field"
              placeholder="Last Name"
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
          />
        </div>
        <div className="form-group">
          <input
            type="tel"
            id="phone"
            name="phone"
            className="input-field"
            placeholder="Phone Number"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            name="password"
            className="input-field"
            placeholder="Password"
          />
        </div>
        <button className='add-button w-full' type="submit">Add</button>
      </form>
    </div>
  );
};

export default FormClient;
