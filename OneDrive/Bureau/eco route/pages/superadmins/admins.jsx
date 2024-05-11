import React from 'react';
import Table from '@/components/super-admins/admins/Table/table';
import Layoutsuper_admin from '@/components/super-admins/layout';
import Loader from '@/components/loader';
import useRoleProtection from '../useRoleProtection';


export default function Admins() {
  const loading = useRoleProtection(['superadmin']);

  if (loading) {
    return <Loader />;
  }
  
  return (
   <>
   <Layoutsuper_admin>
        <Table />
   </Layoutsuper_admin>
     
   </>
      
   
  );
}


