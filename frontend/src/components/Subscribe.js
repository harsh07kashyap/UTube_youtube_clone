import React, { useState,useEffect } from 'react';
import axios from 'axios';
const backend_url=process.env.REACT_APP_BACKEND_URL

const SubscribeButton = ({ userId}) => {
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSubscriptionStatus = async () => {
            try {
                const config = {
                    headers: {
                        'auth-token': localStorage.getItem('token')
                    }
                };
                const res = await axios.get(`${backend_url}/api/channel/check-subscription/${userId}`, config);
                setSubscribed(res.data.isSubscribed); // Set subscribed state based on the response
            } catch (err) {
                console.error('Error fetching subscription status:', err.response?.data?.msg || err.message);
            }
        };

        fetchSubscriptionStatus();
    }, [userId]);

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    'auth-token': localStorage.getItem('token')
                }
            };
            const res=await axios.post(`${backend_url}/api/channel/subscribe/${userId}`, {}, config);
            if (res.data.msg === "Subscribed successfully.") {
                setSubscribed(true);
                
            } else if (res.data.msg === "Unsubscribed successfully") {
                setSubscribed(false);
                
            }
        } catch (err) {
            console.error('Error subscribing/unsubscribing:', err.response.data.msg);
        } finally {
            setLoading(false);
        }
    };
    return (
        <button className='btn-btn-primary' onClick={handleSubscribe} disabled={loading}>
            {loading ? 'Processing...' : subscribed ? 'Unsubscribe' : 'Subscribe'}
        </button>
    );
};

export default SubscribeButton;
