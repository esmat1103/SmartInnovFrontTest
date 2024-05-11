import Stats from '@/components/admins/Dashboard/statbox1';
import Stat1 from '@/components/admins/Dashboard/statbox2';
import Stat2 from '@/components/admins/Dashboard/statbox3';
import Layoutadmin from '@/components/admins/layout';
import NavBarAdmin from '@/components/common/DashboardNavBar/NavBarAdmin';
import React from 'react';
import useRoleProtection from '../useRoleProtection';
import Loader from '@/components/loader';



export default function HomePage() {
  const loading = useRoleProtection(['admin']);

  if (loading) {
    // Render a loader component
    return <Loader />;
  }


  return (
   <>
   <Layoutadmin>
   <div className=''>
     <NavBarAdmin/>
     </div>
    <Stats />
    <Stat1 />
    <Stat2 /> 
   </Layoutadmin>
     
   </>
      
   
  );
}


