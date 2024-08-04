import React from 'react';
import Image from 'next/image';
import successIcon from '/public/assets/success.svg';

const SuccessAlert = ({ message }) => {
  return (
    <div className="p-3 mb-3 success flex items-center nunito" role="alert">
      <Image src={successIcon} alt="Error Icon" className="mr-2" height={20}/>
      <span className="font-bold"></span> {message}
    </div>
  );
};

export default SuccessAlert;