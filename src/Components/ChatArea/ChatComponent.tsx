import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { imageBase } from "@/config/Constants";
import { convertTimestampToTimeFormat as formatTime } from "@/Helper/FormatTime";
import { formatDate, getDayLabel } from "@/Helper/FormatDate";
// import ExternalSiteDetails from "../LinkDetails/LinkDetails";
import {
	extractLinkFromMessage,
	getMessageWithLinkAsHTML,
} from "@/Helper/extractLink";
import { renderImagesInMessage } from "@/Helper/extractImages";
import { Message, RootState } from "@/lib/Types";
import {
	getChannelMessages,
	getGroupMessages,
	getUserMessages,
} from "@/services/apiGET";

interface Props {
	messages: Message[];
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
	searched: boolean;
	searchQuery: string;
	searchResults: number[];
	highlightedMessageIndex: number;
}

const ChatComponent = ({
	messages,
	setMessages,
	searched,
	searchQuery,
	searchResults,
	highlightedMessageIndex,
}: Props) => {
	const chatType = useSelector((state: RootState) => state.chat.chatType);
	const currentChat = useSelector((state: RootState) => state.chat.currentChat);
	const onlineUsers = useSelector((state: RootState) => state.onlineUsers.users)

	const [openFile, setOpenFile] = useState<Message | null>(null);

	const messagesRef = useRef<HTMLDivElement>(null);

	const serverId = useSelector(
		(state: RootState) => state.server.currentServer
	);

	const loggedUser = useSelector((state: RootState) => state.user.userId);

	const fetchMessages = useCallback(async () => {
		if (!currentChat) return;
		try {
			if (serverId === "dm" && chatType === "user") {
				const userMessages = await getUserMessages(currentChat);
				if (userMessages) setMessages(userMessages);
				else setMessages([])
			} else if (serverId === "dm" && chatType === "group") {
				const groupMessages = await getGroupMessages(currentChat);
				if (groupMessages) setMessages(groupMessages);
				else setMessages([])
			} else if (chatType === "channel") {
				const channelMessages = await getChannelMessages(currentChat);
				if (channelMessages) setMessages(channelMessages);
				else setMessages([])
			}
		} catch (error) {
			console.log("Error fetching messages", error);
		}
		console.log("called");
	}, [currentChat, chatType, serverId]);

	useEffect(() => {
		fetchMessages();
	}, [fetchMessages]);

	useEffect(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
		}
	}, [messages]);

	useEffect(() => {
		if (messagesRef.current && highlightedMessageIndex >= 0) {
			const highlightedMessages = messagesRef.current.getElementsByClassName(
				"highlight current-result"
			);
			Array.from(highlightedMessages).forEach((message) => {
				message.classList.remove("current-result");
			});
			const highlightedMessage = messagesRef.current.getElementsByClassName(
				"highlight"
			)[highlightedMessageIndex] as HTMLElement;
			if (highlightedMessage) {
				highlightedMessage.scrollIntoView({
					behavior: "smooth",
					block: "center",
				});
				highlightedMessage.classList.add("current-result");
			}
		}
	}, [highlightedMessageIndex]);

	const processMessageContent = useCallback((message: string) => {
		const imgPattern = /<img.*?src=["'](.*?)["'].*?>/g;
		const urlPattern = /(?<!['"=])(https?:\/\/[^\s]+)/g;

		const images = message.match(imgPattern);
		const link = extractLinkFromMessage(message);

		if (images || link) {
			const processedContent = message.replace(imgPattern, (imgTag) => {
				return renderImagesInMessage(imgTag)[0].content;
			});

			const replacedMessage = processedContent.replace(
				urlPattern,
				(match) =>
					`<a class="message-link" href="${match}" target="_blank" rel="nofollow">${match}</a>`
			);

			return replacedMessage;
		}

		return message;
	}, []);

	return (
		<div className="messages-holder">
			{searched && (searchQuery != '' && searchResults.length === 0) ?
				<div className="date no-results">
					No message found
				</div>
				: null
			}
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
						<img src={(imageBase + openFile.file) as string} alt={openFile.file_name} />
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
						const isNewUser =
							index === 0 || messages[index - 1].sender !== message.sender;
						const isLastMessage =
							index === messages.length - 1 ||
							messages[index + 1].sender !== message.sender;
						const isNewDate =
							index === 0 ||
							formatDate(messages[index - 1].timestamp) !==
							formatDate(message.timestamp);

						const isHighlighted = searchResults.includes(index);
						const hasHtmlTags = /<img[\s\S]*>/i.test(message.message);

						if (onlineUsers?.includes(String(currentChat)))
							message.delivery_status = true
						return (
							<React.Fragment key={JSON.stringify(message.timestamp)}>
								{isNewDate ? (
									<div className="orderby-date">
										<div className="date">{getDayLabel(message.timestamp)}</div>
									</div>
								) : null}

								<div
									className={`message-holder ${isNewUser &&
										chatType === "group" &&
										message.sender != loggedUser &&
										index > 0 &&
										messages[index - 1].sender != loggedUser
										? "mt-2"
										: ""
										}`}
								>
									{chatType === "group" &&
										isLastMessage &&
										message.sender != loggedUser ? (
										<div className="channel-avatar avatar name profile-pic">
											{message.profilePic ? (
												<img
													className="channel-avatar avatar"
													src={imageBase + message.profilePic}
													alt={message.username}
												/>
											) : (
												<span className="head">
													{message.username.charAt(0).toUpperCase()}
												</span>
											)}
										</div>
									) : null}

									<li
										className={`${loggedUser === message.sender ? "send" : "received"
											} message ${isLastMessage ? "after" : ""} ${isHighlighted ? "highlight" : ""
											} ${highlightedMessageIndex === index ? "current" : ""}`}
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
															alt={fileData.fileName}
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
													{fileData.fileType === "application" && (
														<a
															className="file-link"
															href=""
															download={fileData.fileName}
														>
															{fileData.fileName.split(".").includes("pdf") && (
																<img
																	className="file-thumb"
																	src={fileData.file_thumb}
																	alt={fileData.fileName}
																/>
															)}
															{fileData.fileName}
														</a>
													)}
												</>
											))}
										{message.message !== "" ? (
											<>
												{!hasHtmlTags ? (
													<>
														{extractLinkFromMessage(message.message) ? (
															<>
																{/* <ExternalSiteDetails
																	url={extractLinkFromMessage(message.message)}
																/> */}
																<span
																	className="message-content"
																	dangerouslySetInnerHTML={getMessageWithLinkAsHTML(
																		processMessageContent(message.message)
																	)}
																></span>
															</>
														) : (
															<span className="message-content">
																{processMessageContent(message.message)}
															</span>
														)}
													</>
												) : (
													<div className="message-content">
														<>
															{hasHtmlTags ? (
																<span
																	dangerouslySetInnerHTML={{
																		__html: processMessageContent(
																			message.message
																		),
																	}}
																/>
															) : (
																renderImagesInMessage(message.message)
															)}
														</>
													</div>
												)}
											</>
										) : message.file ? (
											<>
												{message.file_type === "image" && (
													<img
														className="message-image"
														src={imageBase + message.file}
														alt={message.file_name}
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
													<a
														className="file-link"
														href=""
														download={message.file_name}
													>
														<div className="file-thumb-holder">
															{message.file_name &&
																message.file_name
																	.split(".")
																	.includes("pdf") && (
																	<>
																		<img
																			className="file-thumb"
																			src={imageBase + message.file_thumb}
																			alt={message.file_name}
																		/>
																		<div className="file-download">
																			<svg
																				viewBox="0 0 34 34"
																				height="34"
																				width="34"
																				preserveAspectRatio="xMidYMid meet"
																				version="1.1"
																				x="0px"
																				y="0px"
																				enableBackground="new 0 0 34 34"
																				xmlSpace="preserve"
																			>
																				<path
																					fill="currentColor"
																					d="M17,2c8.3,0,15,6.7,15,15s-6.7,15-15,15S2,25.3,2,17S8.7,2,17,2 M17,1C8.2,1,1,8.2,1,17 s7.2,16,16,16s16-7.2,16-16S25.8,1,17,1L17,1z"
																				></path>
																				<path
																					fill="currentColor"
																					d="M22.4,17.5h-3.2v-6.8c0-0.4-0.3-0.7-0.7-0.7h-3.2c-0.4,0-0.7,0.3-0.7,0.7v6.8h-3.2 c-0.6,0-0.8,0.4-0.4,0.8l5,5.3c0.5,0.7,1,0.5,1.5,0l5-5.3C23.2,17.8,23,17.5,22.4,17.5z"
																				></path>
																			</svg>
																		</div>
																	</>
																)}
														</div>
														<div className="file-name">
															<div className="icon">
																<img
																	src={
																		message.file_name &&
																			message.file_name.split(".").includes("pdf")
																			? "/pdf.png"
																			: "/adobe.jpg"
																	}
																	alt={message.file_name}
																/>
															</div>
															{message.file_name}
															{message.file_name &&
																message.file_name
																	.split(".")
																	.includes("pdf") ? null : (
																<div className="file-download">
																	<svg
																		viewBox="0 0 34 34"
																		height="34"
																		width="34"
																		preserveAspectRatio="xMidYMid meet"
																		version="1.1"
																		x="0px"
																		y="0px"
																		enableBackground="new 0 0 34 34"
																		xmlSpace="preserve"
																	>
																		<path
																			fill="currentColor"
																			d="M17,2c8.3,0,15,6.7,15,15s-6.7,15-15,15S2,25.3,2,17S8.7,2,17,2 M17,1C8.2,1,1,8.2,1,17 s7.2,16,16,16s16-7.2,16-16S25.8,1,17,1L17,1z"
																		></path>
																		<path
																			fill="currentColor"
																			d="M22.4,17.5h-3.2v-6.8c0-0.4-0.3-0.7-0.7-0.7h-3.2c-0.4,0-0.7,0.3-0.7,0.7v6.8h-3.2 c-0.6,0-0.8,0.4-0.4,0.8l5,5.3c0.5,0.7,1,0.5,1.5,0l5-5.3C23.2,17.8,23,17.5,22.4,17.5z"
																		></path>
																	</svg>
																</div>
															)}
														</div>
													</a>
												)}
											</>
										) : null}
										<div className="message-meta d-flex">
											<div className="absolute">
												<span className="timestamp">
													{formatTime(message.timestamp)}
												</span>
												{message.sender === loggedUser ? (
													<span
														className={`${message.is_read ? "read" : "unread"
															} receipt`}
													>
														{message.delivery_status
															?
															<svg
																viewBox="0 0 16 11"
																height="11"
																width="16"
																preserveAspectRatio="xMidYMid meet"
																fill="none"
															>
																<path
																	d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832ZM8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z"
																	fill="currentColor"
																></path>
															</svg>
															:
															<svg viewBox="0 0 12 11" height="11" width="12" preserveAspectRatio="xMidYMid meet" fill="none"><path d="M11.1549 0.652832C11.0745 0.585124 10.9729 0.55127 10.8502 0.55127C10.7021 0.55127 10.5751 0.610514 10.4693 0.729004L4.28038 8.36523L1.87461 6.09277C1.8323 6.04622 1.78151 6.01025 1.72227 5.98486C1.66303 5.95947 1.60166 5.94678 1.53819 5.94678C1.407 5.94678 1.29275 5.99544 1.19541 6.09277L0.884379 6.40381C0.79128 6.49268 0.744731 6.60482 0.744731 6.74023C0.744731 6.87565 0.79128 6.98991 0.884379 7.08301L3.88047 10.0791C4.02859 10.2145 4.19574 10.2822 4.38194 10.2822C4.48773 10.2822 4.58929 10.259 4.68663 10.2124C4.78396 10.1659 4.86436 10.1003 4.92784 10.0156L11.5738 1.59863C11.6458 1.5013 11.6817 1.40186 11.6817 1.30029C11.6817 1.14372 11.6183 1.01888 11.4913 0.925781L11.1549 0.652832Z" fill="currentcolor"></path></svg>
														}

													</span>
												) : null}
											</div>
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

// The remaining helper functions...
