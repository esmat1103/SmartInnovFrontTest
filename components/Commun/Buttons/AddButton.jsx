import React from 'react';

const AddButton = ({ text, onClick }) => {
  return (
    <button className="add-button" onClick={onClick}>
      {text}
    </button>
  );
};

export default AddButton;
