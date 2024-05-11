import { getDatabase, ref, onValue, get } from 'firebase/database';

const database = getDatabase();

export const startSensorStatusListener = async (setSensorStatus) => {
    console.log("Starting sensor status listener...");
    
    try {
        const response = await fetch('https://ecoroute-4eeb1-default-rtdb.europe-west1.firebasedatabase.app/.json');
        
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        
        const { Data } = await response.json();
        
        console.log("Fetched data:", Data);
        
        // Update sensor status
        if (Data) {
            updateSensorStatus(Data, setSensorStatus);
        } else {
            console.log("No sensor data found.");
        }
    } catch (error) {
        console.error("Error fetching initial sensor data:", error);
    }

    // Listen for subsequent updates
    const database = getDatabase();
    const sensorStatusRef = ref(database, '/Data');

    onValue(sensorStatusRef, (snapshot) => {
        const sensorData = snapshot.val();
        if (sensorData) {
            updateSensorStatus(sensorData, setSensorStatus);
        } else {
            console.log("No sensor data found in the update.");
        }
    }, (error) => {
        console.error("Firebase Realtime Database error:", error);
    });
};

const updateSensorStatus = (sensorData, setSensorStatus) => {
    let sensorStatus = {
        SR04: "Not working",
        ADXL345: "Not working"
    };

    if (!isNaN(sensorData.SR04)) {
        sensorStatus.SR04 = "Working";
    }

    if (sensorData.ADXL345 && 
        !isNaN(sensorData.ADXL345.X) &&
        !isNaN(sensorData.ADXL345.Y) &&
        !isNaN(sensorData.ADXL345.Z)) {
        sensorStatus.ADXL345 = "Working";
    }

    console.log("Sensor status:", sensorStatus);

    setSensorStatus(sensorStatus);
};
