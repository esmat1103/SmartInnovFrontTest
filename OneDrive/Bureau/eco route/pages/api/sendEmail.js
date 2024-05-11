// pages/api/sendEmail.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const recipientEmail = req.body.recipientEmail;

        try {
            const response = await fetch('YOUR_CLOUD_FUNCTION_URL/sendEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipientEmail }),
            });

            if (response.ok) {
                res.status(200).json({ success: true });
            } else {
                const error = await response.text();
                res.status(response.status).json({ success: false, error });
            }
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
