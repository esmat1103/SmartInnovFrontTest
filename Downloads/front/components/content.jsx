import React from 'react';

const Content = ({ children }) => {
  return (
    <div className="bg-content flex-grow pl-5 pr-5">
      {children}
    </div>
  );
};

export default Content;