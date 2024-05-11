import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getFirestore, doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import phone from '@/public/main_content/phone.svg';
import email from '@/public/main_content/email.svg';
import tick from'@/public/main_content/tick1.gif';
import alert from '@/public/main_content/alert.gif';
import RouteMap from './RouteMap';
import close from '@/public/main_content/arrow1.svg';

const NotificationPopupContent = ({ notification, employeeDetails, onClose }) => {
    const [routeDetails, setRouteDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRouteDetails = async () => {
            const firestore = getFirestore();
            try {
                console.log("Fetching route details for routeId:", notification.routeId);
                let routeDocRef;

                if (notification.type === 'correct_route') {
                    routeDocRef = doc(firestore, 'routes', notification.routeId);
                } else if (notification.type === 'wrong_route') {
                    const testRouteCollection = collection(firestore, 'TestRoute');
                    const q = query(testRouteCollection, where('routeId', '==', notification.routeId));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        routeDocRef = doc.ref;
                    });
                }

                const routeDocSnap = await getDoc(routeDocRef);
                if (routeDocSnap.exists()) {
                    console.log("Route details found:", routeDocSnap.data());
                    if (notification.type === 'wrong_route') {
                        const { routeId, correctRouteId } = routeDocSnap.data();
                        const correctRouteDocSnap = await getDoc(doc(firestore, 'routes', correctRouteId));
                        if (correctRouteDocSnap.exists()) {
                            console.log("Correct Route details found:", correctRouteDocSnap.data());
                            setRouteDetails({ wrong: routeDocSnap.data(), correct: correctRouteDocSnap.data() });
                        } else {
                            console.log('Correct Route not found');
                        }
                    } else {
                        setRouteDetails(routeDocSnap.data());
                    }
                } else {
                    console.log('Route not found');
                }
            } catch (error) {
                console.error('Error fetching route details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (notification && notification.routeId) {
            fetchRouteDetails();
        }
    }, [notification]);

    const sendEmail = () => {
        const recipientEmail = employeeDetails.email;
        const subject = "Subject of your email";
        const body = "Body of your email";
    
        const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
        const anchor = document.createElement('a');
        anchor.href = mailtoLink;
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
    
        anchor.click();
    
        document.body.removeChild(anchor);
    };
    
    
    

    return (
        <div className="popupNotif2">
            <div className="popup-content barContainer">
                <div className=''>
                    <button onClick={onClose} className="closeBtn">
                        <Image src={close} alt="close" width={30} />
                    </button>
                    <div className="pt-5 d-flex align-items-center">
                        {employeeDetails.imageUrl && (
                            <div style={{ position: 'relative', marginRight: '10px', marginLeft: '20px', marginBottom: '10px' }}>
                                <div style={{ borderRadius: '50%', overflow: 'hidden', width: '100px', height: '100px' }}>
                                    <Image src={employeeDetails.imageUrl} alt="Employee Image" width={100} height={100} objectFit="contain" />
                                </div>
                                <div style={{ position: 'absolute', bottom: '-1px', left: '22px', backgroundColor: 'white', borderRadius: '50%', paddingLeft: '10px', paddingRight: '10px' }}>
                                    <span className='teal'>★4.0</span>
                                </div>
                            </div>
                        )}
                        {employeeDetails && (
                            <div>
                                <div className='fw600 teal f24'>{employeeDetails.first_name} {employeeDetails.last_name}</div>
                                <div className='d-flex align-items-center'>
                                    <div className='f14 email poppins'>{employeeDetails.governorate}</div>
                                    <div className='pl-2 f14 email poppins'>, {employeeDetails.municipality}</div>
                                </div>
                                <div className='pl-1 email f14'> {employeeDetails.years_of_experience} years</div>

                                <div className='position-absolute  mt-2 flex mx-2 top-0 end-0'>
                                    <button className='btn mx-1 flex bg-white'>
                                        <Image src={phone} alt='' height={20} width={20} />
                                        <p className=' mt-1 mx-1 email poppins f10'>(+216) {employeeDetails.phone_number}</p>
                                    </button>
                                    <button className='btn mx-1 flex bg-white' onClick={sendEmail}>
                                        <Image src={email} alt='' height={20} width={20} />
                                        <p className=' mt-1 mx-1 email poppins f10'>Send an Email</p>
                                    </button>

                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
            <div className='container line1'>
                <div className='mt-5 br30 p-1 pb-2 border'>
                    {notification.type === 'correct_route' && (
                        <>
                            <div className='brlr pb-3 notificationItemGreen'>
                                <div className='flex'>
                                    <Image className="pt-2 pl-2" src={tick} alt='' width={40} height={40} />
                                    <p className='mt-3 mx-2 fw600'>Route Completion Success!</p>
                                </div>
                                <p className='px-5 f18 email'><span className='fw600'>{employeeDetails.first_name} {employeeDetails.last_name},</span> has successfully completed their assigned route.</p>
                                {routeDetails && (
                                    <p className='email mx-3' style={{ position: 'absolute', top: 288, right: 0, paddingRight: '10px' }}>
                                        {routeDetails.date && routeDetails.date.toDate().toLocaleString()}
                                    </p>
                                )}
                            </div>
                            <p className='f20 pl-2 pt-3 email poppins fw600'>Route Details:</p>
                            <div className='routeDetailsContainer mt-2'>
                                {routeDetails && (
                                    <div className=''>
                                        <div className='routeDetailsItem '>
                                            <p className='poppins label'>Distance:</p>
                                            <p className='poppins'>{routeDetails.distance} kilometers</p>
                                        </div>
                                        <div className='routeDetailsItem'>
                                            <p className='poppins label'>Duration:</p>
                                            <p className='poppins'>{routeDetails.duration} minutes</p>
                                        </div>
                                        <div className='routeDetailsItem'>
                                            <p className='poppins label'>Fuel Consumption:</p>
                                            <p className='poppins'>{routeDetails.fuelConsumption} liters</p>
                                        </div>
                                        <div className='routeDetailsItem'>
                                            <p className='poppins label'>Collected bins:</p>
                                            <p className='poppins'>{routeDetails.collected_bins} </p>
                                        </div>
                                    </div>
                                )}
                                <div className='flex'>
                                    <RouteMap
                                        route={routeDetails}
                                        routeId={notification.routeId}
                                        color="limegreen"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {notification.type === 'wrong_route' && (
                        <>
                            <div className='brlr pb-3 notificationItemPink '>
                                <div className='flex'>
                                    <Image className="pt-2 pl-2" src={alert} alt='' width={35} height={35} />
                                    <p className='mt-3 mx-2 fw600'>Route Divergence Detected!</p>
                                </div>
                                <p className='px-5 f18 email'><span className='fw600'>{employeeDetails.first_name} {employeeDetails.last_name},</span> has successfully completed their assigned route.</p>
                                {routeDetails && (
                                    <div>
                                        <p className='email mx-3' style={{ position: 'absolute', top: 288, right: 0, paddingRight: '10px' }}>
                                            {routeDetails.date && routeDetails.date.toDate().toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className='routeDetailsContainer mt-2'>
                                {routeDetails && (
                                    <div className='flex'>
                                        <div style={{ width: '45%', marginRight: '5%' }}>
                                            <RouteMap
                                                route={routeDetails.wrong}
                                                routeId={notification.routeId}
                                                color="red"
                                            />
                                        </div>
                                        <div style={{ width: '45%' }}>
                                            <RouteMap
                                                route={routeDetails.correct}
                                                routeId={routeDetails.routeId}
                                                correctRouteId={routeDetails.correctRouteId}
                                                wrongRouteId={notification.routeId}
                                                color="limegreen"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationPopupContent;
