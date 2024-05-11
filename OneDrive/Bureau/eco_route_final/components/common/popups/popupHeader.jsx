// PopupHeader.jsx
import React from 'react';
import Image from 'next/image';
import close from '@/public/main_content/arrow1.svg';

const PopupHeader = ({ onClose }) => {
  return (
    <div className='flex'>
      <button onClick={onClose}>
        <Image src={close} alt="close" className='hauto' width={30} />
      </button>
    </div>
  );
};

export default PopupHeader;
