import { useEffect, useState } from 'react'

import { onMessageListener, requestForToken } from '../../app/api/firebase'

import { showNotification } from '../../components/utils/messages';
import { useRef } from 'react';
import useAuth from '../../hooks/auth/useAuth';

const PushNotification = () => {

    const { user } = useAuth();
    const effectRan = useRef(false);
    const [notification, setNotification] = useState({});

    useEffect(() => {
        console.log("Notification changed: ")
        console.log(notification);
        if (notification.title) {
            console.log("Actually showing notification");
            showNotification(notification.title + " - " + notification.body)
        }
    }, [notification])

    useEffect(() => {
        if (!!user && (!effectRan.current || process.env.NODE_ENV !== 'development')) {
            const requestPermission = async () => {
                try {
                    const result = await Notification.requestPermission();
                    if (result === 'granted') {
                        requestForToken();
                        onMessageListener()
                            .then((payload) => {
                                // showNotification(payload?.data?.title + " - " + payload?.data?.body)
                                console.log("Received notification payload");
                                console.log(payload);
                                setNotification({ title: payload?.data?.title, body: payload?.data?.body });
                            })
                            .catch((err) => console.log('failed: ', err));
                    }
                } catch (err) {
                    console.log("Error while retreiving token...");
                }
            }
            requestPermission();
        }

        // return () => effectRan.current = true
        // eslint - disable - next - line
    }, [user]);
}

export default PushNotification