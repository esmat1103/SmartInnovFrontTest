import React, { useState } from 'react';
import Image from 'next/image';
import export1 from '../../../public/assets/Table/export.svg';
import edit from '../../../public/assets/Table/edit.svg';
import clear from '../../../public/assets/Table/delete.svg';
import DeleteConfirmation from '@components/Commun/Popups/Sensors/DeleteConfirmationModal';
import EditType from '../Popups/Sensors/editType';
import { deleteSensorTypeById } from '@app/utils/apis/sensorTypes';

const TableBodyT = ({ tableData, selectedRows, handleCheckboxChange }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [editSensorTypeData, setEditSensorTypeData] = useState(null);

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleEditClick = (_id) => {
    const sensorTypeToEdit = tableData.find((item) => item._id === _id);
    const sensorTypeDataWithId = { ...sensorTypeToEdit, id: sensorTypeToEdit._id };
    setEditSensorTypeData(sensorTypeDataWithId);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setEditSensorTypeData(null);
  };

  const handleDelete = (_id) => {
    setShowDeleteConfirmation(true);
    setDeleteItem(_id);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSensorTypeById(deleteItem);
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error(error.message); 
    }
  };

  const handleExportClick = () => {
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
            <td><div className="box-cell f12 center">{row.sensorReference}</div></td>
            <td className='pl23 center'>{row.sensorName}</td>
            <td className='pl23 center'><div className="box-cell f12 center">{row.unit}</div></td>
            <td className='pl23 center'>{row.rangeMin}</td>
            <td className='center'>{row.rangeMax}</td>
            <td className='pl23 center'>
              <div className={`box-cell f12 ${row.pulse === 'Yes' ? 'box-cellE' : 'box-cellD'}`}>{row.pulse}</div>
            </td>
            <td className='pl23 center'>{row.coefficient}</td>
            <td className='text-center pl23'>
              <div className="flex justify-center">
                <button onClick={() => handleEditClick(row._id)}>
                  <Image src={edit} alt='edit' width={20} height={20} />
                </button>
                <button onClick={() => handleExportClick()}>
                  <Image src={export1} alt='export' width={20} height={20} />
                </button>
                <button onClick={() => handleDelete(row._id)}>
                  <Image src={clear} alt='delete' width={20} height={20} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      {isPopupVisible && (
        <>
        <EditType
          initialSensorTypeData={editSensorTypeData}
          isOpen={isPopupVisible}
          onClose={closePopup}
        />
         <div className="table-overlay"></div>
        </>
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

export default TableBodyT;
