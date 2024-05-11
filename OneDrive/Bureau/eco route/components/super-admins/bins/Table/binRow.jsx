import React from 'react';
import Actions from '@/components/common/actions';
import CircularChart from '../circularChart';


const BinRow = ({ bin,handleDeleteIconClick ,handleEditIconClick}) => {
  return (
    <tr className='blackb fw500 f14 poppins'>
      <td>{bin.governorate}</td>
      <td>{bin.municipality}</td>
      <td>{bin.location.latitude}</td>
      <td>{bin.location.longitude}</td>
      <td>{bin.location_name}</td>
      <td className="filling-level-circle">
        <CircularChart percentage={bin.filling_level} />
      </td>
      <td className='text-center'>{bin.status}</td>
      <td className='text-center'>{bin.tilt_status}</td>
      <td>
        <Actions
          id={bin.binId} 
          handleDeleteIconClick={handleDeleteIconClick}
          handleEditIconClick={handleEditIconClick}
         />
      </td>
    </tr>
  );
};

export default BinRow;
