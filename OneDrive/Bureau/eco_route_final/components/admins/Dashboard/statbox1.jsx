import React, { useState, useEffect } from 'react';
import { db, auth } from '@/app/config/firebaseConfig.mjs';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import Image from 'next/image';
import admins from "@/public/main_content/adminsStat.svg";
import bins from "@/public/main_content/binsStat.svg";
import Map from '@/components/map';


const getDocumentIdByUid = async (collectionName, uid) => {
  const collectionRef = collection(db, collectionName);
  const querySnapshot = await getDocs(query(collectionRef, where('uid', '==', uid)));

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].id;
  } else {
    return null;
  }
};

const Stats = () => {
  const [statsSummary, setStatsSummary] = useState(null);
  const [binLocations, setBinLocations] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error('No user logged in');
          return;
        }

        const uid = user.uid;
        const documentId = await getDocumentIdByUid('admins', uid);

        if (!documentId) {
          console.error('Document does not exist for user:', uid);
          return;
        }

        const adminRef = doc(db, 'admins', documentId);
        const adminSnapshot = await getDoc(adminRef);
        console.log('Admin data:', adminSnapshot.data());

        const municipality = adminSnapshot.data().municipality;

        const workersQuery = query(collection(db, 'employees'), where('municipality', '==', municipality));
        const workersSnapshot = await getDocs(workersQuery);
        const workersCount = workersSnapshot.size;

        const binsQuery = query(collection(db, 'bins'), where('municipality', '==', municipality));
        const binsSnapshot = await getDocs(binsQuery);
        const binsCount = binsSnapshot.size;

        setStatsSummary({ employeesCount: workersCount, binsCount });

        // Fetch bins locations
        const binsLocationsQuery = query(collection(db, 'bins'), where('municipality', '==', municipality));
        const unsubscribeBinsLocations = onSnapshot(binsLocationsQuery, (querySnapshot) => {
          const updatedBinsLocations = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            location: doc.data().location,
          }));
          setBinLocations(updatedBinsLocations);
        });


        // Clean up snapshot listeners when component unmounts
        return () => {
          unsubscribeBinsLocations();
          unsubscribeRoutes();
        };
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

 

  
  return (
    <div className='mx-3 mt-2'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-3 col-md-12 col-sm-12'>
            <div className='stats-box'>
              <p className='dark ml-3 pt-1 poppins fw600'>Statistics Summary</p>

              <div className='container'>
                <div className='row space-x-4'>
                  <div className='col-5 mt-4 flex relative'>
                    <div className='statcarré2 bg-green relative'>
                      <div className='small-circle mt-3 ml-3 bg-stat-circle-green absolute top-0 left-1 flex items-center justify-center'>
                        <Image src={bins} alt='bins' className='' width={15} height={15}/>
                      </div>
                      <p className='fw600 f36 dark absolute top-1 pl-3 pt-3 left-1'>{statsSummary ? statsSummary.binsCount : '-'}</p>
                      <p className='fw600 f10 black absolute pb-3 pl-2 merriweather bottom-0 left-1'>Total Bins </p>
                    </div>
                  </div>
                  <div className='col-2 mt-4 flex relative'>
                    <div className='statcarré2 bg-blue relative'>
                      <div className='small-circle mt-3 ml-2 bg-stat-circle-lila absolute top-0 left-1 flex items-center justify-center'>
                        <Image src={admins} alt='admins' width={20} height={20}/>
                      </div>
                      <p className='fw600 f36 dark absolute top-1 pl-3 pt-3 left-1'>{statsSummary ? statsSummary.employeesCount : '-'}</p>
                      <p className='fw600 f10 black absolute pb-3 pl-2 merriweather bottom-0 left-1'>Total Employees</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-lg-5 col-md-12 col-sm-12'>
            <div className='stats-box'>
            </div>
          </div>
          <div className='col-lg-4 col-md-12 col-sm-12'>
            <div className='stats-box'>
              {binLocations.length > 0 && <Map bins={binLocations} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
