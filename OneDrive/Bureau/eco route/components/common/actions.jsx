import React from 'react';
import Image from 'next/image';
import edit from '@/public/main_content/edit.svg';
import suppr from '@/public/main_content/delete.svg';


const Actions = ({ id, handleDeleteIconClick, handleEditIconClick }) => {
  return (
    <>
      <div>
        <button className='blackb fw500 f14 poppins mx-1' onClick={() => handleEditIconClick(id)}>
          <Image src={edit} width={18} alt='edit' className='hauto' />
        </button>
        <button className='blackb fw500 f14 poppins' onClick={() => handleDeleteIconClick(id)}>
          <Image src={suppr} width={18} alt='delete' className='hauto' />
        </button>
      </div>
    </>
  );
};

export default Actions;

