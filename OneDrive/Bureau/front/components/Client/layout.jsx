import React from 'react';
import SidebarC from './sidebarC';
import Content from '../content';
import Navbar from '@components/Commun/navbar';


const LayoutClient = ({ children }) => {
    return (
        <div className="flex">
        <SidebarC />
        <div className="flex flex-col flex-grow">
            <div className="flex flex-grow ">
                <Content >{children}</Content>
            </div>
            <Navbar />
        </div>
    </div>
);
  };
  
export default LayoutClient;
