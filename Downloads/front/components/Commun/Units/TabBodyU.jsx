import React, { useState } from 'react';
import Image from 'next/image';
import edit from '../../../public/assets/Table/edit.svg';
import clear from '../../../public/assets/Table/delete.svg';
import DeleteConfirmation from '@components/Commun/Popups/Sensors/DeleteConfirmationModal';
import EditUnit from '@components/Commun/Popups/Units/editUnit';
import { deleteUnitById } from '@app/utils/apis/units'; 

const TableBodyU = ({ tableData, selectedRows, handleCheckboxChange, handleDelete, handleEdit }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [editUnitData, setEditUnitData] = useState(null);

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleEditClick = (_id) => {
    const unitToEdit = tableData.find((item) => item._id === _id);
    const unitDataWithId = { ...unitToEdit, id: unitToEdit._id };
    setEditUnitData(unitDataWithId);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setEditUnitData(null);
  };

  const handleDeleteClick = (_id) => {
    setDeleteItem(_id);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUnitById(deleteItem); 
      handleDelete(deleteItem); 
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error('Error deleting unit:', error);
    }
  };

  return (
    <>
      <tbody className='darkgrey'>
        {tableData.map((row, index) => (
          <tr key={index} className="table-row-box nunito f12">
            <td>
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={selectedRows.includes(row._id)}
                onChange={() => handleCheckboxChange(row._id)}
              />
            </td>
            <td><div className="box-cell f12">{row.SensorType}</div></td>
            <td><div className="box-cell f12">{row.MeasuredParameter}</div></td>
            <td><div className="box-cell f12">{row.unitName}</div></td>
            <td><div className="box-cell f12">{row.Abbreviation}</div></td> 
            <td className='text-center pl23'>
              <div className="flex justify-end">
                <button onClick={() => handleEditClick(row._id)}>
                  <Image src={edit} alt='edit' width={20} height={20} />
                </button>
                <button onClick={() => handleDeleteClick(row._id)}>
                  <Image src={clear} alt='delete' width={20} height={20} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      {isPopupVisible && (
        <EditUnit
          initialUnitData={editUnitData}
          isOpen={isPopupVisible}
          onClose={closePopup}
          onEdit={handleEdit} 
        />
      )}
      {showDeleteConfirmation && (
        <DeleteConfirmation
          item={deleteItem}
          onConfirmDelete={handleConfirmDelete}
          onCancelDelete={cancelDelete}
        />
      )}
    </>
  );
};

export default TableBodyU;
