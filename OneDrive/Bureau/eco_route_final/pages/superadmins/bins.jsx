import React from 'react';
import Table from '@/components/super-admins/bins/Table/table';
import Layoutsuper_admin from '@/components/super-admins/layout';
import Loader from '@/components/loader';
import useRoleProtection from '../useRoleProtection';


export default function Bins() {
  const loading = useRoleProtection(['superadmin']);

  if (loading) {
    // Render a loader component
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
