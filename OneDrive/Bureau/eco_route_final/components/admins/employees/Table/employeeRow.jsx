import React from 'react';
import Actions from '@/components/common/actions';
import ProfileImage from '@/components/common/PImage';

const EmployeeRow = ({ employee, handleDeleteIconClick ,handleEditIconClick}) => {
  return (
    <tr className='blackb fw500 f14 poppins'>
      <td className='flex'>
        <ProfileImage imageUrl={employee.imageUrl} />
      </td>
      <td>{employee.first_name}</td>
      <td>{employee.last_name}</td>
      <td>{employee.email}</td>
      <td>{employee.phone_number}</td>
      <td className='text-center'>{employee.years_of_experience}</td>
      <td>{employee.governorate}</td>
      <td>{employee.municipality}</td>
      <td>
        <Actions
          id={employee.uid} 
          handleDeleteIconClick={handleDeleteIconClick}
          handleEditIconClick={handleEditIconClick}
         />
      </td>
    </tr>
  );
};

export default EmployeeRow;
