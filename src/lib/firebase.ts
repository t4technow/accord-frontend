import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";



const firebaseConfig = {
  apiKey: "AIzaSyDPxOdP9LZkoljShnGv3NsyRdgppnlqgeo",
  authDomain: "accord-t4technow.firebaseapp.com",
  projectId: "accord-t4technow",
  storageBucket: "accord-t4technow.appspot.com",
  messagingSenderId: "1027869237582",
  appId: "1:1027869237582:web:ebde2e31fb97d48c39fe1f",
  measurementId: "G-5MK56940TX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

async function sendSubscriptionToServer(endpoint: any) {
  try {
    console.log('send')
    const response = await fetch('http://localhost:5555/api/devices/', {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
        },
      body: JSON.stringify({
        'registration_id': endpoint,
        'type': 'web',
      }),
      credentials: "include",
      mode: 'no-cors'
    })

    if (response.ok) {
      console.log(response)
      console.log('Subscription sent to server successfully.');
    } else {
      console.error('Failed to send subscription to server.');
    }
  } catch (error) {
    console.error('Error sending subscription:', error);
  }
}

export const requestPermission = () => {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');

      return getToken(messaging, {vapidKey: "BJXwq79NXySNzZIieRkdUwgD0niQO2itI-JyKPa2jZVrrNmq3VHGVdJyDG081rInjhp5_u2ov4GP_gzZqsGxO8Y"})
      .then((currentToken) => {
        if (currentToken) {
          console.log('client')
          sendSubscriptionToServer(currentToken)

        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
          // ...
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
      });
    }
  })
}

export const onMessageListener = () => {
  new Promise(resolve => {
    onMessage(messaging, payload => {
      resolve(payload)
    })
  })
}

