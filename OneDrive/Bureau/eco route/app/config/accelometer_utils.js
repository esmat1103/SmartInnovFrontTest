export const startAccelerometerListener = async () => {
    try {
        const response = await fetch('https://ecoroute-4eeb1-default-rtdb.europe-west1.firebasedatabase.app/.json');
        
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        
        if (data && 'Data' in data) {
            const accelerometerData = data['Data']['ADXL345'];
            if (accelerometerData) {
                const { x, y, z } = accelerometerData;
                console.log("Original Acceleration (X,Y,Z):", x, y, z);
                
                // Define thresholds and baseline values
                const baselineZ = 11.4; // Baseline for stable bin (m/s²)
                const movementThreshold = 0.5; // Threshold for acceptable movement (m/s²)
                const fallThreshold = 1.0; // Threshold for fall detection (m/s²)
                
                // Function to check stability
                const isStable = (acceleration) => {
                    // Check if Z-axis is within threshold of baseline
                    const zStable = Math.abs(acceleration[2] - baselineZ) < movementThreshold;
                    
                    // Check if X and Y axes are within movement threshold
                    const xyStable = Math.abs(acceleration[0]) < movementThreshold && Math.abs(acceleration[1]) < movementThreshold;
                    
                    // Return true if all conditions are met
                    return zStable && xyStable;
                };
                
                // Function to check fall
                const isFallen = (acceleration) => {
                    // Check if any axis exceeds the fall threshold
                    return Math.abs(acceleration[0]) > fallThreshold || Math.abs(acceleration[1]) > fallThreshold || acceleration[2] > fallThreshold;
                };
                
                // Check stability and fall
                const acceleration = [x, y, z];
                if (isStable(acceleration)) {
                    console.log("Bin is stable");
                } else if (isFallen(acceleration)) {
                    console.log("Bin has fallen");
                } else {
                    console.log("Bin is unstable");
                }
            }
        }
    } catch (error) {
        console.error('Error fetching accelerometer data:', error);
    }
};
