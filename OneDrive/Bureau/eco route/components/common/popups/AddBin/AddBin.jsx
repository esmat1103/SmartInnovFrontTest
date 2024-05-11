import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import close from '@/public/main_content/arrow1.svg';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/app/config/firebaseConfig.mjs';
import { collection, addDoc, getDocs, doc, getDoc,GeoPoint } from 'firebase/firestore'
import SuccessAlert from '../../../../utils/successAlert'; 
import ErrorAlert from '../../../../utils/errorAlert';

const AddBinPopup = ({ isOpen, onClose }) => {
  const [binData, setBinData] = useState({
    governorate: '',
    municipality: '',
    latitude:'',
    longitude: '',
    location_name:'',
    filling_level: 0,
    status: '',
    tilt_status:''
  });

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [governorates, setGovernorates] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setShowSuccessAlert(false);
      setShowErrorAlert(false);
      fetchGovernorates();
    }
  }, [isOpen]);


  useEffect(() => {
    if (binData.governorate) {
      fetchMunicipalities(binData.governorate);
    }
  }, [binData.governorate]);


// Fetch all governorates 
  const fetchGovernorates = async () => {
    try {
      const governoratesCollection = collection(db, 'governorates');
      const querySnapshot = await getDocs(governoratesCollection);
      const governoratesData = querySnapshot.docs.map((doc) => doc.data().name);
      setGovernorates(governoratesData);
    } catch (error) {
      console.error('Error fetching governorates:', error);
    }
  };

// Fetch municipalities for a specific governorate 
  const fetchMunicipalities = async (governorate) => {
    try {
      const governorateDocRef = doc(db, 'governorates', governorate);
      const governorateDocSnap = await getDoc(governorateDocRef);
      if (governorateDocSnap.exists()) {
        const municipalityCollectionRef = collection(governorateDocRef, 'municipalities');
        const querySnapshot = await getDocs(municipalityCollectionRef);
        const municipalityData = querySnapshot.docs.map((doc) => doc.data().name);
        setMunicipalities(municipalityData);
      } else {
        console.error('No such document!');
        setMunicipalities([]);
      }
    } catch (error) {
      console.error('Error fetching municipalities:', error);
    }
  };


// Handle input change
const handleInputChange = (event) => {
  const { name, value } = event.target;
  if (name === 'filling_level') {
    const numberValue = parseFloat(value);
    if (!isNaN(numberValue)) {
      setBinData({ ...binData, [name]: numberValue });
    } else {
      // Handle invalid input (e.g., show an error message)
    }
  } else {
    setBinData({ ...binData, [name]: value });
  }
};



// Add bin data to Firestore collection
  const addBinDocument = async (binData) => {
    try {
      const uid = uuidv4(); // Generate a UUID
  
      const docRef = await addDoc(collection(db, 'bins'), {
        binId: uid,
        governorate: binData.governorate,
        municipality: binData.municipality,
        location: new GeoPoint(
          parseFloat(binData.latitude),
          parseFloat(binData.longitude)
        ),
        location_name: binData.location_name,
        filling_level: binData.filling_level,
        status: binData.status,
        tilt_status: binData.tilt_status
      });
      console.log('Bin added with ID:', docRef);
  
      return docRef.id; 
    } catch (error) {
      console.error('Error adding bin document:', error);
      throw error;
    }
  };
  

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!binData.governorate || !binData.municipality || !binData.latitude || !binData.longitude || !binData.location_name  || !binData.filling_level || !binData.status || !binData.tilt_status) {
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
      return;
    }
    
    try {
      await addBinDocument(binData);
      setShowSuccessAlert(true);
      setShowErrorAlert(false);
  
      // Clear form and close popup after 2 seconds
      setTimeout(() => {
        setBinData({
          governorate: '',
          municipality: '',
          latitude:'',
          longitude: '',
          location_name:'',
          filling_level: 0,
          status: '',
          tilt_status:''
        });
        onClose(); 
      }, 2000);
    } catch (error) {
      console.error('Error creating bin:', error);
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className={`popup  ${isOpen ? 'popup-open' : ''}`}>
      {showSuccessAlert && <SuccessAlert message="Bin added successfully!" />}
      {showErrorAlert && <ErrorAlert message="Please fill in all the fields" />}
      <div className='flex'>
        <button onClick={onClose}>
          <Image src={close} alt="close" className='hauto ' width={30} />
        </button>
      </div>

      <form className='mt-3 ' onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="custom-select-wrapper">
            <select
              id="governorate"
              name="governorate"
              className="custom-select"
              value={binData.governorate}
              onChange={handleInputChange}
            >
              <option value="">Select Governorate</option>
              {governorates.map((governorate) => (
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
              value={binData.municipality}
              onChange={handleInputChange}
            >
              <option value="">Select Municipality</option>
              {municipalities && municipalities.map((municipality) => (
                <option key={municipality} value={municipality}>{municipality}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <input
            type="text"
            id="latitude"
            name="latitude"
            placeholder="Latitude"
            className="input-2 ml-1 "
            value={binData.latitude}
            onChange={handleInputChange}
          />
          <input
            type="text"
            id="longitude"
            name="longitude"
            placeholder="Longitude"
            className="input-2 ml-1 "
            value={binData.longitude}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            id="location_name"
            name="location_name"
            placeholder="Location Name"
            className="input-2 ml-1 "
            value={binData.location_name}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <input
            type="number"
            id="filling_level"
            name="filling_level"
            placeholder="Filling Level"
            className="input-2 ml-1 "
            value={binData.filling_level}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <select
          id="status"
          name="status"
          className="custom-select "
          value={binData.status}
          onChange={handleInputChange}
          > <option value="">Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            </select>
        </div>
        <div className="form-group">
          <select
          id="tilt_status"
          name="tilt_status"
          className="custom-select "
          value={binData.tilt_status}
          onChange={handleInputChange}
          >
            <option value="">Tilt Status</option>
            <option value="Fallen">Fallen</option>
            <option value="Stable">Stable</option>
            </select>
        </div>
       
        <div className="form-group"> 
        <button type="submit" className='addEmpl ml-auto'>Add</button>
        </div>   

      </form> 
    </div>
  );
};

export default AddBinPopup;
