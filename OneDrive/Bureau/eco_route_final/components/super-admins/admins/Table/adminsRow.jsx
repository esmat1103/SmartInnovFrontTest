import React from 'react';
import ProfileImage from '@/components/common/PImage';
import Actions from '@/components/common/actions';


const AdminsRow = ({ admin, handleDeleteIconClick ,handleEditIconClick}) => {

  return (
    <tr className='blackb fw500 f14 poppins'>
      <td className='flex center'>
        <ProfileImage  imageUrl={admin.imageUrl} />
      </td>
      <td>{admin.first_name}</td>
      <td>{admin.last_name}</td>
      <td>{admin.email}</td>
      <td>{admin.governorate}</td>
      <td>{admin.municipality}</td>
      <td>
        <Actions
          id={admin.uid}
          handleDeleteIconClick={handleDeleteIconClick}
          handleEditIconClick={handleEditIconClick}
          
         />
      </td>
    </tr>
  );
};

export default AdminsRow;
