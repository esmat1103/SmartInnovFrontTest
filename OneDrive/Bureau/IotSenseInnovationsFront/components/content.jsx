import React from 'react';

const Content = ({ children }) => {
  return (
    <div className="bg-content flex-grow p-5">
      {children}
    </div>
  );
};

export default Content;