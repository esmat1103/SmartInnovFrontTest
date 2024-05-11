import React, { useEffect, useState } from 'react';
import { db } from '@/app/config/firebaseConfig.mjs';
import { auth } from '@/app/config/firebaseConfig.mjs';
import { setDoc, getDocs, collection,getDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL,uploadBytes, deleteObject,getMetadata } from 'firebase/storage';
import { updateEmail, updatePassword } from 'firebase/auth';
import AdminForm from './adminForm';
import EditImageUploader from './editImageUploader'; 
import PopupHeader from '../popupHeader';
import ErrorAlert from '../../../../utils/errorAlert'; // Import the ErrorAlert component
import SuccessAlert from '../../../../utils/successAlert'; // Import the SuccessAlert component

const EditAdminPopup = ({ isOpen, onClose, adminData, fetchProfileImageURL }) => {
  const [editedAdminData, setEditedAdminData] = useState({ ...adminData });
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [governorates, setGovernorates] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
 

 //Fetch governorates and set initial admin data on popup open
  useEffect(() => {
    setEditedAdminData({ ...adminData });
    fetchGovernorates();
  }, [adminData]);

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
  
//Fetch profile image URL on admin data change  
  useEffect(() => {
    setEditedAdminData({ ...adminData });
    if (adminData.uid) {
      const fetchImage = async () => {
        try {
          const imageUrl = await fetchProfileImageURL(adminData.uid);
          setProfileImageUrl(imageUrl);
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      };
      fetchImage();
    }
  }, [adminData, fetchProfileImageURL]);



  const handleImageDeletion = async (imageUrl) => {
    if (!imageUrl) return; // Skip deletion if no previous image URL

    const storage = getStorage();
    const imageRef = ref(storage, imageUrl);

    try {
      await deleteObject(imageRef);
      console.log('Previous image deleted successfully');
    } catch (error) {
      console.error('Error deleting previous image:', error);
      setError('Error deleting previous image. Please try again.'); // Inform user
    }
  };


  const handleImageUpload = async (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `adminsPictures/${editedAdminData.uid}/${file.name}`);

    try {
      // Call image deletion function before upload
      await handleImageDeletion(editedAdminData.imageUrl);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      setEditedAdminData(prevState => ({
        ...prevState,
        imageUrl: downloadURL
      }));
      setProfileImageUrl(downloadURL);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Error uploading image. Please try again.'); // Inform user
    }
  };
  
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedAdminData({ ...editedAdminData, [name]: value });
  };
  

  // Update admin in firestore and firebase auth
  const handleUpdateAdmin = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'admins'));
      const adminDocRef = querySnapshot.docs.find(doc => doc.data().uid === editedAdminData.uid)?.ref;

      if (!adminDocRef) {
        console.error('Admin document not found');
        return;
      }

      // Update the email and password in Firebase auth
      if (editedAdminData.email !== adminData.email) {
        await updateEmail(auth.currentUser, editedAdminData.email);
      }
  
      if (editedAdminData.password) {
        await updatePassword(auth.currentUser, editedAdminData.password);
      }
  
      // Update the employee data in Firestore
      await setDoc(adminDocRef, editedAdminData);
      console.log('Admin data updated in Firestore');

      // Use the updated profileImageURL from editedEmployeeData
      setProfileImageUrl(editedAdminData.imageUrl);

    } catch (error) {
      console.error('Error updating admin:', error);
      throw error; 
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      if (
        !editedAdminData.first_name ||
        !editedAdminData.last_name ||
        !editedAdminData.email ||
        !editedAdminData.password ||
        !editedAdminData.governorate ||
        !editedAdminData.municipality 
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
 
     await handleUpdateAdmin();
 
     // Reset the form and show success message
     setEditedAdminData({ ...adminData });
     setSuccess('Admin data updated successfully');
     setError(null);
     
     setTimeout(() => {
       onClose();
       setSuccess(null);
     }, 3000);
   } catch (error) {
     console.error('Error updating admin:', error);
     setError('Error updating admin');
     setSuccess(null);
   }
 };
  
  useEffect(() => {
    if (editedAdminData.governorate) {
      fetchMunicipalities(editedAdminData.governorate);
    }
  }, [editedAdminData.governorate]);


  if (!isOpen) return null;

  return (
    <div className={`popup  ${isOpen ? 'popup-open' : ''}`}>
      {success && <SuccessAlert message={success} />}
      {error && <ErrorAlert message={error} />}
      <PopupHeader onClose={onClose} />

      <EditImageUploader imageUrl={profileImageUrl} handleImageUpload={handleImageUpload} />
      <AdminForm adminData={editedAdminData} handleInputChange={handleInputChange} governorates={governorates}
        municipalities={municipalities}/>
      <form className='mt-2' onSubmit={handleSubmit}>
        <div className="form-group">
          <button type="submit" className='addEmpl ml-auto'>Update</button>
        </div>
      </form>
    </div>
  );
};

export default EditAdminPopup;
