import React from 'react';
import Image from 'next/image';
import clear from '../../../public/assets/Table/delete.svg';

const DeleteAllButton = ({ onClick, hovered, onMouseEnter, onMouseLeave, imageSrc, altText, buttonText }) => {
  return (
    <button onClick={onClick} className="delete-button flex" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Image src={hovered ? imageSrc : clear} alt={altText} width={20} height={20} />
      <p className='mt2 mx-1'>{buttonText}</p>
    </button>
  );
};

export default DeleteAllButton;
