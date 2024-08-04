import React from 'react';
import SidebarSA from './sidebarSA';
import Content from '../content';
import NavbarSA from './navbar';


const LayoutSuperAdmin = ({ children }) => {
    return (
        <div className="flex">
        <SidebarSA />
        <div className="flex flex-col flex-grow">
            <div className="flex flex-grow ">
                <Content >{children}</Content>
            </div>
            <NavbarSA />
        </div>
    </div>
);
  };
  
export default  LayoutSuperAdmin;
