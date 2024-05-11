import React, { useEffect, useState } from 'react';
import { db } from '../../../../app/config/firebaseConfig.mjs';
import { collection, getDocs, onSnapshot, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import EmployeeTable from './EmployeeTable';
import AddEmployeePopup from '../../../common/popups/AddEmployee/AddEmployee';
import DeleteConfirmationModal from '../../../../utils/deleteConfirmModal';
import EditEmployeePopup from '@/components/common/popups/EditEmployee/EditEmployeePopup';
import Button from '@/components/common/buttons/Add';
import SuccessAlert from '@/utils/successAlert';
import FilterBar from './filter';

const Table = () => {
  const [employees, setEmployees] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteEmployeeData, setDeleteEmployeeData] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); 
  const [editEmployeeData, setEditEmployeeData] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [selectedOption, setSelectedOption] = useState('all');
  const [governorates, setGovernorates] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'employees'));
        const employeesData = querySnapshot.docs.map(doc => ({ uid: doc.id, docRef: doc.ref, ...doc.data() }));
        const employeeUids = employeesData.map(employee => employee.uid);
        const fetchImageURLs = await Promise.all(employeeUids.map(fetchProfileImageURL));
        const employeesWithImageURLs = employeesData.map((employee, index) => ({
          ...employee,
          imageUrl: fetchImageURLs[index] || ''
        }));
        setEmployees(employeesWithImageURLs);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    
    fetchData();
  
    const unsubscribe = onSnapshot(collection(db, 'employees'), (snapshot) => {
      const changes = snapshot.docChanges();
      changes.forEach(change => {
        if (change.type === 'added' || change.type === 'modified') {
          fetchData();
        } else if (change.type === 'removed') {
          setEmployees(prevEmployees => prevEmployees.filter(employee => employee.uid !== change.doc.id));
        }
      });
    });
  
    return () => unsubscribe();
  }, []);
  
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

  const filterData = (selectedValue) => {
    setSelectedOption(selectedValue);
  };

  const filteredEmployees = employees.filter(employee =>
    (selectedOption === 'all' || employee.governorate === selectedOption) 
  );
  

  return (
    <>
      <div className='mx-5'>
        <div className='tab-box'>
          <div className='mt-3 d-flex mb-3 justify-content-between align-items-center'>
            <h3 className='poppins fw600 f22 blackb2 pt-2 ml20'>All Employees</h3>
            <div className="d-flex align-items-center">
            <FilterBar  filterData={filterData} governorates={governorates} />
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
