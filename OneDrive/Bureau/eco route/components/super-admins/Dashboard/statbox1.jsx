import React, { useState, useEffect } from 'react';
import { db } from '@/app/config/firebaseConfig.mjs';
import { collection, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import admins from "@/public/main_content/adminsStat.svg";
import municipality from "@/public/main_content/munici.svg";
import bins from "@/public/main_content/binsStat.svg";
import Map from '@/components/map';

const fetchStatsSummary = async () => {
  const statsSummary = {};

  // nb of super-admins
  const superAdminsRef = collection(db, 'superadmins');
  const superAdminsSnapshot = await getDocs(superAdminsRef);
  statsSummary.superAdminsCount = superAdminsSnapshot.size;

  // nb of admins
  const adminsRef = collection(db, 'admins');
  const adminsSnapshot = await getDocs(adminsRef);
  statsSummary.adminsCount = adminsSnapshot.size;

  // nb of employees
  const employeesRef = collection(db, 'employees');
  const employeesSnapshot = await getDocs(employeesRef);
  statsSummary.employeesCount = employeesSnapshot.size;

  // nb of bins
  const binsRef = collection(db, 'bins');
  const binsSnapshot = await getDocs(binsRef);
  statsSummary.binsCount = binsSnapshot.size;

  // nb of municipalities per governorate
  try {
    const governoratesCollection = collection(db, 'governorates');
    const querySnapshot = await getDocs(governoratesCollection);
    const governoratesData = querySnapshot.docs.map(async (doc) => {
      const governorate = doc.data().name;
      const municipalityCollectionRef = collection(doc.ref, 'municipalities');
      const municipalityQuerySnapshot = await getDocs(municipalityCollectionRef);
      const municipalities = municipalityQuerySnapshot.docs.map(m => m.data().name);
      return { governorate, municipalities };
    });
    const governoratesWithData = await Promise.all(governoratesData);
    statsSummary.municipalityCount = governoratesWithData.reduce((acc, curr) => acc + curr.municipalities.length, 0);
  } catch (error) {
    console.error('Error fetching governorates and municipalities:', error);
  }

  try {
    const binsRef = collection(db, 'bins');
    const binsSnapshot = await getDocs(binsRef);
    const binLocations = binsSnapshot.docs.map(doc => ({
      id: doc.id,
      location: doc.data().location,
    }));
    statsSummary.binLocations = binLocations;
  } catch (error) {
    console.error('Error fetching bins locations:', error);
  }


  return statsSummary;
};

const Stats = () => {
  const [statsSummary, setStatsSummary] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const summary = await fetchStatsSummary();
      setStatsSummary(summary);
    };

    fetchData();
  }, []);

  return (
    <div className='mx-3 mt-3'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-6 col-md-12 col-sm-12'>
            <div className='stats-box'>
              <p className='dark ml-3 pt-1 poppins fw600'>Statistics Summary</p>
              <div className='container'>
                <div className='row space-x-4'>
                  <div className='col-2 mt-4 flex relative'>
                    <div className='statcarré bg-pink relative'>
                      <div className='small-circle mt-3 ml-2 bg-stat-circle-pink absolute top-0 left-1 flex items-center justify-center'>
                        <Image src={admins} alt='admins' width={20} height={20}/>
                      </div> 
                      <p className='fw600 f36 dark absolute top-1 pl-3 pt-3 left-1'>{statsSummary ? statsSummary.superAdminsCount : '-'}</p>
                      <p className='fw600 f10 black absolute pb-3 pl-2 merriweather bottom-0 left-1'>Total SuperAdmins</p>
                    </div> 
                  </div>
                  <div className='col-2 mt-4 flex relative'>
                    <div className='statcarré bg-yellow relative'>
                      <div className='small-circle mt-3 ml-2 bg-stat-circle-yellow  absolute top-0 left-1 flex items-center justify-center'>
                        <Image src={municipality} alt='municipality' className='mb-2' width={20} height={20}/>
                      </div> 
                      <p className='fw600 f36 dark absolute top-1 pl-3 pt-3 left-1'>{statsSummary ? statsSummary.municipalityCount : '-'}</p>
                      <p className='fw600 f10 black absolute pb-3 pl-2 merriweather bottom-0 left-1'>Total Municipalities</p>
                    </div>
                  </div>
                  <div className='col-2 mt-4 flex relative'>
                    <div className='statcarré bg-green relative'>
                      <div className='small-circle mt-3 ml-3 bg-stat-circle-green absolute top-0 left-1 flex items-center justify-center'>
                        <Image src={bins} alt='bins' className='' width={15} height={15}/>
                      </div> 
                      <p className='fw600 f36 dark absolute top-1 pl-3 pt-3 left-1'>{statsSummary ? statsSummary.binsCount : '-'}</p>
                      <p className='fw600 f10 black absolute pb-3 pl-2 merriweather bottom-0 left-1'>Total Bins </p>
                    </div> 
                  </div>
                  <div className='col-2 mt-4 flex relative'>
                    <div className='statcarré bg-blue relative'>
                      <div className='small-circle mt-3 ml-2 bg-stat-circle-lila absolute top-0 left-1 flex items-center justify-center'>
                        <Image src={admins} alt='admins' width={20} height={20}/>
                      </div> 
                      <p className='fw600 f36 dark absolute top-1 pl-3 pt-3 left-1'>{statsSummary ? statsSummary.employeesCount : '-'}</p>
                      <p className='fw600 f10 black absolute pb-3 pl-2 merriweather bottom-0 left-1'>Total Employees</p>
                    </div> 
                  </div>
                  <div className='col-2 mt-4 flex relative'>
                    <div className='statcarré bg-bluedb relative'>
                      <div className='small-circle mt-3 ml-2  bg-stat-circle-bluedb absolute top-0 left-1 flex items-center justify-center'>
                        <Image src={admins} alt='admins' width={20} height={20}/>
                      </div> 
                      <p className='fw600 f36 dark absolute top-1 pl-3 pt-3 left-1'>{statsSummary ? statsSummary.adminsCount : '-'}</p>
                      <p className='fw600 f10 black absolute pb-3 pl-2 merriweather bottom-0 left-1'>Total Admins</p>
                    </div> 
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-lg-2 col-md-12 col-sm-12'>
            <div className='stats-box'>
            </div>
          </div>
          <div className='col-lg-4 col-md-12 col-sm-12'>
            <div className='stats-box'>
            {statsSummary && statsSummary.binLocations && <Map bins={statsSummary.binLocations} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
