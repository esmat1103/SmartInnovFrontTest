import React, { useEffect, useState } from 'react';
import { db ,auth} from '../../../../app/config/firebaseConfig.mjs';
import { collection, getDocs, doc, onSnapshot, deleteDoc ,query,where,getDoc} from 'firebase/firestore';
import { getStorage, ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import EmployeeTable from './EmployeeTable';
import AddEmployeePopup from '../../../common/popups/AddEmployee/AddEmployee';
import DeleteConfirmationModal from '../../../../utils/deleteConfirmModal';
import EditEmployeePopup from '@/components/common/popups/EditEmployee/EditEmployeePopup';
import Button from '@/components/common/buttons/Add';
import SuccessAlert from '@/utils/successAlert';
import SearchBar from './search';

const Table = () => {
  const [employees, setEmployees] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteEmployeeData, setDeleteEmployeeData] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); 
  const [editEmployeeData, setEditEmployeeData] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

 // fetch initial data and set up real-time updates
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
  
              if (!documentId) {
                  console.error('Document does not exist for user:', uid);
                  return;
              }
  
              const adminRef = doc(db, 'admins', documentId);
              const adminSnapshot = await getDoc(adminRef);
              console.log('Admin data:', adminSnapshot.data());
  
              const municipality = adminSnapshot.data().municipality;
  
              // Fetch workers
              const workersQuery = query(collection(db, 'employees'), where('municipality', '==', municipality));
              const workersSnapshot = await getDocs(workersQuery);
              const workersData = workersSnapshot.docs.map(doc => ({ uid: doc.id, docRef: doc.ref, ...doc.data() }));
              const fetchImageURLs = await Promise.all(workersData.map(worker => fetchProfileImageURL(worker.uid)));
              const workersWithImageURLs = workersData.map((worker, index) => ({
                  ...worker,
                  imageUrl: fetchImageURLs[index] || ''
              }));
              setEmployees(workersWithImageURLs);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };
  
      fetchData();
  
      const unsubscribe = onSnapshot(collection(db, 'employees'), (snapshot) => {
          const changes = snapshot.docChanges();
          changes.forEach(change => {
              if (change.type === 'added' || change.type === 'modified') {
                  fetchData();
              } else if (change.type === 'removed') {
                  setEmployees(prevWorkers => prevWorkers.filter(worker => worker.uid !== change.doc.id));
              }
          });
      });

      return () => {
        unsubscribe();
      };
  }, []);
  

// fetch profile image Url
  const fetchProfileImageURL = async (employeeUid) => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `employeesPictures/${employeeUid}/`);
      const files = await listAll(storageRef);
      if (files.items.length > 0) {
        const downloadURL = await getDownloadURL(files.items[0]);
        return downloadURL;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching profile image URL for worker', employeeUid, ':', error);
      return null;
    }
  };


  const handleDeleteIconClick = (employeeId) => {
    console.log("All employees:", employees); 
    const employeeToDelete = employees.find(employee => employee.uid === employeeId);
    console.log("Employee to delete:", employeeToDelete); 
    setDeleteEmployeeData(employeeToDelete);
    setIsDeleteModalOpen(true);
  };
    
 
  const handleConfirmDelete = async () => {
    try {
      console.log("Deleting employee:", deleteEmployeeData); 
  
      // Use document reference directly to delete the document
      await deleteDoc(deleteEmployeeData.docRef);
  
      console.log("Employee document deleted successfully"); 
  
      // Remove the deleted employee from the state
      setEmployees(prevEmployees =>
        prevEmployees.filter(employee => employee.uid !== deleteEmployeeData.uid)
      );
  
      // Delete associated image from storage
      const storage = getStorage();
      const storageRef = ref(storage, deleteEmployeeData.imageUrl);
      await deleteObject(storageRef);
  
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 2000);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting employee:', error);
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

  const handleEditIconClick = (employeeId) => {
    const employeeToEdit = employees.find(employee => employee.uid === employeeId);
    setEditEmployeeData(employeeToEdit);
    setIsEditPopupOpen(true);
  };

  const filteredEmployees = employees.filter(employee =>
    (searchTerm === '' ||
    employee.years_of_experience === parseInt(searchTerm) ||
    (employee.phone_number && employee.phone_number.toString().includes(searchTerm.toLowerCase())) ||
      (employee.municipality && employee.municipality.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (employee.first_name && employee.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  
  

  return (
    <>
      <div className='mx-5'>
        <div className='tab-box'>
          <div className='mt-3 d-flex mb-3 justify-content-between align-items-center'>
            <h3 className='poppins fw600 f22 blackb2 pt-2 ml20'>All Employees</h3>
            <div className="d-flex align-items-center">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              <Button text="Add" onClick={handleAddClick} />
            </div>
          </div>

          <EmployeeTable
            employees={filteredEmployees}
            handleDeleteIconClick={handleDeleteIconClick}
            handleEditIconClick={handleEditIconClick}
          />

          <AddEmployeePopup isOpen={isPopupOpen} onClose={handleClosePopup} />
          {isEditPopupOpen && editEmployeeData && (
            <EditEmployeePopup
              isOpen={isEditPopupOpen}
              onClose={handleCloseEditPopup}
              employeeData={editEmployeeData}
              fetchProfileImageURL={fetchProfileImageURL}
            />
          )}
          {isPopupOpen && <div className="overlay" onClick={handleClosePopup}></div>}
          {isEditPopupOpen && <div className="overlay" onClick={handleCloseEditPopup}></div>} 
          {isDeleteModalOpen && (
            <div className="modal-overlay">
              <DeleteConfirmationModal
                employeeData={deleteEmployeeData}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
              />
              {showSuccessAlert && <SuccessAlert message="Employee deleted successfully!" />} 
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Table;
