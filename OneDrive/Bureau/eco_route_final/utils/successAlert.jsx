import React from 'react';

const SuccessAlert = ({ message }) => {
  return (
    <div className="p-3 mb-3 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
      <span className="font-bold">Success!</span> {message}
    </div>
  );
};

export default SuccessAlert;
