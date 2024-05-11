import React, { useEffect, useState } from 'react';
import { updateDoc, doc, collection, getDocs,getDoc } from 'firebase/firestore';
import { GeoPoint } from 'firebase/firestore';
import { db } from '@/app/config/firebaseConfig.mjs';
import PopupHeader from '../popupHeader';
import ErrorAlert from '../../../../utils/errorAlert';
import SuccessAlert from '../../../../utils/successAlert';
import BinForm from '../AddBin/binForm';

const EditBinPopup = ({ isOpen, onClose, binData }) => {
  const [editedBinData, setEditedBinData] = useState({ ...binData });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [governorates, setGovernorates] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);

  useEffect(() => {
    setEditedBinData({ ...binData });
    fetchGovernorates();
  }, [binData]);

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

  // Fetch municipalities for a specific governorate
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedBinData({ ...editedBinData, [name]: value });
  };

 
 // Update bin
const handleUpdateBin = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'bins'));
    const binDoc = querySnapshot.docs.find(doc => doc.data().binId === editedBinData.binId);
    if (!binDoc) {
      console.error('Bin document not found');
      return;
    }

    // Create a new GeoPoint with updated latitude and longitude
    const newLocation = new GeoPoint(
      parseFloat(editedBinData.location.latitude),
      parseFloat(editedBinData.location.longitude)
    );
    console.log('New GeoPoint:', newLocation);

    // Update the bin document with the new location and other values
    await updateDoc(binDoc.ref, {
      location: newLocation,
      location_name: editedBinData.location_name,
      governorate: editedBinData.governorate,
      municipality: editedBinData.municipality,
      filling_level: editedBinData.filling_level,
      status: editedBinData.status,
      tilt_status:editedBinData.tilt_status
    });

    console.log('Bin data updated in Firestore');
  } catch (error) {
    console.error('Error updating bin:', error);
    setError(error.message || 'An error occurred while updating the bin. Please try again.');
  }
};


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (
        !editedBinData.governorate ||
        !editedBinData.municipality ||
        !editedBinData.location ||
        !editedBinData.location_name ||
        !editedBinData.filling_level ||
        !editedBinData.status ||
        !editedBinData.tilt_status
      ) {
        setError('Please fill in all the fields');
        return;
      }

      await handleUpdateBin();

      setSuccess('Bin data updated successfully');
      setError(null);

      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error updating bin:', error);
      setError(error.message || 'An error occurred while updating the bin. Please try again.');
    }
  };

  useEffect(() => {
    if (editedBinData.governorate) {
      fetchMunicipalities(editedBinData.governorate);
    }
  }, [editedBinData.governorate]);

  if (!isOpen) return null;

  return (
    <div className={`popup  ${isOpen ? 'popup-open' : ''}`}>
      {success && <SuccessAlert message={success} />}
      {error && <ErrorAlert message={error} />}
      <PopupHeader onClose={onClose} />
      <BinForm
        binData={editedBinData}
        handleInputChange={handleInputChange}
        governorates={governorates}
        municipalities={municipalities}
      />
      <form className='mt-2' onSubmit={handleSubmit}>
        <div className="form-group">
          <button type="submit" className='addEmpl ml-auto'>Update</button>
        </div>
      </form>
    </div>
  );
};

export default EditBinPopup;
