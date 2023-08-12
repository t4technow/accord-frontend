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
		icon: "/adobe.jpg", // Path to your notification icon
	};

	event.waitUntil(
		self.registration.showNotification("Notification Title", options)
	);
});
