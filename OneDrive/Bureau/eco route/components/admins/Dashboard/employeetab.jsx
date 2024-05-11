import React, { useState, useEffect } from 'react';
import { db } from '@/app/config/firebaseConfig.mjs';
import { collection, getDocs } from 'firebase/firestore';
import { getStorage,} from 'firebase/storage';
import Image from 'next/image';

const EmployeesList = ({ uid }) => {
  const [employees, setEmployees] = useState([]);
  const storage = getStorage();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesRef = collection(db, `employees`);
        const querySnapshot = await getDocs(employeesRef);
        const fetchedEmployees = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEmployees(fetchedEmployees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, [uid]);

  return (
    <table className="score-table">
      <thead>
        <tr>
          <th className="f14 fw400 poppins tab_grey ">Rank</th>
          <th className="f14 fw400 poppins tab_grey">ID</th>
          <th className="f14 fw400 poppins tab_grey">Employee Name</th>
          <th className="f14 fw400 poppins tab_grey">Years of Experience</th>
          <th className="f14 fw400 poppins tab_grey">Governorate</th>
          <th className="f14 fw400 poppins tab_grey">Total Score</th>
        </tr>
      </thead>
      <tbody>
        {employees.slice(0, 3).map((employee, index) => (
          <tr key={employee.id}>
            <td className="blackb fw500 f14 poppins">{index + 1}</td>
            <td className="f10 mt-5">#{employee.uid}</td>
            <td className="blackb fw500 f14 poppins">
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <Image src={employee.imageUrl} alt="Profile" width={25} height={20} style={{ borderRadius: '50%', marginRight: '10px' }} />
                {employee.first_name} {employee.last_name}
              </span>
            </td>
            <td className="blackb fw500 f14 poppins center">{employee.years_of_experience}</td>
            <td className="blackb fw500 f14 poppins">{employee.governorate.substring(14)}</td>
            <td className="blackb fw500 f14 poppins center ">{employee.total_score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmployeesList;
