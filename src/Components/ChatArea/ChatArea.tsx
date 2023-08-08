// React hooks and types
import { useState, useEffect } from "react";
import { ChangeEvent, SetStateAction } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { setFriendsList, setPendingRequests } from "@/redux/chat/friendsSlice";

// Components
import ChatComponent from "./ChatComponent";
import MessageInput from "./MessageInput";
import FriendList from "../User/FriendList";

// AxiosInstance and constants
import { wsHead } from "@/config/Constants";
import { getFriends, getPendingRequests, getUsers } from "@/services/apiGET";

// Types
import { Message, RootState, User } from "@/lib/Types";

// Styles
import "./ChatArea.css";
import { base64ToFile, convertFileToBase64, getFileTypeFromMimeType } from "@/utils/FileHandlers";
import VideoCall from "@/page/VideoCall";

// Props & Peculiar Types
interface Props {
	currentChat?: number | null;
	setCurrentChat: React.Dispatch<SetStateAction<number | null>>;
	friends: User[];
	setFriends: React.Dispatch<SetStateAction<User[]>>;
	active: string;
	chatType: string;
	dm: User[];
	setDm: React.Dispatch<SetStateAction<User[]>>;
	messages: Message[];
	setMessages: React.Dispatch<SetStateAction<Message[]>>;
	searchResults: number[];
	highlightedMessageIndex: number;
	showVideo: boolean;
}

type SelectedFile = {
	file: File;
	fileName: string;
	fileType?: "image" | "video" | "application";
	fileUrl?: string;
}

const ChatArea = ({
	currentChat,
	setCurrentChat,
	friends,
	setFriends,
	active,
	dm,
	setDm,
	chatType,
	messages,
	setMessages,
	searchResults,
	highlightedMessageIndex,
	showVideo,
}: Props) => {
	// Current Server
	const serverId = useSelector(
		(state: RootState) => state.server.currentServer
	);

	// Logged in user id
	const userId = useSelector((state: RootState) => state.user.userId);

	const cachedFriends =
		useSelector((state: RootState) => state.friends.friendsList) || [];

	const onlineUsers = useSelector((state: RootState) => state.onlineUsers.users) || []

	const dispatch = useDispatch();

	// States for WebSocket and Messages
	const [chatSocket, setChatSocket] = useState<WebSocket | null>(null);
	const [messageInput, setMessageInput] = useState("");
	const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);

	// Function to set friends details such as suggestions, friend requests, and active friends
	const fetchFriendsData = async () => {
		if (active === "") {
			if (onlineUsers?.length > 0) {
				// setFriends(onlineUsers)
			}
			return;
		}

		if (active === "friends" && cachedFriends.length > 0) {
			setFriends(cachedFriends);
			return;
		}

		try {
			if (active === "friends") {
				const friendsList = await getFriends()
				if (friendsList) {
					dispatch(setFriendsList(friendsList));
					setFriends(friendsList);
				}
			} else if (active === "pending") {
				const pendingRequests = await getPendingRequests()
				if (pendingRequests) {
					dispatch(setPendingRequests(pendingRequests));
					setFriends(pendingRequests);
				}
			} else if (active === "suggestions") {
				const users = await getUsers();
				if (users) setFriends(users);
			} else if (active === "blocked") {
				console.log("empty");
			}
		} catch (error) {
			console.error("Error fetching friends data:", error);
		}
	};

	useEffect(() => {
		setFriends([]);
		fetchFriendsData();

	}, [active, cachedFriends, dispatch]);


	// Function to handle sending messages over the socket connection
	useEffect(() => {
		setMessageInput('')
		// Connect to the WebSocket server
		const socket = new WebSocket(
			wsHead +
			"chat/" +
			`?token=${localStorage.getItem(
				"access_token"
			)}&chatType=${chatType}&channel=${currentChat}`
		);

		// Event listener for WebSocket connection opens
		socket.onopen = () => {
			console.log("Connected to WebSocket");
			setChatSocket(socket);
		};

		// Event listener for WebSocket messages received
		socket.onmessage = (event) => {
			const receivedData = JSON.parse(event.data);

			if (receivedData.message_type === 'chat') {
				let newReceivedFiles = null;
				//  handle received files
				if (receivedData.files && receivedData.files.length > 0) {
					let file_thumb = "/adobe.jpg";
					newReceivedFiles = receivedData.files.map((fileData: any) => ({
						file: base64ToFile(fileData.fileData, fileData.fileName),
						fileName: fileData.fileName,
						fileType: fileData.fileType,
						file_thumb,
					}));
				}

				// Handling Messages for group chat
				if (receivedData.is_group_chat) {
					const receivedMessage: Message = {
						message: receivedData.message,
						sender: receivedData.sender,
						profilePic: receivedData.profile_pic,
						username: receivedData.username,
						group: receivedData.group,
						timestamp: receivedData.timestamp,
						is_group_chat: receivedData.is_group_chat,
						files: newReceivedFiles,
					};

					// Update messages if new message is received in the active group
					if (
						receivedMessage.group === currentChat &&
						receivedData.is_group_chat === true
					)
						setMessages((prevMessages) => [...prevMessages, receivedMessage]);
				}
				// Handle messages from users
				else {
					const receivedMessage: Message = {
						message: receivedData.message,
						files: newReceivedFiles,
						sender: receivedData.sender,
						username: receivedData.username,
						receiver: receivedData.receiver,
						timestamp: receivedData.timestamp,
						is_group_chat: receivedData.is_group_chat,
					};
					// Update messages if message received from the current chat
					console.log(
						currentChat,
						receivedMessage.sender,
						receivedMessage.receiver
					);
					if (
						(receivedMessage.sender === currentChat &&
							receivedMessage.receiver === userId) ||
						(receivedMessage.sender === userId &&
							receivedMessage.receiver === currentChat)
					) {
						setMessages((prevMessages) => [...prevMessages, receivedMessage]);
					}
				}
			}
		};

		// Cleanup function on component unmount
		return () => {
			socket.close();
		};
	}, [chatType, currentChat]);


	// Update selectedFiles array when a new file is selected
	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newImages = Array.from(e.target.files);
			const updatedFiles = newImages.map((file) => ({
				file,
				fileName: file.name,
				fileType: getFileTypeFromMimeType(file.type),
				fileUrl: URL.createObjectURL(file),
			}));
			setSelectedFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
		}
	};


	// Function to send messages
	const handleSendMessage = async () => {
		// Check and send message to user if socket is not connected
		if (!chatSocket || chatSocket.readyState !== WebSocket.OPEN) {
			console.log("WebSocket connection is not open.");
			return;
		}

		// Check if message is empty
		if (messageInput.trim() === "" && selectedFiles.length === 0) {
			console.log("Cannot send an empty message.");
			return;
		}

		try {
			// Convert selected media to Base64 strings
			const filePromises = selectedFiles.map((file) =>
				convertFileToBase64(file.file)
			);
			const base64Files = await Promise.all(filePromises);

			// Add details to message object to be send
			const message = {
				message_type: 'chat',
				message: messageInput,
				sender: userId,
				server: serverId,
				chatType,
				channel: currentChat,
				timestamp: Date.now(),
				files: base64Files.filter((fileData) => fileData !== null),
				is_group_chat: chatType === "group" ? true : false,
			};

			// Send the message to the WebSocket server
			chatSocket.send(JSON.stringify(message));

			// Clear the message input field
			setMessageInput("");
			setSelectedFiles([]);
		} catch (error) {
			console.log("Error converting media to Base64:", error);
		}
	};

	return (
		<div className="chat-area">
			{/* show chat area if there is an active chat */}
			{currentChat ? (
				<>
					{showVideo && <VideoCall chatSocket={chatSocket!} currentChat={currentChat} />}
					<ChatComponent
						messages={messages}
						setMessages={setMessages}
						currentChat={currentChat}
						chatType={chatType}
						searchResults={searchResults}
						highlightedMessageIndex={highlightedMessageIndex}
					/>
					<MessageInput
						messageInput={messageInput}
						setMessageInput={setMessageInput}
						handleSendMessage={handleSendMessage}
						selectedFiles={selectedFiles}
						handleImageChange={handleImageChange}
					// chatSocket={chatSocket!}
					// chatType={chatType}
					/>
				</>
			) : (
				// show friends details if there is no active chat
				<>
					{friends.length > 0 ? (
						<FriendList
							users={friends}
							friends={friends}
							dm={dm}
							setDm={setDm}
							setCurrentChat={setCurrentChat}
							active={active}
							showIcons={true}
						/>
					) : null}
				</>
			)}
		</div>
	);
};

export default ChatArea;
