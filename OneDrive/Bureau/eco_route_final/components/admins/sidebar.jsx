import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '@/app/config/firebaseConfig.mjs';
import vector1 from '@/public/sidebar_icons/dash.svg';
import chevron1 from '@/public/sidebar_icons/chevron.svg';
import logout from '@/public/sidebar_icons/logout.png';
import employees from '@/public/sidebar_icons/employees.svg';
import bin from '@/public/sidebar_icons/bin.svg'; 
import monitor from '@/public/sidebar_icons/dashboard.svg';
import employeesWhite from '@/public/sidebar_icons/employeesW.svg';
import binWhite from '@/public/sidebar_icons/binW.svg'; 
import dashboardW from '@/public/sidebar_icons/dashboardW.svg';

const Sidebar = () => {
    const router = useRouter();
    const [activePath, setActivePath] = useState('');
    

    useEffect(() => {
        setActivePath(router.pathname);
    }, [router.pathname]);
    const handleLogout = async () => {
        try {
            await auth.signOut(); 
            sessionStorage.removeItem('userId');
            sessionStorage.removeItem('role');
            router.push('/'); 
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };
    

    return (
        <>
            <div className="sidebar poppins">
                <div className='flex mt-5 mb-5' >
                    <Image src={vector1} alt="icon" className='h37 w37 mx-2'/>
                    <h2 className='poppins f26 teal mt-1 fw600'>Dashboard</h2>
                </div>
                <nav className="mt-10 mx-3  ">
                    <ul className=' poppins '>
                        <li className={`mb-3 ${activePath === '/admins/dashboard' ? 'active' : ''}`}>
                            <Link href="/admins/dashboard" className="items-center flex ">
                              <Image src={activePath === '/admins/dashboard' ? dashboardW : monitor} alt='monitor' width={23}  className='hauto ml-4' id="monitor-icon" />
                                <p className="f14 fw500 mt1 ml4">Dashboard</p>
                              <Image src={chevron1} alt='chevron' width={20}  className='icon hauto ml-auto'/>
                            </Link>
                        </li>
                        <li className={`mb-3 ${activePath === '/admins/bins' ? 'active' : ''}`}>
                            <Link href="/admins/bins" className="flex items-center">
                            <Image src={activePath === '/admins/bins' ? binWhite : bin} alt='bin' width={20}  id="bin-icon" className='mr-4 hauto'/>
                                <p className="f14 fw500 ml4 ">Bins</p>
                                <Image src={chevron1} alt='chevron'  width={20}  className=' hauto icon ml-auto'/>
                            </Link>
                        </li>
                        <li className={`mb-3 ${activePath === '/admins/employees' ? 'active' : ''}`}>
                            <Link href="/admins/employees" className="flex items-center">
                               <Image src={activePath === '/admins/workers' ? employeesWhite : employees} alt='employees' width={20}  className='hauto' id="employee-icon" />
                                <p className="f14 fw500 ml4 ">Employees</p>
                                <Image src={chevron1} className='icon ml-auto hauto'  width={20}   alt='chevron'/>
                            </Link>
                        </li>
                        
                    </ul>
                </nav>
            </div>
            <div className="logout-icon" onClick={handleLogout}>
                <Image src={logout} alt="logout" width={20} height={20}/>
                <h3 className='ml-1 poppins'>Logout</h3>
            </div>
        </>
    );
};

export default Sidebar;
