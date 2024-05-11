import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const useRoleProtection = (allowedRoles = []) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    if (!role || !allowedRoles.includes(role)) {
      router.push('/404'); // Redirect to 404 if role is not authorized
    } else {
      setLoading(false); // Set loading to false once role is checked
    }
  }, [allowedRoles, router]);

  return loading;
};

export default useRoleProtection;
