// React hooks and types
import { useState, useEffect } from "react";
import { ChangeEvent, FormEvent, SetStateAction } from "react";

// Redux
import { useSelector } from "react-redux";

// Components
import ChatComponent from "./ChatComponent";
import MessageInput from "./MessageInput";
import FriendList from "../User/FriendList";

// AxiosInstance and constants
import axiosInstance from "@/config/axiosInstance";
import { chatBase, wsHead } from "@/config/Constants";

// Types
import { Message, RootState, User } from "@/lib/Types";

// Styles
import "./ChatArea.css";

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
}

// type FileType = "document" | "image" | "video";

const ChatArea = ({
	currentChat,
	setCurrentChat,
	friends,
	setFriends,
	active,
	dm,
	setDm,
	chatType,
}: Props) => {
	// Current Server
	const serverId = useSelector(
		(state: RootState) => state.server.currentServer
	);

	// Logged in user id
	const userId = useSelector((state: RootState) => state.user.userId);

	// States for WebSocket and Messages
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [messages, setMessages] = useState<Message[] | []>([]);
	const [messageInput, setMessageInput] = useState("");

	// Function to set friends details such as suggestions, friend requests, and active friends
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

	// state for received files

	// Function to handle sending messages over the socket connection
	useEffect(() => {
		// Connect to the WebSocket server
		const socket = new WebSocket(
			wsHead +
				chatBase +
				"/chat/" +
				`?token=${localStorage.getItem(
					"access_token"
				)}&chatType=${chatType}&channel=${currentChat}`
		);

		// Event listener for WebSocket connection opens
		socket.onopen = () => {
			console.log("Connected to WebSocket");
			setSocket(socket);
		};

		// Event listener for WebSocket messages received
		socket.onmessage = (event) => {
			const receivedData = JSON.parse(event.data);

			let newReceivedFiles = null;
			//  handle received files
			if (receivedData.files && receivedData.files.length > 0) {
				newReceivedFiles = receivedData.files.map((fileData: any) => ({
					file: base64ToFile(fileData.fileData, fileData.fileName),
					fileName: fileData.fileName,
					fileType: fileData.fileType,
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

			// Update chat list when new message is received
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
	}, [chatType, currentChat]);

	// function to convert base64string back to file
	const base64ToFile = (fileData: string, fileName: string): File => {
		const byteString = atob(fileData);
		const arrayBuffer = new ArrayBuffer(byteString.length);
		const uint8Array = new Uint8Array(arrayBuffer);

		for (let i = 0; i < byteString.length; i++) {
			uint8Array[i] = byteString.charCodeAt(i);
		}

		const file = new File([uint8Array], fileName, {
			type: "application/octet-stream",
		});
		return file;
	};

	// States for Image uploading
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [fileUrls, setFileUrls] = useState<string[]>([]);

	// Create blob for all selected images whenever a selected images change
	useEffect(() => {
		if (selectedFiles.length > 0) {
			const newFileUrls = selectedFiles.map((image) =>
				URL.createObjectURL(image)
			);
			setFileUrls(newFileUrls);
		}
	}, [selectedFiles]);

	// Update selectedFiles array when a new file is selected
	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newImages = Array.from(e.target.files);
			setSelectedFiles((prevImages) => [...prevImages, ...newImages]);
		}
	};

	// const [selectedFiles, setSelectedFiles] = useState<
	// 	{
	// 		file: File;
	// 		fileName: string;
	// 		fileType?: "image" | "video" | "application";
	// 	}[]
	// >([]);
	// const [fileUrls, setFileUrls] = useState<string[]>([]);

	// // Create blob for all selected images whenever a selected images change
	// useEffect(() => {
	// 	if (selectedFiles.length > 0) {
	// 		const newFileUrls = selectedFiles.map((image) =>
	// 			URL.createObjectURL(image)
	// 		);
	// 		setFileUrls(newFileUrls);
	// 	}
	// }, [selectedFiles]);

	// Update selectedFiles array when a new file is selected
	// const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
	// 	if (e.target.files) {
	// 		const newImages = Array.from(e.target.files);
	// 		const updatedFiles = newImages.map((file) => ({
	// 			file,
	// 			fileName: file.name,
	// 			fileType: getFileTypeFromMimeType(file.type),
	// 		}));
	// 		setSelectedFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
	// 	}
	// };

	// const getFileTypeFromMimeType = (
	// 	mimeType: string
	// ): "image" | "video" | "application" => {
	// 	const typePrefix = mimeType.split("/")[0];
	// 	if (typePrefix === "image") {
	// 		return "image";
	// 	} else if (typePrefix === "video") {
	// 		return "video";
	// 	} else {
	// 		return "application";
	// 	}
	// };

	// Function to send messages
	const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Check and send message to user if socket is not connected
		if (!socket || socket.readyState !== WebSocket.OPEN) {
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
				convertFileToBase64(file)
			);
			const base64Files = await Promise.all(filePromises);

			// Add details to message object to be send
			const message = {
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
			socket.send(JSON.stringify(message));

			// Clear the message input field
			setMessageInput("");
			setSelectedFiles([]);
		} catch (error) {
			console.log("Error converting media to Base64:", error);
		}
	};

	// Function to convert a file to Base64 with file name
	const convertFileToBase64 = (
		file: File
	): Promise<{ fileData: string; fileName: string } | null> => {
		return new Promise((resolve, reject) => {
			console.log("reading");
			const reader = new FileReader();
			console.log("read");
			reader.onload = (event) => {
				if (event.target && typeof event.target.result === "string") {
					const fileType = file.type.split("/")[0]; // Get the type of file (e.g., image, video, document)
					if (
						fileType === "image" ||
						fileType === "video" ||
						fileType === "application"
					) {
						const base64String = event.target.result.split(",")[1];
						const fileData = {
							fileData: base64String,
							fileName: file.name, // Include the actual file name in the result
							fileType,
						};
						resolve(fileData);
					} else {
						console.log("Unsupported file type:", fileType);
						resolve(null); // Return null for unsupported file types
					}
				} else {
					console.log(
						"Invalid file data:",
						event.target && event.target.result
					);
					resolve(null); // Return null for invalid file data
				}
			};
			reader.onerror = (error) => {
				console.log("Error reading file:", error);
				reject(error);
			};
			reader.readAsDataURL(file);
		});
	};

	return (
		<div className="chat-area">
			{/* show chat area if there is an active chat */}
			{currentChat ? (
				<>
					<ChatComponent
						messages={messages}
						setMessages={setMessages}
						currentChat={currentChat}
						chatType={chatType}
						selectedFiles={selectedFiles}
					/>
					<MessageInput
						messageInput={messageInput}
						setMessageInput={setMessageInput}
						handleSendMessage={handleSendMessage}
						selectedFiles={selectedFiles}
						fileUrls={fileUrls}
						handleImageChange={handleImageChange}
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
