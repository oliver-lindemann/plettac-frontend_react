// Scripts for firebase and firebase messaging
// import { initializeApp } from 'firebase/app';
// import { getMessaging } from 'firebase/messaging';
importScripts('https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.17.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyBgVWLb83BD8X4c2PvvbsczGfcdbwxGyEA",
    authDomain: "gmw-app.firebaseapp.com",
    projectId: "gmw-app",
    storageBucket: "gmw-app.appspot.com",
    messagingSenderId: "482551638987",
    appId: "1:482551638987:web:b4f8a209d69ebddb45e44e"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.data.title;
    const notificationOptions = {
        body: payload.data.body,
        icon: './logo192.jpg'
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});
