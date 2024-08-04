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
import { useTranslation } from 'next-i18next';
import LogoutConfirmation from '@components/Commun/Popups/LogoutPopup';

const SidebarC = () => {
    const router = useRouter();
    const { t } = useTranslation('sidebar');
    const [language, setLanguage] = useState('en');
    const [activePath, setActivePath] = useState('');
    const [hovered, setHovered] = useState('');
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);


    useEffect(() => {
        setActivePath(router.pathname);
    }, [router.pathname]);

    const handleConfirmLogout = () => {
        setShowLogoutConfirmation(false);
        localStorage.removeItem('token');
        router.push('/'); 
      };
    
      const handleLogoutClick = () => {
        setShowLogoutConfirmation(true);
    };

      const handleCancelLogout = () => {
          setShowLogoutConfirmation(false);
      };
  

    return (
        <>
        <div className="sidebar nunito">
            <div className='flex mt-5 mb-5'>
        </div>
            <nav className="mt-10 mx-3">
                <ul className="nunito">
                    <li className={`mb-3 ${activePath === '/Client/home' ? 'active' : ''}`} onMouseEnter={() => setHovered('/Client/home')} onMouseLeave={() => setHovered('')}>
                        <Link href="/Client/home" className="items-center flex">
                            <Image src={activePath === '/Client/home' || hovered === '/Client/home' ? dashboardW : dashboardG} alt='dashboard' width={18} id="dashboard-icon" className='ml-4' />
                            <p className="f14 fw200 ml-2">{t('dashboard')}</p>
                        </Link>
                    </li>
                </ul>
                <ul className="nunito">
                    <li className={`mb-3 ${activePath === '/Client/devices' ? 'active' : ''}`} onMouseEnter={() => setHovered('/Client/devices')} onMouseLeave={() => setHovered('')} >
                        <Link href="/Client/devices" className="items-center flex">
                            <Image src={activePath === '/Client/devices' || hovered === '/Client/devices' ? siteW : siteG} alt='device' width={18} id="device-icon" className='ml-4' />
                            <p className="f14 fw200 ml-2">{t('devices')}</p>
                        </Link>
                    </li>
                </ul>
                <ul className="nunito">
                    <li className={`mb-3 ${activePath === '/Client/sensors' ? 'active' : ''}`} onMouseEnter={() => setHovered('/Client/sensors')} onMouseLeave={() => setHovered('')} >
                        <Link href="/Client/sensors" className="items-center flex">
                            <Image src={activePath === '/Client/sensors' || hovered === '/Client/sensors' ? sensorW : sensorG} alt='sensor' width={18} id="sensor-icon" className='ml-4'/>
                            <p className="f14 fw200 ml-2">{t('sensors')}</p>
                        </Link>
                    </li>
                </ul>
                <ul className="nunito">
                    <li className={`mb-3 ${activePath === '/Client/complaints' ? 'active' : ''}`} onMouseEnter={() => setHovered('/Client/complaints')} onMouseLeave={() => setHovered('')} >
                        <Link href="/Client/complaints" className="items-center flex">
                            <Image src={activePath === '/Client/complaints' || hovered === '/Client/complaints' ? msgW : msgG} alt='complaints' width={18} id="complaints-icon" className='ml-4'/>
                            <p className="f14 fw200 ml-2">{t('complaints')}</p>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
        <div className="logout">
                <button onClick={handleLogoutClick} className="items-center flex">
                  <Image src={logout} alt="logout" width={18} height={18} className='ml-4'/>
                  <p className="f14 fw200 ml-2">{t('logout')}</p>
                </button>
              </div>
          {showLogoutConfirmation && (
            <LogoutConfirmation
              onConfirmDelete={handleConfirmLogout}
              onCancelDelete={handleCancelLogout}
            />
          )}
        </>
  );
};
export default SidebarC;
