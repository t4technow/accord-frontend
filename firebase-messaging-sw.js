// [START initialize_firebase_in_sw]
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
	messagingSenderId: "343960876538",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
// [END initialize_firebase_in_sw]

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function (payload) {
	console.log(
		"[firebase-messaging-sw.js] Received background message ",
		payload
	);
	// Customize notification here
	const notificationTitle = "Background Message Title";
	const notificationOptions = {
		body: "Background Message body.",
		icon: "/firebase-logo.png",
	};

	return self.registration.showNotification(
		notificationTitle,
		notificationOptions
	);
});
// [END background_handler]
// import { precacheAndRoute } from "workbox-precaching";
// import { registerRoute, setDefaultHandler } from "workbox-routing";
// import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
// import { ExpirationPlugin } from "workbox-expiration";
// import { skipWaiting, clientsClaim } from "workbox-core";

// // Precache the assets and configure the cache strategy
// precacheAndRoute(self.__WB_MANIFEST);

// // Set up default caching strategy
// setDefaultHandler(new CacheFirst());

// // Cache images with StaleWhileRevalidate strategy
// registerRoute(
// 	({ request }) => request.destination === "image",
// 	new StaleWhileRevalidate({
// 		cacheName: "images",
// 		plugins: [
// 			new ExpirationPlugin({
// 				maxEntries: 50,
// 				maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
// 			}),
// 		],
// 	})
// );

// // Handle push notifications
// self.addEventListener("push", (event) => {
// 	const options = {
// 		body: event.data.text(),
// 		icon: "/adobe.jpg", // Path to your notification icon
// 	};

// 	event.waitUntil(
// 		self.registration.showNotification("Notification Title", options)
// 	);
// });

// // Activate the service worker immediately
// self.addEventListener("activate", (event) => {
// 	event.waitUntil(
// 		Promise.all([
// 			clientsClaim(), // Take control of clients immediately
// 			// Additional activation logic, if any
// 		])
// 	);
// });

// // Skip waiting and claim clients
// // skipWaiting();
// clientsClaim();

self.addEventListener("install", (event) => {
	console.log("Service worker installed");
});

self.addEventListener("activate", (event) => {
	console.log("Service worker activating...");
	// Additional activation logic, if any
});

self.addEventListener("fetch", (event) => {
	// console.log("Fetching:", event.request.url);
});

self.addEventListener("push", function (event) {
	const options = {
		body: event.data.text(),
		icon: "/icon.png", // Path to your notification icon
	};

	event.waitUntil(
		self.registration.showNotification("Notification Title", options)
	);
});
