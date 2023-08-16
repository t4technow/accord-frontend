// React Router Components
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Protected Route
import ProtectedRoute from "./utils/ProtectedRoute";

// Pages
import Home from "./page/Home";
import Auth from "./page/Auth";
import VerifyEmail from "./page/VerifyEmail";

// Styles
import "./App.css";
import { useEffect } from "react";
import { RootState } from "./lib/Types";
import { useSelector } from "react-redux";
import axiosInstance from "./config/axiosInstance";

interface PushSubscription {
	endpoint: string;
	expirationTime: number | null;
	keys: {
		p256dh: string;
		auth: string;
	};
}

const App = () => {

	const loggedUser = useSelector((state: RootState) => state.user.userId);
	// const VAPID = import.meta.env.VITE_VAPID_PUBLIC_KEY

	async function requestNotificationPermission() {
		if (!('PushManager' in window)) {
			console.log('Push notifications are not supported.');
			return;
		}
		const permission = await Notification.requestPermission();
		if (permission === "granted") {
			// registerServiceWorker();
		}
	}



	async function registerServiceWorker() {
		if ('serviceWorker' in navigator) {
			try {
				await navigator.serviceWorker.register('/serviceWorker.js', {
					scope: '/',
				})
					.then(async (registration) => {
						console.log('Service Worker registered with scope:', registration.scope);
						try {
							await handlePushSubscription(registration);
						} catch (error) {
							console.error('Push subscription failed:', error);
						}
					})

				// Set up the controllerchange event listener

			} catch (error) {
				console.error('Service Worker registration failed:', error);
			}
		}
	}

	useEffect(() => {
		// Register the service worker when the component mounts
		registerServiceWorker();
	}, []);

	async function handlePushSubscription(registration: any) {
		try {
			console.log('handlePushSubscription')
			const subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: 'BK95jBHi_8FQsytb4NIZB3XOtPnoc_LPDPikuDGIb_SJUE5bR_vslHBedZM1Mfbb1smR6YdbFCCsgQlhlmYatyU',
			});

			console.log('Push subscription:', subscription);

			const deviceToken = btoa(
				subscription.keys.p256dh + ':' + subscription.keys.auth
			);

			await sendSubscriptionToServer(subscription, deviceToken);
			console.log('Device Token:', deviceToken);
		} catch (error) {
			console.error('Push subscription failed:', error);
		}
	}

	async function sendSubscriptionToServer(subscription: PushSubscription, deviceToken: any) {
		try {
			const response = await axiosInstance.post('push/subscribe/', {  // Update the URL to your Django API endpoint
				subscription,
				deviceToken,
			});

			if (response.status === 200) {
				console.log('Subscription sent to server successfully.');
			} else {
				console.error('Failed to send subscription to server.');
			}
		} catch (error) {
			console.error('Error sending subscription:', error);
		}
	}

	const checkCameraPermission = async () => {
		try {
			const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });

			if (cameraPermission.state === 'granted') {
				console.log('granted');
			} else if (cameraPermission.state === 'denied') {
				const getPermission = await navigator.mediaDevices.getUserMedia({ video: true })
				return getPermission
			}
		} catch (error) {
			console.error('Error checking camera permission:', error);
		}
	};

	async function initializePush() {
		await requestNotificationPermission();
		await registerServiceWorker();
	}
	initializePush();

	useEffect(() => {
		if (!loggedUser) return
		if (Notification.permission !== 'granted') {
			initializePush()
		}
		checkCameraPermission()
		console.log(loggedUser, '---')
	}, [loggedUser])


	return (
		<BrowserRouter>
			<Routes>
				<Route path="/user/*" element={<Auth />} />
				<Route element={<ProtectedRoute />}>
					{/* Protected Routes: only logged in users will be able to access */}
					<Route path="/:server?/:channel?" element={<Home />} />
					{/* Catch-all route to redirect undefined paths to the home page */}
					<Route path="/*" element={<Navigate to="/" />} />
				</Route>
				<Route element={<VerifyEmail />} path="/verify-email/:uid/:token" />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
