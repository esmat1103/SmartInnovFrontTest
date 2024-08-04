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
import teamW from '/public/assets/Sidebar/team-w.svg';
import teamG from '/public/assets/Sidebar/team-g.svg';
import settingsW from '/public/assets/Sidebar/settings-w.svg';
import settingsG from '/public/assets/Sidebar/settings-g.svg';
import ChevronIcon from '/public/assets/Sidebar/chevron-g.svg';
import pulseW from '/public/assets/Sidebar/pulse-w.svg';
import pulseG from '/public/assets/Sidebar/pulse-g.svg';
import msgW from '/public/assets/Sidebar/msg-w.svg';
import msgG from '/public/assets/Sidebar/msg-g.svg';
import logout from '/public/assets/Sidebar/logout.svg';




const Sidebar = () => {
    const router = useRouter();
    const [activePath, setActivePath] = useState('');
    const [hovered, setHovered] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);


    useEffect(() => {
        setActivePath(router.pathname);
    }, [router.pathname]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        if (activePath === '/Admin/pulses' || activePath === '/Admin/units') {
            setDropdownOpen(true);
        }
    }, [activePath]);

    return (
        <>
        <div className="sidebar nunito">
            <div className='flex'>
            <h2 className='nunito f30 fw500 mt-3 ml-4'></h2>
            </div>
            <nav className="mt-20 mx-3">
                <ul className="nunito">
                    <li className={`mb-3 ${activePath === '/Admin/home' ? 'active' : ''}`} onMouseEnter={() => setHovered('/Admin/home')} onMouseLeave={() => setHovered('')}>
                        <Link href="/Admin/home" className="items-center flex">
                            <Image src={activePath === '/Admin/home' || hovered === '/Admin/home' ? dashboardW : dashboardG} alt='dashboard' width={18} id="dashboard-icon" className='ml-4' />
                            <p className="f14 fw200 ml-2">Dashboard</p>
                        </Link>
                    </li>
                </ul>
                <ul className="nunito">
                    <li className={`mb-3 ${activePath === '/Admin/devices' ? 'active' : ''}`} onMouseEnter={() => setHovered('/Admin/devices')} onMouseLeave={() => setHovered('')} >
                        <Link href="/Admin/devices" className="items-center flex">
                            <Image src={activePath === '/Admin/devices' || hovered === '/Admin/devices' ? siteW : siteG} alt='device' width={18} id="device-icon" className='ml-4' />
                            <p className="f14 fw200 ml-2">Devices</p>
                        </Link>
                    </li>
                </ul>
                <ul className="nunito">
                    <li className={`mb-3 ${activePath === '/Admin/sensors' ? 'active' : ''}`} onMouseEnter={() => setHovered('/Admin/sensors')} onMouseLeave={() => setHovered('')} >
                        <Link href="/Admin/sensors" className="items-center flex">
                            <Image src={activePath === '/Admin/sensors' || hovered === '/Admin/sensors' ? sensorW : sensorG} alt='sensor' width={18} id="sensor-icon" className='ml-4'/>
                            <p className="f14 fw200 ml-2">Sensors</p>
                        </Link>
                    </li>
                </ul>
                <ul className="nunito">
                    <li className={`mb-3 ${activePath === '/Admin/clients' ? 'active' : ''}`} onMouseEnter={() => setHovered('/Admin/clients')} onMouseLeave={() => setHovered('')}>
                        <Link href="/Admin/clients" className="items-center flex">
                            <Image src={activePath === '/Admin/clients' || hovered === '/Admin/clients' ? teamW : teamG} alt='clients' width={18} id="clients-icon" className='ml-4' />
                            <p className="f14 fw200 ml-2">Clients</p>
                        </Link>
                    </li>
                </ul>
                <ul className="nunito">
                    <li className={`mb-3 ${activePath === '/Admin/complaints' ? 'active' : ''}`} onMouseEnter={() => setHovered('/Admin/complaints')} onMouseLeave={() => setHovered('')}>
                        <Link href="/Admin/complaints" className="items-center flex">
                            <Image src={activePath === '/Admin/complaints' || hovered === '/Admin/complaints' ? msgW : msgG} alt='complaints' width={18} id="complaints-icon" className='ml-4' />
                            <p className="f14 fw200 ml-2">Complaints</p>
                        </Link>
                    </li>
                </ul>
                <ul className="nunito">
                    <li className='mb-3' onMouseEnter={() => setHovered('settings')} onMouseLeave={() => setHovered('')}>
                        <div className="items-center flex" onClick={toggleDropdown}>
                            <Image src={hovered === 'settings' ? settingsW : settingsG} alt='settings' width={18} height={18} className='ml-4' id="settings-icon" />
                            <p className="f14 fw200 ml-2">Settings</p>
                            <Image src={ChevronIcon} alt="chevron" width={16} height={16} className={`chevron ${dropdownOpen ? 'open' : ''}`} />
                        </div>
                    </li>
            {dropdownOpen && (
                <ul className="dropdown">
                    <li className={`mb-3 ${activePath === '/Admin/pulses' ? 'active' : ''} dropdown-item`} onMouseEnter={() => setHovered('/Admin/pulses')} onMouseLeave={() => setHovered('')}>
                    <Link href="/Admin/pulses" className="items-center flex">
                    <Image src={activePath === '/Admin/pulses' || hovered === '/Admin/pulses' ? pulseW : pulseG} alt='pulses' width={18} height={18} className='ml-4' id="pulses-icon" />
                    <p className="f14 fw200 ml-2">Pulses</p>
                    </Link>
                    </li>
                    <li className={`mb-3 ${activePath === '/Admin/units' ? 'active' : ''} dropdown-item`} onMouseEnter={() => setHovered('/Admin/units')} onMouseLeave={() => setHovered('')}>
                        <Link href="/Admin/units" className="items-center flex">
                            <Image src={activePath === '/Admin/units' || hovered === '/Admin/units' ? settingsW : settingsG} alt='settings' width={18} height={18} className='ml-4' id="settings-icon" />
                            <p className="f14 fw200 ml-2">Units</p>
                        </Link>
                    </li>
                </ul>)}
                 </ul>
            </nav>
                 <div className="logout">
                    <Link href="/logout" className="items-center flex">
                    <Image src={logout} alt="logout" width={18} height={18} className='ml-4'/>
                    <p className="f14 fw200 ml-2">Logout</p>
                    </Link>
                </div>
        </div>    
     </>
    );
};

export default Sidebar;
