import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { subscribePushNotification } from "./usersApi";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBgVWLb83BD8X4c2PvvbsczGfcdbwxGyEA",
    authDomain: "gmw-app.firebaseapp.com",
    projectId: "gmw-app",
    storageBucket: "gmw-app.appspot.com",
    messagingSenderId: "482551638987",
    appId: "1:482551638987:web:b4f8a209d69ebddb45e44e"
};

const vapidKey = 'BGXi85P8Lt-0aa5_yw23niVP8tWWfcl2p7JTDBTPIWNdpKt3f_ipPtb6RSlZ023UQ2PZPh6Tg3Dq8ytMCStLJ1s';

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging();
export const storage = getStorage(firebaseApp);

export const requestForToken = () => {
    return getToken(messaging, { vapidKey })
        .then((currentToken) => {
            if (currentToken) {
                console.log('current token for client: ', currentToken);
                // Perform any other neccessary action with the token
                subscribePushNotification(currentToken);
            } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
            }
        })
        .catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
        });
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            console.log("payload", payload)
            resolve(payload);
        });
    });