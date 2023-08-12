// React and React Router hooks and types
import React, { useState, useEffect, SetStateAction, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

// Redux hooks and states stored in redux
import { useDispatch, useSelector } from "react-redux";
import { logoutReducer, setCurrentUser } from "@/redux/user/userSlice";

// Axios instance
import axiosInstance from "@/config/axiosInstance";

// Components
import FriendList from "../User/FriendList";

// Types
import { Channel, CurrentServer, RootState, User } from "@/lib/Types";

// Styles
import "./ChannelsList.css";
import { getChannels, getChatThreads, getSearchResults, getUserInfo } from "@/services/apiGET";
import { setChatType, setCurrentChat, setShowSidebar } from "@/redux/chat/currentChatSlice";
import { getRandomColor } from "@/utils/colorGenerator";
import Settings from "../User/Settings";
import UserProfile from "../User/UserProfile";

// Props & Peculiar Types
type Props = {
	dm: User[];
	setDm: React.Dispatch<SetStateAction<User[]>>;
	onlineStatusSocket: WebSocket | null;
};

const ChannelsList = ({
	dm,
	setDm,
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

	const onlineUsers = useSelector((state: RootState) => state.onlineUsers.users)

	const currentChat = useSelector((state: RootState) => state.chat.currentChat)



	const [channels, setChannels] = useState<Channel[]>([]);

	const [showSearch, setShowSearch] = useState<boolean>(false)
	// const [result, setResult] = useState<(User | Search)[]>([])
	const [result, setResult] = useState<any[]>([])
	const [searchError, setSearchError] = useState<string>('')
	const [showSettingsPopUp, setShowSettingsPopUp] = useState<boolean>(false)
	const [openSettings, setOpenSettings] = useState<boolean>(false)
	const [showProfilePopUp, setShowProfilePopUp] = useState<boolean>(false)
	const showSidebar = useSelector((state: RootState) => state.chat.showSidebar)

	const headerRef = useRef<HTMLDivElement>(null)
	const navRef = useRef<HTMLDivElement>(null)
	const userSectionRef = useRef<HTMLDivElement>(null)

	const [userSectionHeight, setUserSectionHeight] = useState<number | null>(null);

	const currentUser = useSelector((state: RootState) => state.user.loggedUser) || null

	useEffect(() => {
		if (userSectionRef.current && headerRef.current) {
			setUserSectionHeight(userSectionRef.current.clientHeight + headerRef.current.clientHeight);
		}
	}, [showSidebar]);

	useEffect(() => {
		if (userSectionHeight !== null && navRef.current && userSectionRef.current) {
			userSectionRef.current.style.width = `${navRef.current.clientWidth}px`
			navRef.current.style.height = `calc(100vh - ${userSectionHeight}px)`;
		}
	}, [userSectionHeight]);


	const randomColor = getRandomColor()
	// Function to get details of logged in user
	const fetchUserInfo = async (userId: number) => {
		try {
			const userInfo = await getUserInfo(userId)
			if (userInfo) dispatch(setCurrentUser(userInfo))
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
				dispatch(setCurrentChat(null))
			}
		} else {
			// Get channels of the selected server
			const channels = await getChannels(serverId)
			if (channels) {
				setChannels(channels)
				dispatch(setCurrentChat(channels[0].id))
			}
		}
	}

	useEffect(() => {
		fetchServerInfo(serverId!)
	}, [serverId]);


	const fetchResults = async (query: string) => {
		const result = await getSearchResults(query)
		if (result) {

			setSearchError('')
			setResult(result)
		} else {
			setSearchError('No users found')
		}
	}

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		let query = e.target.value.trim()
		if (query != '')
			fetchResults(query)
		else {
			setResult([])
			setSearchError('No users found')
		}
	}


	return (
		<>
			<div className="secondary-sidebar">
				<div className="secondary-sidebar_header" ref={headerRef}>
					<button className="search-toggler" onClick={() => setShowSearch(true)}>Find or start a conversation</button>
				</div>

				{showSearch &&
					<div className="main-search">
						<div className="search-box">
							<button
								className="close-modal"
								role="button"
								onClick={() => setShowSearch(false)}
							>
								<svg
									aria-hidden="true"
									role="img"
									className="closeIcon-pSJDFz"
									width="24"
									height="24"
									viewBox="0 0 24 24"
								>
									<path
										fill="#80848e"
										d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"
									></path>
								</svg>
							</button>
							<input type="text" className="secondary-sidebar_header" placeholder="start typing"
								onChange={handleSearch}
							/>
							<div className="results">
								<ul className="search-results">
									{result.length > 0 ? result.map((item) =>
										<li
											className="channel-list_item"
											onClick={() => {
												dispatch(setShowSidebar(false))
												dispatch(setCurrentChat(null))
											}}
										>
											<div className={`channel dm`}>
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
												<span className="channel-name">{item.username}</span>
											</div>
										</li>
									) : (
										<div className="no-users">
											<img src="/b36de980b174d7b798c89f35c116e5c6.svg" alt="" />
											{searchError != '' ?
												<p>{searchError}</p>
												: <p>Start Typing to search</p>
											}
										</div>
									)}
								</ul>
							</div>
						</div>
					</div>
				}
				<nav className="channel-list" ref={navRef}>
					{serverId === "dm" && (
						<li
							className="channel-list_item"
							onClick={() => {
								dispatch(setShowSidebar(false))
								dispatch(setCurrentChat(null))
							}}
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
							chatList={true}
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
												dispatch(setChatType('channel'))
												dispatch(setCurrentChat(filteredChannel.id))
												dispatch(setShowSidebar(false))
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

				<div className="user-section" ref={userSectionRef}>
					<div className="call-details"></div>
					<div className="user-detail">
						<li
							className="channel-list_item dark"
							onClick={() => {
								dispatch(setCurrentChat(null))
							}}
						>
							<div className='channel dm'>

								<div className={`profile-pop pop-up ${showProfilePopUp ? 'show' : ''}`}>
									<UserProfile currentUser={currentUser} color={randomColor} />
								</div>


								<div className="user-meta" onClick={() => setShowProfilePopUp(!showProfilePopUp)}>

									<div className={`online-indicator ${onlineUsers?.includes(currentUser?.id + '') ? 'online' : 'offline'}`}></div>
									{currentUser?.profile?.avatar ? (
										<img
											className="channel-avatar avatar"
											src={currentUser?.profile?.avatar}
											alt=""
										/>
									) : (
										<div className="channel-avatar avatar name" style={{ backgroundColor: randomColor }}>
											<span className="head">
												{currentUser?.username.charAt(0).toUpperCase()}
											</span>
										</div>
									)}
									<span className="channel-name">{currentUser?.username}</span>

								</div>
								<div className="settings-icon">
									<div className={`settings-pop pop-up ${showSettingsPopUp ? 'show' : ''}`}>
										<li className="pop-up_item" onClick={() => setOpenSettings(!openSettings)}>Settings</li>
										<li className="pop-up_item" onClick={logout}>Logout</li>
									</div>
									<div className="icon-wrapper" onClick={() => setShowSettingsPopUp(!showSettingsPopUp)}>
										<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M580.231-63.079q-23.461 0-39.423-16.153-15.961-16.154-15.961-39.231v-258.46q0-23.077 15.961-39.23 15.962-16.154 39.423-16.154h258.46q23.077 0 39.231 16.154 16.153 16.153 16.153 39.23v258.46q0 23.077-16.153 39.23-16.154 16.154-39.231 16.154h-258.46Zm0-55.384h258.46v-29.692q-23.077-28.692-56.384-45.654-33.308-16.961-72.846-16.961-39.538 0-73.038 16.961-33.5 16.962-56.192 45.654v29.692Zm129.23-129.23q23.077 0 39.231-16.154 16.153-16.153 16.153-39.23 0-23.077-16.153-39.231-16.154-16.153-39.231-16.153-23.461 0-39.423 16.153-15.961 16.154-15.961 39.231t15.961 39.23q15.962 16.154 39.423 16.154ZM480-480Zm-1.154-112.691q-46.692 0-79.691 32.807-33 32.808-33 79.884 0 36.461 19.769 64.461 19.769 27.999 51.23 40.845v-51.845q-11-8.615-18.308-23.73-7.307-15.116-7.307-29.731 0-27.846 19.73-47.577 19.731-19.73 47.577-19.73 16.846 0 31.077 7.423 14.231 7.423 22.846 19.884h50.614q-11.846-32.076-40.153-52.384-28.308-20.307-64.384-20.307Zm-78.153 492.69-18.077-120.231q-20.538-7-44.231-20.346-23.692-13.346-40.846-28.27l-111.846 50.923-79.922-141.306 101.077-74.384q-2-10.539-2.885-23-.885-12.462-.885-23 0-10.154.885-22.616t2.885-24.154l-101.077-74.769 79.922-140.152 111.461 50.154q18.308-14.924 41.231-28.078 22.924-13.154 43.847-19.538l18.461-121.231h158.614l18.077 120.615q22.077 8.154 44.154 20.231 22.077 12.077 39.769 28.001l113.384-50.154 79.538 140.152-104.538 78.077q0 2.384.192 2.346.192-.038.577.731h-44.845q-1-6.231-2-12.154T701-544.307l93.23-69-40-70.847-105.615 45.231q-21.077-23.692-50.846-41.769Q568-698.769 536.461-703l-13.615-111.615h-85.692l-13.231 111.231q-33.23 6.615-61.192 22.653-27.961 16.039-52.115 41.424L205.77-684.154l-40 70.847 92.461 67.846q-4.385 15.846-6.692 32.153-2.308 16.308-2.308 33.693 0 16.615 2.308 32.538 2.307 15.923 6.307 32.154l-92.076 68.23 40 70.847 104.461-44.847q25.231 25.616 57.962 42.347 32.73 16.73 68.961 24.73v153.615h-36.461Z" /></svg>
									</div>
								</div>
							</div>
						</li>
					</div>
				</div>
			</div>

			{openSettings && <Settings setShowSettings={setOpenSettings} />}
		</>
	);
};

export default ChannelsList;
