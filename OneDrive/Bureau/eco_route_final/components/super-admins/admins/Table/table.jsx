import React, { useEffect, useState } from 'react';
import { db } from '@/app/config/firebaseConfig.mjs';
import { collection, getDocs, onSnapshot, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { getMetadata } from 'firebase/storage';
import AdminTable from './adminsTable';
import AddAdminPopup from '@/components/common/popups/AddAdmin/AddAdmin';
import EditAdminPopup from '@/components/common/popups/EditAdmin/EditAdminPopup';
import DeleteConfirmationModal from '@/utils/deleteConfirmModal';
import Button from '@/components/common/buttons/Add';
import SuccessAlert from '@/utils/successAlert';
import FilterBar from './filter';

const Table = () => {
  const [admins, setAdmins] = useState([]); 
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteAdminData, setDeleteAdminData] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); 
  const [editAdminData, setEditAdminData] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [selectedOption, setSelectedOption] = useState('all');
  const [governorates, setGovernorates] = useState([]);

  // Fetch admins from Firestore on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'admins')); 
        const adminsData = querySnapshot.docs.map(doc => ({ uid: doc.id, docRef: doc.ref, ...doc.data() })); 
        setAdmins(adminsData); 
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };

    fetchData();
  
    const unsubscribe = onSnapshot(collection(db, 'admins'), (snapshot) => { 
      const changes = snapshot.docChanges();
      changes.forEach(change => {
        if (change.type === 'added' || change.type === 'modified') {
          fetchData();
        } else if (change.type === 'removed') {
          setAdmins(prevAdmins => prevAdmins.filter(admin => admin.uid !== change.doc.id)); 
        }
      });
    }); 
  
    return () => unsubscribe();
  }, []);
  

// Fetch profile image URL for a given admin  
const fetchProfileImageURL = async (adminUid) => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, `adminsPictures/${adminUid}`);
    const files = await listAll(storageRef);

    if (files && files.items && files.items.length > 0) {
      const downloadURL = await getDownloadURL(files.items[0]);
      return downloadURL;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching profile image URL for admin', adminUid, ':', error);
    return null;
  }
};

  

  const handleDeleteIconClick = (adminId) => {
    console.log("All admins:", admins);
    console.log("adminId",adminId);
    const adminToDelete = admins.find(admin => admin.uid === adminId); 
    console.log("Admin to delete:", adminToDelete);
    setDeleteAdminData(adminToDelete); 
    setIsDeleteModalOpen(true);
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
    console.log("Deleting admin:", deleteAdminData);
    await deleteDoc(deleteAdminData.docRef);
    console.log("Admin document deleted successfully");

    const storage = getStorage();
    const storageRef = ref(storage, `adminsPictures/${deleteAdminData.uid}`);

    // Check if the object exists before attempting to delete it
    try {
      await getMetadata(storageRef);
      await deleteObject(storageRef);
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 2000);
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        
        console.log("Object does not exist in storage");
        setShowSuccessAlert(true);
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 2000);
      } else {
        throw error;
      }
    }
    setAdmins(prevAdmins =>
      prevAdmins.filter(admin => admin.uid !== deleteAdminData.uid)
    );

    setIsDeleteModalOpen(false);
  } catch (error) {
    console.error('Error deleting admin:', error);
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

  const handleEditIconClick = (adminId) => {
    const adminToEdit = admins.find(admin => admin.uid === adminId);
    setEditAdminData(adminToEdit);
    setIsEditPopupOpen(true);
  };

  const filterData = (selectedValue) => {
    setSelectedOption(selectedValue);
  };

  const filteredAdmins = admins.filter(admin =>
    (selectedOption === 'all' || admin.governorate === selectedOption) 
  );
  
  


  return (
    <>
    <div className='mx-5'>
      <div className='tab-box'>
        <div className='mt-3 d-flex mb-3 justify-content-between align-items-center'>
          <h3 className='poppins fw600 f22 blackb2 pt-2 ml20'>All Admins</h3> 
          <div className="d-flex align-items-center">
          <FilterBar  filterData={filterData} governorates={governorates} />
             <Button text="Add" onClick={handleAddClick} />
          </div>
        </div>

        <AdminTable 
          admins={filteredAdmins} 
          handleDeleteIconClick={handleDeleteIconClick}
          handleEditIconClick={handleEditIconClick}
        />

        <AddAdminPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
        {isEditPopupOpen && editAdminData && (
          <EditAdminPopup 
            isOpen={isEditPopupOpen}
            onClose={handleCloseEditPopup}
            adminData={editAdminData} 
            fetchProfileImageURL={fetchProfileImageURL}
          />
        )}
        {isPopupOpen && <div className="overlay" onClick={handleClosePopup}></div>}
        {isEditPopupOpen && <div className="overlay" onClick={handleCloseEditPopup}></div>} 
        {isDeleteModalOpen && (
          <div className="modal-overlay">
            <DeleteConfirmationModal
              adminData={deleteAdminData} 
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
            />
            {showSuccessAlert && <SuccessAlert message="Admin deleted successfully!" />} 
          </div>
        )}
      </div>
    </div>
  </>
);
}
export default Table;
