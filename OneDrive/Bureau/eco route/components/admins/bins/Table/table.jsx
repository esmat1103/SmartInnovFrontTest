import React, { useEffect, useState } from 'react';
import { auth, db } from '@/app/config/firebaseConfig.mjs';
import { collection, getDocs, onSnapshot, deleteDoc, doc, getDoc, query, where } from 'firebase/firestore';
import DeleteConfirmationModal from '@/utils/deleteConfirmModal';
import AddBinPopup from '@/components/common/popups/AddBin/AddBin';
import EditBinPopup from '@/components/common/popups/EditBin/EditBinPopup';
import SearchBar from './search';
import SuccessAlert from '@/utils/successAlert';
import BinTable from './BinTable';
import ButtonBin from '@/components/common/buttons/Addbin';

const Table = () => {
  const [bins, setBins] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteBinData, setDeleteBinData] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editBinData, setEditBinData] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
 

  useEffect(() => {
    const getDocumentIdByUid = async (collectionName, uid) => {
      const collectionRef = collection(db, collectionName);
      const querySnapshot = await getDocs(query(collectionRef, where('uid', '==', uid)));

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id;
      } else {
        return null;
      }
    };

    const fetchData = async () => {
      try {
        const uid = auth.currentUser.uid;
        console.log('UID:', uid);
        const documentId = await getDocumentIdByUid('admins', uid);
        console.log('Document ID:', documentId);

        const adminRef = doc(db, 'admins', documentId);
        const adminSnapshot = await getDoc(adminRef);
        console.log('Admin data:', adminSnapshot.data());

        if (adminSnapshot.exists() && adminSnapshot.data().municipality) {
          const municipality = adminSnapshot.data().municipality;
          const binsQuery = query(collection(db, 'bins'), where('municipality', '==', municipality));
          const querySnapshot = await getDocs(binsQuery);
          const binData = querySnapshot.docs.map(doc => ({ binId: doc.id, docRef: doc.ref, ...doc.data() }));

          const sortedBins = binData.sort((a, b) => b.filling_level - a.filling_level);
          setBins(sortedBins);
        } else {
          console.error('Document does not exist or missing municipality field for user:', uid);
        }
      } catch (error) {
        console.error('Error fetching bins:', error);
      }
    };

    fetchData();

    const unsubscribe = onSnapshot(collection(db, 'bins'), (snapshot) => {
      const changes = snapshot.docChanges();
      changes.forEach(change => {
        if (change.type === 'added' || change.type === 'modified') {
          fetchData();
        } else if (change.type === 'removed') {
          setBins(prevBins => prevBins.filter(bin => bin.binId !== change.doc.id));
        }
      });
    });

    return () => unsubscribe();
  }, [searchTerm]);

  

  const handleDeleteIconClick = (binID) => {
    const binToDelete = bins.find(bin => bin.binId === binID);
    if (binToDelete) {
      setDeleteBinData(binToDelete);
      setIsDeleteModalOpen(true);
    } else {
      console.error("No bin found for deletion");
    }
  };

  const handleConfirmDelete = async () => {
    try {
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

  const filteredBins = bins.filter(bin =>
    (searchTerm === '' ||
      bin.filling_level === parseInt(searchTerm) ||
      bin.location.longitude === parseFloat(searchTerm) ||
      bin.location.latitude === parseFloat(searchTerm) ||
      (bin.location_name && bin.location_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (bin.status && bin.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (bin.tilt_status && bin.tilt_status.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  
  
  


  return (
    <>
      <div className='mx-5'>
        <div className='tab-box'>
          <div className='mt-3 d-flex mb-3 justify-content-between align-items-center'>
            <h3 className='poppins fw600 f22 blackb2 pt-2 ml20'>All Bins</h3>
            <div className="d-flex align-items-center">
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              <ButtonBin text="Add" onClick={handleAddClick} />
            </div>
          </div>

          <BinTable
            bins={filteredBins}
            handleDeleteIconClick={handleDeleteIconClick}
            handleEditIconClick={handleEditIconClick}
          />

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
