import React from 'react';
import Image from 'next/image';
import errorIcon from '/public/assets/alert.svg';

const ErrorAlert = ({ message }) => {
  return (
    <div className="p-3 mb-3 error flex items-center nunito" role="alert">
      <Image src={errorIcon} alt="Error Icon" className="mr-2" height={20}/>
      <span className="font-bold mx-2">Error: </span> {message}
    </div>
  );
};

export default ErrorAlert;
