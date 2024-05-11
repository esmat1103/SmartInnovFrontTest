import React, { useEffect, useState } from 'react';
import { db } from '@/app/config/firebaseConfig.mjs';
import { auth } from '@/app/config/firebaseConfig.mjs';
import { setDoc, getDocs, collection ,doc,getDoc} from 'firebase/firestore';
import { updateEmail, updatePassword } from 'firebase/auth';
import { getStorage, ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import EditImageUploader from './editImageUploader'; // Correct import path
import PopupHeader from '../popupHeader';
import EmployeeForm from '../AddEmployee/employeeForm';
import ErrorAlert from '../../../../utils/errorAlert'; // Import the ErrorAlert component
import SuccessAlert from '../../../../utils/successAlert'; // Import the SuccessAlert component

const EditEmployeePopup = ({ isOpen, onClose, employeeData, fetchProfileImageURL }) => {
  const [editedEmployeeData, setEditedEmployeeData] = useState({ ...employeeData });
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [governorates, setGovernorates] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  //Fetch governorates and set initial employee data on popup open
  useEffect(() => {
    setEditedEmployeeData({ ...employeeData });
    fetchGovernorates();
  }, [employeeData]);

//Fetch governorates
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


//Fetch municipalities for a specific governorate from Firestore
  const fetchMunicipalities = async (governorate) => {
    try {
      const governorateDocRef = doc(db, 'governorates', governorate);
      const governorateDocSnap = await getDoc(governorateDocRef);
      if (governorateDocSnap.exists()) {
        const municipalityCollectionRef = collection(db, 'governorates', governorate, 'municipalities');
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
  

  useEffect(() => {
    setEditedEmployeeData({ ...employeeData });
    if (employeeData.uid) {
      const fetchImage = async () => {
        try {
          const imageUrl = await fetchProfileImageURL(employeeData.uid);
          setProfileImageUrl(imageUrl);
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      };
      fetchImage();
    }
  }, [employeeData, fetchProfileImageURL]);


  const handleImageDeletion = async (imageUrl) => {
    if (!imageUrl) return; // Skip deletion if no previous image URL

    const storage = getStorage();
    const imageRef = ref(storage, imageUrl);

    try {
      await deleteObject(imageRef);
      console.log('Previous image deleted successfully');
    } catch (error) {
      console.error('Error deleting previous image:', error);
      setError('Error deleting previous image. Please try again.'); 
    }
  };


  const handleImageUpload = async (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `employeesPictures/${editedEmployeeData.uid}/${file.name}`);

    try {
      // Call image deletion function before upload
      await handleImageDeletion(editedEmployeeData.imageUrl);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      setEditedEmployeeData(prevState => ({
        ...prevState,
        imageUrl: downloadURL
      }));
      setProfileImageUrl(downloadURL);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Error uploading image. Please try again.'); 
    }
  };
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedEmployeeData({ ...editedEmployeeData, [name]: value });
  };


// Update employee
  const handleUpdateEmployee = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'employees'));
      const employeeDocRef = querySnapshot.docs.find(doc => doc.data().uid === editedEmployeeData.uid)?.ref;

      if (!employeeDocRef) {
        console.error('Employee document not found');
        return;
      }

      // Update the email and password in firebase auth
      if (editedEmployeeData.email !== employeeData.email) {
        await updateEmail(auth.currentUser, editedEmployeeData.email);
      }
  
      if (editedEmployeeData.password) {
        await updatePassword(auth.currentUser, editedEmployeeData.password);
      }
  
      // Update the employee data in Firestore
      await setDoc(employeeDocRef, editedEmployeeData);
      console.log('Employee data updated in Firestore');

      // Use the updated profileImageURL from editedEmployeeData
      setProfileImageUrl(editedEmployeeData.imageUrl);

    } catch (error) {
      console.error('Error updating employee:', error);
      throw error; 
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {

      if (
        !editedEmployeeData.first_name ||
        !editedEmployeeData.last_name ||
        !editedEmployeeData.email ||
        !editedEmployeeData.password ||
        !editedEmployeeData.governorate ||
        !editedEmployeeData.municipality ||
        !editedEmployeeData.phone_number ||
        !editedEmployeeData.years_of_experience
      ) {
        setError('Please fill in all the fields');
        return;
      }
  
      // If a file is selected, upload it
    const fileInput = document.getElementById('fileInput');
    const file = fileInput?.files?.[0];
    if (file) {
      await handleImageUpload(file);
    }
  
      await handleUpdateEmployee();
  
      // Reset the form and show success message
      setEditedEmployeeData({ ...employeeData });
      setSuccess('Employee data updated successfully');
      setError(null);
  
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating employee:', error);
      setError('Error updating employee');
      setSuccess(null);
    }
  };


  useEffect(() => {
    if (editedEmployeeData.governorate) {
      fetchMunicipalities(editedEmployeeData.governorate);
    }
  }, [editedEmployeeData.governorate]);


  if (!isOpen) return null;

  return (
    <div className={`popup  ${isOpen ? 'popup-open' : ''}`}>
      {success && <SuccessAlert message={success} />}
      {error && <ErrorAlert message={error} />}
      <PopupHeader onClose={onClose} />

      <EditImageUploader imageUrl={profileImageUrl} handleImageUpload={handleImageUpload} />
      <EmployeeForm employeeData={editedEmployeeData} handleInputChange={handleInputChange} governorates={governorates}
        municipalities={municipalities}/>
      <form className='mt-2' onSubmit={handleSubmit}>
        <div className="form-group">
          <button type="submit" className='addEmpl ml-auto'>Update</button>
        </div>
      </form>
    </div>
  );
};

export default EditEmployeePopup;
