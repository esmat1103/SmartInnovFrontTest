import Image from 'next/image';
import React from 'react';
import clear from '../../../public/assets/Table/delete.svg';
import edit from '../../../public/assets/Table/edit.svg';

const TableBody = ({ tableData, handleDelete, handleEdit, selectedRows, handleCheckboxChange }) => {
  return (
    <tbody className='darkgrey'>
      {tableData.map((row) => (
        <tr 
          key={row.id} 
          className="table-row-box f14 nunito" 
        >
          <td>
            <input 
              type="checkbox" 
              className="custom-checkbox" 
              checked={selectedRows.includes(row.id)} 
              onChange={() => handleCheckboxChange(row.id)} 
            />
          </td>
          <td className="centered-cell"><div className="box-cell f12">{row.id}</div></td>
          <td className="flex items-center ">
            <div className='profile-container'>
            <Image src={row.imageUrl} alt={`${row.firstName} ${row.lastName}`}  className="mr-2" id='profile-pic' />
            </div>
            <span>{row.firstName} {row.lastName}</span>
          </td>
          <td>{row.email}</td>
          <td className="centered-cell"><div className="box-cell">{row.phoneNumber}</div></td>
          <td className="centered-cell"><div className="box-cell ">{row.createdAt}</div></td>
          <td className="text-center">
            <div className="flex justify-center ">
              <button onClick={() => handleEdit(row.id)}>
                <Image src={edit} alt='edit' width={20} height={20} />
              </button>
              <button onClick={() => handleDelete(row.id)}>
                <Image src={clear} alt='delete' width={20} height={20} />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;