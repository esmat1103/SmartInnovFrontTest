// apis/notifications.js
export const sendNotification = async (notification) => {
    const response = await fetch('http://localhost:3010/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    });
  
    if (!response.ok) {
      throw new Error(`Failed to send notification: ${response.statusText}`);
    }
  
    return response.json();
  };
  