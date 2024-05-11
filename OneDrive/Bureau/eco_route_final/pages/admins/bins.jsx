import React from 'react';
import Table from '@/components/admins/bins/Table/table';
import Layoutadmin from '@/components/admins/layout';
import useRoleProtection from '../useRoleProtection';
import Loader from '@/components/loader';



export default function Bins() {
  const loading = useRoleProtection(['admin']);

  if (loading) {
    // Render a loader component
    return <Loader />;
  }

  return (
   <>
   <Layoutadmin>
        <Table />
   </Layoutadmin>
      
   </>
      
   
  );
}
