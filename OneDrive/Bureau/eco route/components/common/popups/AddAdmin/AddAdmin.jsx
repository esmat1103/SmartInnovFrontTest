import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import close from '@/public/main_content/arrow1.svg';
import { db,auth } from '@/app/config/firebaseConfig.mjs';
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';
import { ref,getStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import profile from "@/public/main_content/profile.svg";
import SuccessAlert from '../../../../utils/successAlert'; 
import ErrorAlert from '../../../../utils/errorAlert';


const storage = getStorage();

const AddAdminPopup = ({ isOpen, onClose }) => {
  const [adminData, setAdminData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    governorate: '', 
    municipality: '', 
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [governorates, setGovernorates] = useState([]); 
  const [municipalities, setMunicipalities] = useState([]); 
  const fileInputRef = useRef();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowSuccessAlert(false);
      setShowErrorAlert(false);
      fetchGovernorates(); 
    }
  }, [isOpen]);


  useEffect(() => {
    if (adminData.governorate) {
      fetchMunicipalities(adminData.governorate); 
    }
  }, [adminData.governorate]);


// Fetch all governorates 
  const fetchGovernorates = async () => {
    try {
      const governoratesCollection = collection(db, 'governorates'); 
      const querySnapshot = await getDocs(governoratesCollection);
      const governoratesData = querySnapshot.docs.map(doc => doc.data().name);
      setGovernorates(governoratesData);
    } catch (error) {
      console.error('Error fetching governorates:', error);
    }
  };

//Fetch municipalities for a specific governorate 
  const fetchMunicipalities = async (governorate) => {
    try {
      const governorateDocRef = doc(db, 'governorates', governorate);
      const governorateDocSnap = await getDoc(governorateDocRef);
      if (governorateDocSnap.exists()) {
        const municipalityCollectionRef = collection(governorateDocRef, 'municipalities');
        const querySnapshot = await getDocs(municipalityCollectionRef);
        const municipalityData = querySnapshot.docs.map(doc => doc.data().name);
        setMunicipalities(municipalityData);
      } else {
        console.error('No such document!');
        setMunicipalities([]); 
      }
    } catch (error) {
      console.error('Error fetching municipalities:', error);
    }
  };
  
// handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAdminData({ ...adminData, [name]: value });
  };


// Add admin data to Firestore collection
  const addAdminDocument = async (adminData) => {
    try {
      const docRef = await addDoc(collection(db, 'admins'), adminData);
      console.log('Admin added with ID:', docRef.id);
    } catch (error) {
      console.error('Error adding admin document:', error);
      throw error;
    }
  };


// Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!adminData.email || !adminData.password) {
      setShowErrorAlert(true);
      setShowSuccessAlert(false); 
      return;
    }

    try {
      const adminCredential = await createUserWithEmailAndPassword(
        auth,
        adminData.email,
        adminData.password
      );
      const admin = adminCredential.user;

      let imageURL = '';
      if (selectedImage) {
        const file = fileInputRef.current.files[0];
        const imageRef = ref(storage, `adminsPictures/${admin.uid}/${file.name}`);
        await uploadBytes(imageRef, file);
        imageURL = await getDownloadURL(imageRef);
      }

      const adminDataWithUID = { ...adminData, uid: admin.uid, imageUrl: imageURL,role:'admin', };
      await addAdminDocument(adminDataWithUID);

      setShowSuccessAlert(true);
      setShowErrorAlert(false); 
      setTimeout(() => {
        setAdminData({
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          governorate: '', 
          municipality: '', 
        });
        setSelectedImage(null);
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error creating admin:', error);
      setShowErrorAlert(true);
      setShowSuccessAlert(false); 
    }
  };


  if (!isOpen) return null;
  
  return (
    <div className={`popup  ${isOpen ? 'popup-open' : ''}`}>
       {showSuccessAlert && <SuccessAlert message="Admin added successfully!" />}
       {showErrorAlert && <ErrorAlert message="Please fill in all the fields"/>}
      <div className='flex  '>
        <button onClick={onClose}>
          <Image src={close} alt="close" className='hauto ' width={30} />
        </button>
      </div>

      <div className='center '>
       
        <label htmlFor="profileImage" className="image-placeholder">
          {selectedImage ? (
            <div className="image-container" style={{ backgroundImage: `url(${selectedImage})` }}>
              {!selectedImage && <Image src={profile} alt='placeholder' width={100} height={100} className='center hauto' />}
            </div>
          ) : (
            <>
              <Image src={profile} alt='placeholder' width={100} className='center hauto' />
            </>
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
        </label>
      </div>

      <form className='mt-3 ' onSubmit={handleSubmit}>
        <div className="form-group ">
          <input
            type="text"
            id="first_name"
            name="first_name"
            placeholder="First Name"
            className=" input-2 mr1"
            value={adminData.first_name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            id="last_name"
            name="last_name"
            placeholder="Last Name"
            className="input-2 ml-1 "
            value={adminData.last_name}
            onChange={handleInputChange}
          />
        </div>
       
        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            className="custom-input"
            value={adminData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            className="custom-input"
            value={adminData.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group"> 
          <div className="custom-select-wrapper">
            <select
              id="governorate"
              name="governorate"
              className="custom-select"
              value={adminData.governorate}
              onChange={handleInputChange}
            >
              <option value="">Select Governorate</option>
              {governorates.map(governorate => (
                <option key={governorate} value={governorate}>{governorate}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <div className="custom-select-wrapper">
            <select
              id="municipality"
              name="municipality"
              className="custom-select"
              value={adminData.municipality}
              onChange={handleInputChange}
              >
                
              <option value="">Select Municipality</option>
              {municipalities && municipalities.map(municipality => {
                console.log(municipalities);
                return (
                    <option key={municipality} value={municipality}>{municipality}</option>
                );
            })}

            </select>
          </div>
        </div>

        <div className="form-group"> 
          <button type="submit" className='addEmpl ml-auto'>Add</button>
        </div>
      </form>
    </div>
  );
};

export default AddAdminPopup;
