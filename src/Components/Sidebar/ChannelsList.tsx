// React and React Router hooks and types
import React, { useState, useEffect, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

// Redux hooks and states stored in redux
import { useDispatch, useSelector } from "react-redux";
import { logoutReducer } from "@/redux/user/userSlice";

// Axios instance
import axiosInstance from "@/config/axiosInstance";

// Components
import FriendList from "../User/FriendList";

// Types
import { Channel, CurrentServer, RootState, User } from "@/lib/Types";

// Styles
import "./ChannelsList.css";
import { getChannels, getChatThreads, getUserInfo } from "@/services/apiGET";

// Props & Peculiar Types
type Props = {
	serverId?: number | string;
	currentChat: number | null;
	setCurrentChat: React.Dispatch<SetStateAction<number | null>>;
	dm: User[];
	setDm: React.Dispatch<SetStateAction<User[]>>;
	chatType?: string;
	setChatType: React.Dispatch<SetStateAction<string>>;
	onlineStatusSocket: WebSocket | null;
};

const ChannelsList = ({
	currentChat,
	setCurrentChat,
	dm,
	setDm,
	chatType,
	setChatType,
	onlineStatusSocket,
}: Props) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Logged in user id
	const loggedUserId = useSelector((state: RootState) => state.user.userId);

	// Current Server
	const serverId = useSelector(
		(state: RootState) => state.server.currentServer
	);

	const [channels, setChannels] = useState<Channel[]>([]);
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	// Function to get details of logged in user
	const fetchUserInfo = async (userId: number) => {
		try {
			const userInfo = await getUserInfo(userId)
			if (userInfo) setCurrentUser(userInfo)
		} catch (error) {
			console.log('Error fetching User Info', error)
		}
	}
	useEffect(() => {
		if (loggedUserId) fetchUserInfo(loggedUserId)
	}, []);

	// Function to logout
	const logout = () => {
		// blacklist current refresh token
		axiosInstance
			.post("user/logout/blacklist/", {
				refresh_token: localStorage.getItem("refresh_token"),
			})
			.then(() => {
				// Remove jwt tokens from local storage
				localStorage.removeItem("access_token");
				localStorage.removeItem("refresh_token");
				axiosInstance.defaults.headers["Authorization"] = null;

				onlineStatusSocket?.close()
				// user details from redux user state & redirect to login
				dispatch(logoutReducer());
				navigate("/user/login");
			});
	};

	// Function to get chats of current user
	const fetchServerInfo = async (serverId: CurrentServer) => {
		if (serverId === "dm") {
			// Get dms and groups if no server is selected
			const chats = await getChatThreads()
			if (chats && typeof chats != typeof "string") {
				setDm(chats);
				setCurrentChat(null)
			}
		} else {
			// Get channels of the selected server
			const channels = await getChannels(serverId)
			if (channels) {
				setChannels(channels)
				setCurrentChat(channels[0].id)
			}
		}
	}

	useEffect(() => {
		fetchServerInfo(serverId!)
	}, [serverId]);

	return (
		<div className="secondary-sidebar">
			<div className="secondary-sidebar_header">
				<button className="search-toggler">Find or start a conversation</button>
			</div>
			<nav className="channel-list">
				{serverId === "dm" && (
					<li
						className="channel-list_item"
						onClick={() => setCurrentChat(null)}
					>
						<div className={`${currentChat ? "" : "active"} channel dm`}>
							<svg
								x="0"
								y="0"
								className="icon-2xnN2Y"
								aria-hidden="true"
								role="img"
								width="24"
								height="24"
								viewBox="0 0 24 24"
							>
								<g fill="none" fillRule="evenodd">
									<path
										fill="currentColor"
										fillRule="nonzero"
										d="M0.5,0 L0.5,1.5 C0.5,5.65 2.71,9.28 6,11.3 L6,16 L21,16 L21,14 C21,11.34 15.67,10 13,10 C13,10 12.83,10 12.75,10 C8,10 4,6 4,1.5 L4,0 L0.5,0 Z M13,0 C10.790861,0 9,1.790861 9,4 C9,6.209139 10.790861,8 13,8 C15.209139,8 17,6.209139 17,4 C17,1.790861 15.209139,0 13,0 Z"
										transform="translate(2 4)"
									></path>
									<path d="M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z"></path>
								</g>
							</svg>
							<span className="channel-name">Friends</span>
						</div>
					</li>
				)}
				{serverId === "dm" ? (
					<FriendList
						users={dm}
						currentChat={currentChat}
						setCurrentChat={setCurrentChat}
						friendsList={true}
						chatType={chatType}
						setChatType={setChatType}
					/>
				) : (
					channels.length > 0 &&
					channels.map((channelType) => (
						<React.Fragment key={channelType.id}>
							<h2 className="channels-head">
								<span className="heading">{channelType.channel_type}</span>
								<span className="add">+</span>
							</h2>
							{channels
								.filter(
									(channel) => channel.channel_type === channelType.channel_type
								)
								.map((filteredChannel) => (
									<li
										className="channel-list_item"
										key={filteredChannel.id}
										onClick={() => {
											setChatType('channel')
											setCurrentChat(filteredChannel.id)
										}}
									>
										<div
											className={
												currentChat === filteredChannel.id
													? "channel active"
													: "channel"
											}
										>
											<svg
												width="24"
												height="24"
												viewBox="0 0 24 24"
												className="icon-2W8DHg"
												aria-hidden="true"
												role="img"
											>
												<path
													fill="currentColor"
													fillRule="evenodd"
													clipRule="evenodd"
													d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"
												></path>
											</svg>
											<span className="channel-name">
												{filteredChannel.name}
											</span>
										</div>
									</li>
								))}
						</React.Fragment>
					))
				)}
			</nav>

			<div className="user-section d-flex">
				<h4>{currentUser?.username}</h4>
				<button onClick={logout}>Logout</button>
			</div>
		</div>
	);
};

export default ChannelsList;
