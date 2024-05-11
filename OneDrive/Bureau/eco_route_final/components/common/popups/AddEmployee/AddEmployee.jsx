import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import close from '@/public/main_content/arrow1.svg';
import { db , auth} from '@/app/config/firebaseConfig.mjs';
import { collection, addDoc,getDocs,getDoc,doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import profile from "@/public/main_content/profile.svg";
import SuccessAlert from '../../../../utils/successAlert'; 
import ErrorAlert from '../../../../utils/errorAlert';


const storage = getStorage();

const AddEmployeePopup = ({ isOpen, onClose }) => {
  const [employeeData, setEmployeeData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    governorate: '',
    municipality:'',
    phone_number: '',
    years_of_experience: '',
    total_score:0
  });
 
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef();
  const [governorates, setGovernorates] = useState([]); 
  const [municipalities, setMunicipalities] = useState([]); 
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
    if (employeeData.governorate) {
      fetchMunicipalities(employeeData.governorate); 
    }
  }, [employeeData.governorate]);


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

// Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
  };

// Handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };


// Add employee document to Firestore
  const addEmployeeDocument = async (employeeData) => {
    try {
      const docRef = await addDoc(collection(db, 'employees'), employeeData);
      console.log('Employee added with ID:', docRef.id);
    } catch (error) {
      console.error('Error adding employee document:', error);
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!employeeData.email || !employeeData.password) {
      setShowErrorAlert(true);
      setShowSuccessAlert(false); 
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        employeeData.email,
        employeeData.password
      );
      const user = userCredential.user;

      // Upload profile image if selected
      let imageURL = '';
      if (selectedImage) {
        const file = fileInputRef.current.files[0];
        const imageRef = ref(storage, `employeesPictures/${user.uid}/${file.name}`);
        await uploadBytes(imageRef, file);
        imageURL = await getDownloadURL(imageRef);
      }

      // Create an employee document in Firestore and associate it with the Firebase Authentication user
      const employeeDataWithUID = { ...employeeData, uid: user.uid, imageUrl: imageURL };
      await addEmployeeDocument(employeeDataWithUID);

      setShowSuccessAlert(true);
      setShowErrorAlert(false); 
      setTimeout(() => {
        setEmployeeData({
          governorate: '', 
          municipality: '', 
          email: '',
          first_name: '',
          last_name: '',
          password: '',
          phone_number: '',
          years_of_experience: '',
        });
        setSelectedImage(null);
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error creating employee:', error);
      setShowErrorAlert(true);
      setShowSuccessAlert(false); 
    }
  };

  if (!isOpen) return null;
  
  return (
    <div className={`popup  ${isOpen ? 'popup-open' : ''}`}>
       {showSuccessAlert && <SuccessAlert message="Employee added successfully!" />}
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
            value={employeeData.first_name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            id="last_name"
            name="last_name"
            placeholder="Last Name"
            className="input-2 ml-1 "
            value={employeeData.last_name}
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
            value={employeeData.email}
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
            value={employeeData.password}
            onChange={handleInputChange}
         
          />
        </div>
        <div className="form-group">
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            placeholder="Phone Number"
            className="custom-input"
            value={employeeData.phone_number}
            onChange={handleInputChange}
            
          />
        </div>
        <div className="form-group"> 
          <div className="custom-select-wrapper">
            <select
              id="governorate"
              name="governorate"
              className="custom-select"
              value={employeeData.governorate}
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
              value={employeeData.municipality}
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
          <input
            type="number"
            id="years_of_experience"
            name="years_of_experience"
            placeholder="years of experience"
            className="input-2 ml-1"
            value={employeeData.years_of_experience}
            onChange={handleInputChange}
        
          />
        </div>
       
        <div className="form-group"> 
        <button type="submit" className='addEmpl ml-auto'>Add</button>
        </div>
         
      </form> 
    </div>
  );
};

export default AddEmployeePopup;