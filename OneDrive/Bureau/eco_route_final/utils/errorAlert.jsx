import React from 'react';

const ErrorAlert = ({ message }) => {
  return (
    
    <div className="p-3 mb-3 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
           <span className="font-bold">Error! </span> {message}
    </div>)
};

export default ErrorAlert;