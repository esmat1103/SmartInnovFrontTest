import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import dashboardW from '/public/assets/Sidebar/dashboard-white.svg';
import dashboardG from '/public/assets/Sidebar/dashboard-grey.svg';
import siteW from '/public/assets/Sidebar/device-w.svg';
import siteG from '/public/assets/Sidebar/device-g.svg';
import sensorW from '/public/assets/Sidebar/sensor-w.svg';
import sensorG from '/public/assets/Sidebar/sensor-g.svg';
import logout from '/public/assets/Sidebar/logout.svg';
import msgW from '/public/assets/Sidebar/msg-w.svg';
import msgG from '/public/assets/Sidebar/msg-g.svg';



const Sidebar = () => {
    const router = useRouter();
    const [activePath, setActivePath] = useState('');
    const [hovered, setHovered] = useState('');


    useEffect(() => {
        setActivePath(router.pathname);
    }, [router.pathname]);

    return (
        <>
        <div className="sidebar nunito">
            <div className='flex mt-5 mb-5'>
            <h2 className='nunito f30 fw500 mt-3 ml-4'>Dashboard</h2>
            </div>
            <nav className="mt-10 mx-3">
                <ul className="nunito">
                    <li className={`mb-3 ${activePath === '/Client/home' ? 'active' : ''}`} onMouseEnter={() => setHovered('/Client/home')} onMouseLeave={() => setHovered('')}>
                        <Link href="/Client/home" className="items-center flex">
                            <Image src={activePath === '/Client/home' || hovered === '/Client/home' ? dashboardW : dashboardG} alt='dashboard' width={18} id="dashboard-icon" className='ml-4' />
                            <p className="f14 fw200 ml-2">Dashboard</p>
                        </Link>
                    </li>
                </ul>
                <ul className="nunito">
                    <li className={`mb-3 ${activePath === '/Client/devices' ? 'active' : ''}`} onMouseEnter={() => setHovered('/Client/devices')} onMouseLeave={() => setHovered('')} >
                        <Link href="/Client/devices" className="items-center flex">
                            <Image src={activePath === '/Client/devices' || hovered === '/Client/devices' ? siteW : siteG} alt='device' width={18} id="device-icon" className='ml-4' />
                            <p className="f14 fw200 ml-2">Sites</p>
                        </Link>
                    </li>
                </ul>
                <ul className="nunito">
                    <li className={`mb-3 ${activePath === '/Client/sensors' ? 'active' : ''}`} onMouseEnter={() => setHovered('/Client/sensors')} onMouseLeave={() => setHovered('')} >
                        <Link href="/Client/sensors" className="items-center flex">
                            <Image src={activePath === '/Client/sensors' || hovered === '/Client/sensors' ? sensorW : sensorG} alt='sensor' width={18} id="sensor-icon" className='ml-4'/>
                            <p className="f14 fw200 ml-2">Sensors</p>
                        </Link>
                    </li>
                </ul>
                <ul className="nunito">
                    <li className={`mb-3 ${activePath === '/Client/complaints' ? 'active' : ''}`} onMouseEnter={() => setHovered('/Client/complaints')} onMouseLeave={() => setHovered('')} >
                        <Link href="/Client/complaints" className="items-center flex">
                            <Image src={activePath === '/Client/complaints' || hovered === '/Client/complaints' ? msgW : msgG} alt='complaints' width={18} id="complaints-icon" className='ml-4'/>
                            <p className="f14 fw200 ml-2">Complaints</p>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
         <div className="logout">
         <Link href="/logout" className="items-center flex">
         <Image src={logout} alt="logout" width={18} height={18} className='ml-4'/>
         <p className="f14 fw200 ml-2">Logout</p>
         </Link>
     </div>
     </>
    );
};

export default Sidebar;
