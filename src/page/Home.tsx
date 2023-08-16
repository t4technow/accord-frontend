// React and React Router hooks
import { useState, useEffect, lazy, Suspense } from "react";
import { useLocation, useParams } from "react-router-dom";

import { wsHead } from "@/config/Constants";

// Components
const ServerList = lazy(() => import('@/Components/Sidebar/ServerList'))
const ChannelsList = lazy(() => import('@/Components/Sidebar/ChannelsList'))
const ChatArea = lazy(() => import("@/Components/ChatArea/ChatArea"));
const Topbar = lazy(() => import("@/Components/Topbar/Topbar"));
import ServerCreation from "@/Components/Forms/ServerCreation";
import RightBar from "@/Components/RightBar/RightBar";

// Types
import Notification from "@/Components/Notification/Notification";
import { Message, RootState, User } from "@/lib/Types";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "@/redux/chat/onlineUsers";
import { setCurrentServer } from "@/redux/server/ServerSlice";
import ServerSkelton from "@/Components/Sidebar/ServerSkelton";
import ChannelSkelton from "@/Components/Sidebar/ChannelSkelton";
import TopbarSkelton from "@/Components/Topbar/TopbarSkelton";
import ChatAreaSkelton from "@/Components/ChatArea/ChatAreaSkelton";


const Home = () => {

	const [active, setActive] = useState<string>("");
	const [friends, setFriends] = useState<User[]>([]);

	const [showMessage, setShowMessage] = useState<boolean>(true);
	const [showCreateServer, setShowCreateServer] = useState<boolean>(false);

	const [dm, setDm] = useState<User[]>([]);
	const [onlineStatusSocket, setOnlineSocket] = useState<WebSocket | null>(null)

	const [searchQuery, setSearchQuery] = useState<string>("");
	const [searchResults, setSearchResults] = useState<number[]>([]);
	const [highlightedMessageIndex, setHighlightedMessageIndex] = useState<number>(-1);
	const [messages, setMessages] = useState<Message[] | []>([]);

	const [showVideo, setShowVideo] = useState<boolean>(false)

	const userId = useSelector((state: RootState) => state.user.userId)
	const showSidebar = useSelector((state: RootState) => state.chat.showSidebar) || false
	// const [showSidebar, setShowSidebar] = useState<boolean>(false)

	const location = useLocation();
	const dispatch = useDispatch();
	const { server } = useParams()

	const serverList = useSelector((state: RootState) => state.server.servers)

	// Function to show message, if any in redirect
	useEffect(() => {
		if (server) {
			if (serverList && serverList?.length > 0) {
				const hasServerWithId = serverList.some(item => item.id === parseInt(server));

				if (hasServerWithId) {
					dispatch(setCurrentServer(server))
				} else {
					dispatch(setCurrentServer('dm'))
				}
			} else {
				dispatch(setCurrentServer('dm'))
			}
		}
		const timer = setTimeout(() => {
			setShowMessage(false);
		}, 3000);
		location.state = null;
		return () => clearTimeout(timer);
	}, []);



	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		if (!onlineStatusSocket) return;

		const visibilityChangeCallback = () => {
			setIsVisible(document.hidden);
			onlineStatusSocket.send(
				JSON.stringify({
					type: isVisible ? "online" : "offline",
					sender: userId,
					isVisible,
				})
			);
		};

		document.addEventListener("visibilitychange", visibilityChangeCallback);

		return () => {
			document.removeEventListener("visibilitychange", visibilityChangeCallback);
		};
	}, []);

	useEffect(() => {

		// Connect to the WebSocket server
		const socket = new WebSocket(
			wsHead +
			"online-status/" +
			`?token=${localStorage.getItem(
				"access_token"
			)}`
		);

		// Event listener for WebSocket connection opens
		socket.onopen = () => {
			console.log("Connected to Chat WebSocket");
			setOnlineSocket(socket)
		};

		// Event listener for WebSocket messages received
		socket.onmessage = (event) => {
			const receivedData = JSON.parse(event.data);
			dispatch(setOnlineUsers(receivedData.online_users))
		};

		// Cleanup function on component unmount
		return () => {
			console.log('closed')
			socket.close();
		};
	}, []);

	const [notifications, setNotifications] = useState<{ title: string; sender_id: number, sender: string; type: 'voice' | 'video' }[] | []>([]);

	useEffect(() => {

		// Connect to the WebSocket server
		const socket = new WebSocket(
			wsHead +
			"notifications/" +
			`?token=${localStorage.getItem(
				"access_token"
			)}`
		);

		// Event listener for WebSocket connection opens
		socket.onopen = () => {
			console.log("Connected to Notification WebSocket");
			setOnlineSocket(socket)
		};

		// Event listener for WebSocket messages received
		socket.onmessage = (event) => {
			const receivedData = JSON.parse(event.data);
			if (receivedData.type !== 'chat') {
				setNotifications(prevNotifications => [...prevNotifications, receivedData.message])
			}

		};

		// Cleanup function on component unmount
		return () => {
			console.log('closed')
			socket.close();
		};
	}, []);


	useEffect(() => {
		const timeoutIds: any[] = [];

		notifications.forEach((notification, index) => {
			if (notification.type !== 'video') {
				const timeoutId = setTimeout(() => {
					setNotifications(prevNotifications => prevNotifications.filter((_, i) => i !== index));
				}, 3000);
				timeoutIds.push(timeoutId);
			}
		});

		return () => {
			timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
		};
	}, [notifications]);

	const closeNotification = (indx: number) => {
		setNotifications(prevNotifications => prevNotifications.filter((_, index) => index !== indx));
	}

	return (
		<div className="wrapper d-flex">
			{showMessage && location.state && location.state.message ? (
				<div className="info-message"> {location.state.message} </div>
			) : null}
			<div className={`sidebar ${showSidebar ? 'mobile' : ''}`}>
				<Suspense fallback={<ServerSkelton />}>
					<ServerList
						showCreateServer={showCreateServer}
						setShowCreateServer={setShowCreateServer}
					/>
				</Suspense>
				<Suspense fallback={<ChannelSkelton />}>
					<ChannelsList
						dm={dm}
						setDm={setDm}
						onlineStatusSocket={onlineStatusSocket}
					/>
				</Suspense>
			</div>

			{!showSidebar ?
				<div className={`main-content-wrapper ${!showSidebar && 'show'}`} >
					<Suspense fallback={<TopbarSkelton />}>
						<Topbar
							active={active}
							setActive={setActive}
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
							searchResults={searchResults}
							setSearchResults={setSearchResults}
							setHighlightedMessageIndex={setHighlightedMessageIndex}
							messages={messages}
							setShowVideo={setShowVideo}
						/>
					</Suspense>
					<div className="offset"></div>
					<div className="main-content d-flex">
						<Suspense fallback={<ChatAreaSkelton />}>
							<ChatArea
								friends={friends}
								setFriends={setFriends}
								active={active}
								dm={dm}
								setDm={setDm}
								searchResults={searchResults}
								highlightedMessageIndex={highlightedMessageIndex}
								messages={messages}
								setMessages={setMessages}
								showVideo={showVideo}
							/>
						</Suspense>
						<RightBar />
					</div>
				</div>
				: null}



			{showCreateServer && (
				<Suspense fallback={<div className="loading"></div>} >
					<ServerCreation
						showModal={showCreateServer}
						setShowModal={setShowCreateServer}
					/>
				</Suspense>
			)}
			{notifications.length > 0 &&
				<div className="notifications-holder">

					{notifications.map((notification, i) =>
						<Notification notification={notification} key={i} indx={i} closeNotification={closeNotification} setShowVideo={setShowVideo} />
					)
					}
				</div>
			}
		</div>
	);
};

export default Home;
