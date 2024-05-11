import Layoutsuper_admin from '@/components/super-admins/layout';
import React from 'react';
import NavBar from '@/components/common/DashboardNavBar/NavBarSA';
import Stats from '@/components/super-admins/Dashboard/statbox1';
import Stat1 from '@/components/super-admins/Dashboard/statbox2';
import Stat2 from '@/components/super-admins/Dashboard/statbox3';
import Loader from '@/components/loader';
import useRoleProtection from '../useRoleProtection';

export default function HomePage() {
  const loading = useRoleProtection(['superadmin']);

  if (loading) {
    // Render a loader component
    return <Loader />;
  }
  return (
   <>
   <Layoutsuper_admin>
     <div className=''>
     <NavBar/>
     </div>
       <Stats/>
       <Stat1 />
       <Stat2 />
   </Layoutsuper_admin>
     
   </>
      
   
  );
}


