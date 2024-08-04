import React from 'react';

const SubmitButton = ({ children, onClick }) => {
  return (
    <button type="submit" className="submit-button" onClick={onClick}>
      {children}
    </button>
  );
};

export default SubmitButton;
