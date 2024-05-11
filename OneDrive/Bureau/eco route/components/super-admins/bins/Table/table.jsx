import React, { useEffect, useState } from 'react';
import { db } from '@/app/config/firebaseConfig.mjs';
import { collection, getDocs, onSnapshot, deleteDoc,doc ,updateDoc} from 'firebase/firestore';
import DeleteConfirmationModal from '@/utils/deleteConfirmModal';
import AddBinPopup from '@/components/common/popups/AddBin/AddBin';
import EditBinPopup from '@/components/common/popups/EditBin/EditBinPopup';
import SuccessAlert from '@/utils/successAlert';
import BinTable from './BinTable';
import ButtonBin from '@/components/common/buttons/Addbin';
import FilterBar from './filter';

const Table = () => {
  const [bins, setBins] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteBinData, setDeleteBinData] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); 
  const [editBinData, setEditBinData] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); 
  const [selectedOption, setSelectedOption] = useState('all');
  const [governorates, setGovernorates] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
        try {
            // Fetch all bins
            const querySnapshot = await getDocs(collection(db, 'bins'));
            const binData = querySnapshot.docs.map(doc => ({ binId: doc.id, docRef: doc.ref, ...doc.data() }));
            setBins(binData);

            // Fetch data from external API
            const response = await fetch('https://ecoroute-4eeb1-default-rtdb.europe-west1.firebasedatabase.app/.json');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const { Data } = await response.json();
            const valueADXL345 = Data.ADXL345;
            const valueSR04 = Data.SR04;
            console.log("Fetched data:", Data);
            console.log("SR04 value:", valueSR04);
            console.log("ADXL345 value:", valueADXL345);

            // Limit the value to 0-85cm range
            const limitedValueSR04 = Math.min(Math.max(valueSR04, 0), 85);

            // Calculate the normalized value for SR04 (reversed)
            const reversedNormalizedValueSR04 = Math.round(((85 - limitedValueSR04) * 100) / 85);
            console.log("Reversed normalized value for SR04:", reversedNormalizedValueSR04);

            // Update the filling level of the specific bin in Firestore with SR04 value
            const binIdToUpdate = 'Xvgrt4T60TTkSXMjTBAt'; // Update with the correct bin ID
            const binRefToUpdate = doc(db, 'bins', binIdToUpdate);
            await updateDoc(binRefToUpdate, { filling_level: reversedNormalizedValueSR04 });

            console.log("Updated filling level for bin with ID", binIdToUpdate, "with SR04 value:", reversedNormalizedValueSR04);
            const stableIntervalX = [-1, 2];
            const stableIntervalY = [-2, 2];
            const stableIntervalZ = [10.71, 11.9];

            // Check if ADXL345 values fall within stable intervals
            const accelerationX = parseFloat(valueADXL345.X);
            const accelerationY = parseFloat(valueADXL345.Y);
            const accelerationZ = parseFloat(valueADXL345.Z);

            let tiltStatus = '';
            if (accelerationX >= stableIntervalX[0] && accelerationX <= stableIntervalX[1] &&
                accelerationY >= stableIntervalY[0] && accelerationY <= stableIntervalY[1] &&
                accelerationZ >= stableIntervalZ[0] && accelerationZ <= stableIntervalZ[1]) {
                tiltStatus = "stable";
                console.log("Stable bin");
            } else {
                tiltStatus = "fallen";
                console.log("Fallen bin");
            }
            // Update the tilt status directly
            await updateDoc(binRefToUpdate, { tilt_status: tiltStatus });

            console.log("Updated tilt status for bin with ID", binIdToUpdate, "with ADXL345 value:", tiltStatus);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(intervalId); // Clear the interval on component unmount
}, []);

  const handleDeleteIconClick = (binID) => {
    const binToDelete = bins.find(bin => bin.binId === binID);
    if (binToDelete) {
      setDeleteBinData(binToDelete);
      setIsDeleteModalOpen(true);
    } else {
      console.error("No bin found for deletion");
    }
  };


  useEffect(() => {
    const fetchGovernorates = async () => {
      try {
        const governoratesRef = collection(db, 'governorates');
        const snapshot = await getDocs(governoratesRef);
        const governoratesList = snapshot.docs.map(doc => doc.data().name);
        setGovernorates(governoratesList);
      } catch (error) {
        console.error('Error fetching governorates:', error);
      }
    };

    fetchGovernorates();
  }, []);

  
  const handleConfirmDelete = async () => {
    try {
      // Use document reference directly to delete the document
      await deleteDoc(deleteBinData.docRef);
      console.log("Bin document deleted successfully");
  
      // Remove the deleted bin from the state
      setBins(prevBins =>
        prevBins.filter(bin => bin.binId !== deleteBinData.binId)
      );
  
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 2000);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting bin:', error);
    }
  };
  
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleAddClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleCloseEditPopup = () => { 
    setIsEditPopupOpen(false);
  };

  const handleEditIconClick = (binID) => {
    const binToEdit = bins.find(bin => bin.binId === binID);
    setEditBinData(binToEdit);
    setIsEditPopupOpen(true);
  };

  const filterData = (selectedValue) => {
    setSelectedOption(selectedValue);
  };

  const filteredBins = bins.filter(bin =>
    (selectedOption === 'all' || bin.governorate === selectedOption) 
  );

  
 
return (
    <>
      <div className='mx-5'>
        <div className='tab-box'>
          <div className='mt-3 d-flex mb-3 justify-content-between align-items-center'>
            <h3 className='poppins fw600 f22 blackb2 pt-2 ml20'>All Bins</h3>
            <div className="d-flex align-items-center">
             <div style={{ marginRight: '10px' }}>
             <FilterBar  filterData={filterData} governorates={governorates} />
              </div>
              <ButtonBin text="Add" onClick={handleAddClick} />
            </div>
          </div>

          <BinTable 
          bins={filteredBins} 
          handleDeleteIconClick={handleDeleteIconClick} 
          handleEditIconClick={handleEditIconClick} />


          <AddBinPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
          {isEditPopupOpen && editBinData && (
            <EditBinPopup
              isOpen={isEditPopupOpen}
              onClose={handleCloseEditPopup}
              binData={editBinData}
            />
          )}
          {isPopupOpen && <div className="overlay" onClick={handleClosePopup}></div>}
          {isEditPopupOpen && <div className="overlay" onClick={handleCloseEditPopup}></div>} 
          {isDeleteModalOpen && (
            <div className="modal-overlay">
              <DeleteConfirmationModal
                binData={deleteBinData}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
              />
              {showSuccessAlert && <SuccessAlert message="Bin deleted successfully!" />} 
            </div>
          )}
        </div>
      </div>
    </>
  );

          };
export default Table;
