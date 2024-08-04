import React, { useState } from 'react';
import DeleteConfirmation from '@components/Commun/Popups/Clients/DeleteConfirmationModal';
import Image from 'next/image';
import chevronOR from '../../../public/assets/Table/chevronO.svg';
import chevronBL from '../../../public/assets/Table/chevronV.svg';
import chevronLILAS from '../../../public/assets/Table/chevronL.svg';

const TableBody = ({ tableData, handleDelete, handleEdit, selectedRows, handleCheckboxChange }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const confirmDelete = () => {
    setShowDeleteConfirmation(false);
    handleDelete(deleteItem);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <>
      <tbody>
        {tableData.map((row) => (
          <tr key={row.id} className="table-row-box">
            <td>
              <input 
                type="checkbox" 
                className="custom-checkbox" 
                checked={selectedRows.includes(row.id)}
                onChange={() => handleCheckboxChange(row.id)}
              />
            </td>
            <td className="f11 nunito centered-cell">
              <div className='box-cell'>{row.id}</div>
            </td>
            <td className="f11 nunito fw600">{row.clientName}</td>
            <td className="f11 nunito">{row.complaintDetails}</td>
            <td className="f11 nunito centered-cell"> 
              <div className={`box-cell f12 ${row.status === 'Resolved' ? 'box-cellE' : row.status === 'In Progress' ? 'box-cellD' : 'box-cellH'}`}>
                <div className='flex'>
                  {row.status}
                  {row.status === 'Open' && <span className='pl-1'><Image src={chevronLILAS} alt="chevron" width={15} height={15} /></span>}
                  {row.status === 'Resolved' && <span className='pl-1'><Image src={chevronBL} alt="chevron" width={15} height={15} /></span>}
                  {row.status === 'In Progress' && <span className='pl-1'><Image src={chevronOR} alt="chevron" width={15} height={15} /></span>}
                </div>
              </div>
            </td>
            <td className="f11 nunito">{row.actionDue}</td>
            <td className="f11 nunito">{row.dateTime}</td>
            <td className="f11 nunito centered-cell"><div className='box-cell'>{row.sensorId}</div></td>
            <td className="f11 nunito">{row.sensorType}</td>
            <td className="f11 nunito">
              <div className={`box-cell f12 ${row.sensorStatus === 'Active' ? 'box-cellE' : 'box-cellH'}`}>
                {row.sensorStatus}
              </div>
            </td>
            <td className="f11 nunito centered-cell">
              <div className={`box-cell f12 ${row.sensorUrgency === 'Low' ? 'box-cellE' : row.sensorUrgency === 'Medium' ? 'box-cellD' : 'box-cellH'}`}>
                {row.sensorUrgency}
              </div>
            </td>
            <td className="f11 nunito centered-cell"><div className='box-cell'>{row.lastRecordedData}</div></td>
            <td className="f11 nunito">{row.lastCommunication}</td>
          </tr>
        ))}
      </tbody>
      {showDeleteConfirmation && (
        <DeleteConfirmation 
          item={deleteItem} 
          onConfirmDelete={confirmDelete} 
          onCancelDelete={cancelDelete} 
        />
      )}
    </>
  );
};

export default TableBody;
