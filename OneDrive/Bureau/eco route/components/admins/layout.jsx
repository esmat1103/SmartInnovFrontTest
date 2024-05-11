import React from 'react';
import Sidebar from './sidebar';
import Content from '../content';

const Layoutadmin = ({ children }) => {
    return (
        <div className="layout flex h-screen">
            <Sidebar />
            <Content>{children}</Content>
        </div>
    );
};

export default Layoutadmin;
