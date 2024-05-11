import React from 'react';
import Table from '../../components/admins/employees/Table/TableN';
import Layoutadmin from '@/components/admins/layout';
import useRoleProtection from '../useRoleProtection';
import Loader from '@/components/loader';



export default function Employees() {
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
