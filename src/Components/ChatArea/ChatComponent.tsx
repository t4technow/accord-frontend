// React hooks and types
import React, { useEffect, useRef, useState } from "react";

// Redux
import { useSelector } from "react-redux";

// AxiosInstance and constants
import axiosInstance from "@/config/axiosInstance";
import { imageBase } from "@/config/Constants";

// Helper Functions
import { convertTimestampToTimeFormat as formatTime } from "@/Helper/FormatTime";
import { formatDate, getDayLabel } from "@/Helper/FormatDate";

// Types
import { Message, RootState } from "@/lib/Types";
import {
	extractLinkFromMessage,
	getMessageWithLinkAsHTML,
} from "@/Helper/extractLink";
import ExternalSiteDetails from "../LinkDetails/LinkDetails";

// Props & Peculiar Types
interface Props {
	messages: Message[];
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
	currentChat: number | null;
	chatType: string;
	selectedFiles: File[];
}

const ChatComponent = ({
	messages,
	setMessages,
	currentChat,
	chatType,
	selectedFiles,
}: Props) => {
	const [openFile, setOpenFile] = useState<Message | null>(null);

	// Current Server
	const serverId = useSelector(
		(state: RootState) => state.server.currentServer
	);

	// Logged in user id
	const loggedUser = useSelector((state: RootState) => state.user.userId);

	// Function to get messages whenever user clicks on a new user or group
	useEffect(() => {
		// User messages
		if (serverId === "dm" && currentChat && chatType === "user") {
			axiosInstance.get("get-thread-messages/" + currentChat).then((res) => {
				setMessages(res.data);
			});
		} else if (serverId === "dm" && currentChat && chatType === "group") {
			// Group Messages
			axiosInstance.get("get-group-messages/" + currentChat).then((res) => {
				setMessages(res.data);
			});
		}
	}, [currentChat, chatType]);

	// Function to automatically scroll to the last message
	const messagesRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
		}
	}, [messages, selectedFiles.length]);

	return (
		<div className="messages-holder">
			{openFile ? (
				<div className="view-file">
					<button
						className="close-modal"
						role="button"
						onClick={() => setOpenFile(null)}
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
					{openFile.file_type === "image" ? (
						<img src={(imageBase + openFile.file) as string} />
					) : (
						<video
							src={(imageBase + openFile.file) as string}
							autoPlay
							controls
						></video>
					)}
				</div>
			) : null}
			<div
				className={`messages ${chatType === "group" ? "group" : ""}`}
				ref={messagesRef}
			>
				{messages &&
					messages.map((message, index) => {
						// check if message is from a different user than the last message
						const isNewUser =
							index === 0 || messages[index - 1].sender !== message.sender;

						// check if it is the last consecutive message of a user
						const isLastMessage =
							index === messages.length - 1 ||
							messages[index + 1].sender !== message.sender;

						// check if message is received on different dates
						const isNewDate =
							index === 0 ||
							formatDate(messages[index - 1].timestamp) !==
								formatDate(message.timestamp);

						return (
							<React.Fragment key={JSON.stringify(message.timestamp)}>
								{/* Add date or day label if message dates are different  */}
								{isNewDate ? (
									<div className="orderby-date">
										<div className="date">{getDayLabel(message.timestamp)}</div>
									</div>
								) : null}

								<div
									className={`message-holder ${
										isNewUser &&
										chatType === "group" &&
										message.sender != loggedUser &&
										index > 0 &&
										messages[index - 1].sender != loggedUser
											? "mt-2"
											: ""
									}`}
								>
									{/* Add Profile photo to the last consecutive message by a user in group chat */}
									{chatType === "group" &&
									isLastMessage &&
									message.sender != loggedUser ? (
										<div className="profile-pic">
											{message.profilePic ? (
												<img
													className="channel-avatar avatar"
													src={imageBase + message.profilePic}
													alt=""
												/>
											) : (
												<span className="head">
													{message.username.charAt(0).toUpperCase()}
												</span>
											)}
										</div>
									) : null}

									<li
										className={`${
											loggedUser === message.sender ? "send" : "received"
										} message ${isLastMessage ? "after" : ""}`}
									>
										{isNewUser &&
										chatType === "group" &&
										message.sender != loggedUser ? (
											<span className="sender-name">{message.username}</span>
										) : null}

										{message.files &&
											message.files.length > 0 &&
											message.files?.map((fileData) => (
												<>
													{fileData.fileType === "image" && (
														<img
															className="message-image"
															src={URL.createObjectURL(fileData.file)}
															alt=""
															onClick={() => setOpenFile(message)}
														/>
													)}
													{fileData.fileType === "video" && (
														<video
															className="message-image"
															src={URL.createObjectURL(fileData.file)}
															onClick={() => setOpenFile(message)}
														/>
													)}
												</>
											))}

										{message.message != "" ? (
											<>
												{extractLinkFromMessage(message.message) ? (
													<>
														<ExternalSiteDetails
															url={extractLinkFromMessage(message.message)}
														/>
														<span
															className="message-content"
															dangerouslySetInnerHTML={getMessageWithLinkAsHTML(
																message.message
															)}
														></span>
													</>
												) : (
													<span className="message-content">
														{message.message}
													</span>
												)}
											</>
										) : message.file ? (
											<>
												{message.file_type === "image" && (
													<img
														className="message-image"
														src={imageBase + message.file}
														alt=""
														onClick={() => setOpenFile(message)}
													/>
												)}
												{message.file_type === "video" && (
													<video
														className="message-image"
														src={imageBase + message.file}
														onClick={() => setOpenFile(message)}
													/>
												)}
												{message.file_type === "application" && (
													<a href="" download={message.file.split("/").pop()}>
														{message.file.split("/").pop()}
													</a>
												)}
											</>
										) : null}
										<div className="message-meta">
											<span className="timestamp">
												{formatTime(message.timestamp)}
											</span>
										</div>
									</li>
								</div>
							</React.Fragment>
						);
					})}
			</div>
		</div>
	);
};

export default ChatComponent;
