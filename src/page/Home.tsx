// React and React Router hooks
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { wsHead } from "@/config/Constants";

// Components
import ServerList from "@/Components/Sidebar/ServerList";
import ServerCreation from "@/Components/Forms/ServerCreation";
import ChannelsList from "@/Components/Sidebar/ChannelsList";
import Topbar from "@/Components/Topbar/Topbar";
import ChatArea from "@/Components/ChatArea/ChatArea";
import RightBar from "@/Components/RightBar/RightBar";
// import Notification from "@/Components/Notification/Notification";

// Types
import { Message, RootState, User } from "@/lib/Types";
import notificationSound from '@/assets/sounds/Notification.mp3'
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "@/redux/chat/onlineUsers";


const Home = () => {
	const [currentChat, setCurrentChat] = useState<number | null>(null);
	const [chatType, setChatType] = useState<string>("user");

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

	const location = useLocation();
	const dispatch = useDispatch();
	// Function to show message, if any in redirect
	useEffect(() => {
		const timer = setTimeout(() => {
			setShowMessage(false);
		}, 3000);
		location.state = null;
		return () => clearTimeout(timer);
	}, []);



	const soundRef = useRef<HTMLAudioElement>(null)
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


	// const [notifications, setNotifications] = useState<{}[] | []>([]);


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
			console.log(receivedData, '==========')
			dispatch(setOnlineUsers(receivedData.online_users))
		};

		// Cleanup function on component unmount
		return () => {
			console.log('closed')
			socket.close();
		};
	}, []);

	return (
		<div className="wrapper d-flex">
			{showMessage && location.state && location.state.message ? (
				<div className="info-message"> {location.state.message} </div>
			) : null}
			<div className="sidebar">
				<ServerList
					showCreateServer={showCreateServer}
					setShowCreateServer={setShowCreateServer}
				/>
				<ChannelsList
					currentChat={currentChat}
					setCurrentChat={setCurrentChat}
					dm={dm}
					setDm={setDm}
					chatType={chatType}
					setChatType={setChatType}
					onlineStatusSocket={onlineStatusSocket}
				/>
			</div>
			<div className="main-content-wrapper">
				<Topbar
					currentChat={currentChat}
					active={active}
					setActive={setActive}
					chatType={chatType}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					searchResults={searchResults}
					setSearchResults={setSearchResults}
					setHighlightedMessageIndex={setHighlightedMessageIndex}
					messages={messages}
					setShowVideo={setShowVideo}
				/>
				<div className="main-content d-flex">
					<ChatArea
						currentChat={currentChat}
						setCurrentChat={setCurrentChat}
						friends={friends}
						setFriends={setFriends}
						active={active}
						dm={dm}
						setDm={setDm}
						chatType={chatType}
						searchResults={searchResults}
						highlightedMessageIndex={highlightedMessageIndex}
						messages={messages}
						setMessages={setMessages}
						showVideo={showVideo}
					/>
					<RightBar currentChat={currentChat} chatType={chatType} />
				</div>
			</div>

			{showCreateServer && (
				<ServerCreation
					showModal={showCreateServer}
					setShowModal={setShowCreateServer}
				/>
			)}
			{/* {notifications.length > 0 &&
				<div className="notifications-holder">

					{notifications.map((notification, i) =>
						<Notification notification={notification} key={i} />
					)
					}
				</div>
			} */}
			<audio ref={soundRef}>
				<source src={notificationSound}></source>
			</audio>
		</div>
	);
};

export default Home;
