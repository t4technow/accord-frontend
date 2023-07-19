import { FormEvent, SetStateAction } from "react";

import ChatComponent from "./ChatComponent";

import "./ChatArea.css";
import MessageInput from "./MessageInput";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Message, RootState, User } from "@/lib/Types";
import axiosInstance from "@/config/axiosInstance";

interface Props {
	serverId: number | string;
	currentChat?: number | null;
	setCurrentChat: React.Dispatch<SetStateAction<number | null>>;
	friends: User[];
	setFriends: React.Dispatch<SetStateAction<User[]>>;
	active: string;
	dm: User[];
	setDm: React.Dispatch<SetStateAction<User[]>>;
}

const ChatArea = ({
	currentChat,
	setCurrentChat,
	serverId,
	friends,
	setFriends,
	active,
	dm,
	setDm,
}: Props) => {
	const userId = useSelector((state: RootState) => state.user.userId);

	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [messages, setMessages] = useState<Message[] | []>([]);
	const [messageInput, setMessageInput] = useState("");

	useEffect(() => {
		setFriends([]);
		if (active === "") {
			console.log("empty");
		}

		if (active === "friends") {
			axiosInstance.get("friends/").then((res) => {
				setFriends(res.data);
				console.log(res.data);
			});
		}

		if (active === "pending") {
			axiosInstance
				.get("pending-requests/")
				.then((res) => {
					setFriends(res.data);
					console.log(res.data);
				})
				.catch((err) => {
					if (err.response.status === "400") setFriends([]);
				});
		}

		if (active === "suggestions") {
			axiosInstance.get("users/").then((res) => {
				setFriends(res.data);
				console.log(res.data);
			});
		}

		if (active === "blocked") {
			console.log("empty");
		}
	}, [active]);

	useEffect(() => {
		// Connect to the WebSocket server
		const socket = new WebSocket(
			"ws://127.0.0.1:8000/chat/" +
				`?token=${localStorage.getItem("access_token")}`
		);

		// Event listener for WebSocket connection opens
		socket.onopen = () => {
			console.log("Connected to WebSocket");
			setSocket(socket);
		};

		// Event listener for WebSocket messages received
		socket.onmessage = (event) => {
			const receivedData = JSON.parse(event.data);
			console.log(receivedData);
			const receivedMessage: Message = {
				message: receivedData.message,
				sender: receivedData.sender,
				username: receivedData.username,
				timestamp: receivedData.timestamp,
			};
			setMessages((prevMessages) => [...prevMessages, receivedMessage]);
			axiosInstance.get<User[]>("get-chat-threads/").then((res) => {
				console.log(res.data);
				if (typeof res.data != typeof "string") {
					setDm(res.data);
				}
			});
		};

		// Cleanup function on component unmount
		return () => {
			socket.close();
		};
	}, []);

	const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!socket || socket.readyState !== WebSocket.OPEN) {
			console.log("WebSocket connection is not open.");
			return;
		}

		if (messageInput.trim() === "") {
			console.log("Cannot send an empty message.");
			return;
		}
		const message = {
			message: messageInput,
			sender: userId,
			server: serverId,
			channel: currentChat,
			timestamp: Date.now(),
		};

		// Send the message to the WebSocket server
		socket.send(JSON.stringify(message));

		// Clear the message input field
		setMessageInput("");
	};

	return (
		<div className="chat-area">
			{currentChat ? (
				<>
					<ChatComponent
						messages={messages}
						setMessages={setMessages}
						currentChat={currentChat}
						serverId={serverId}
					/>
					<MessageInput
						messageInput={messageInput}
						setMessageInput={setMessageInput}
						handleSendMessage={handleSendMessage}
					/>
				</>
			) : (
				<>
					{friends.length > 0
						? friends.map((friend, i) => (
								<li
									className="channel-list_item"
									key={friend.friend_id ? friend.friend_id : friend.id}
								>
									<div className="channel dm friends-list_item">
										<div className="friends-list_item_info">
											{friend.profile?.avatar ||
											friend.friend_profile?.avatar ? (
												<img
													className="channel-avatar avatar"
													src={
														friend.friend_profile?.avatar
															? friend.friend_profile.avatar
															: friend.profile?.avatar
													}
													alt=""
												/>
											) : (
												<div className="channel-avatar avatar name">
													<span className="head">
														{friend.username.charAt(0).toUpperCase()}
													</span>
												</div>
											)}{" "}
											<span className="channel-name">{friend?.username}</span>
										</div>
										{friend.friend_id ? (
											<>
												{active === "pending" ? (
													<>
														{friend?.type === "send" ? (
															<span>awaiting confirmation</span>
														) : (
															<div
																className="add-friend"
																onClick={() =>
																	axiosInstance
																		.get(`accept-request/${friend.friend_id}/`)
																		.then((res) => {
																			setDm([...dm, res.data]);
																			friends.splice(i, 1);
																		})
																}
															>
																<svg
																	className="icon-1WVg4I"
																	aria-hidden="true"
																	role="img"
																	width="24"
																	height="24"
																	viewBox="0 0 24 24"
																>
																	<path
																		fill="currentColor"
																		fillRule="evenodd"
																		clipRule="evenodd"
																		d="M8.99991 16.17L4.82991 12L3.40991 13.41L8.99991 19L20.9999 7.00003L19.5899 5.59003L8.99991 16.17Z"
																	></path>
																</svg>
															</div>
														)}
													</>
												) : (
													<div
														className="add-friend"
														onClick={() => {
															setCurrentChat(friend.friend_id);
														}}
													>
														<svg
															className="icon-1WVg4I"
															aria-hidden="true"
															role="img"
															width="24"
															height="24"
															viewBox="0 0 24 24"
															fill="none"
														>
															<path
																fill="currentColor"
																d="M4.79805 3C3.80445 3 2.99805 3.8055 2.99805 4.8V15.6C2.99805 16.5936 3.80445 17.4 4.79805 17.4H7.49805V21L11.098 17.4H19.198C20.1925 17.4 20.998 16.5936 20.998 15.6V4.8C20.998 3.8055 20.1925 3 19.198 3H4.79805Z"
															></path>
														</svg>
													</div>
												)}
											</>
										) : (
											<div
												className="add-friend"
												onClick={() => {
													axiosInstance.get("add-friend/" + friend.id);
													dm.splice(i, 1);
												}}
											>
												<svg
													className="icon-1WVg4I"
													aria-hidden="true"
													role="img"
													width="24"
													height="24"
													viewBox="0 0 24 24"
												>
													<path
														fill="currentColor"
														fillRule="evenodd"
														clipRule="evenodd"
														d="M8.99991 16.17L4.82991 12L3.40991 13.41L8.99991 19L20.9999 7.00003L19.5899 5.59003L8.99991 16.17Z"
													></path>
												</svg>
											</div>
										)}
									</div>
								</li>
						  ))
						: null}
				</>
			)}
		</div>
	);
};

export default ChatArea;
