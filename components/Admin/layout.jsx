import React from 'react';
import SidebarA from './sidebarA';
import Content from '../content';

const LayoutAdmin = ({ children }) => {
    return (
        <div className="flex">
        <SidebarA />
        <div className="flex flex-col flex-grow">
            <div className="flex flex-grow ">
                <Content >{children}</Content>
            </div>
        </div>
    </div>
);
};
  
export default LayoutAdmin;
