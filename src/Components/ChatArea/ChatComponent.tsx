import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { imageBase } from "@/config/Constants";
import {
	convertTimestampToTimeFormat as formatTime,
} from "@/Helper/FormatTime";
import { formatDate, getDayLabel } from "@/Helper/FormatDate";
// import ExternalSiteDetails from "../LinkDetails/LinkDetails";
import { extractLinkFromMessage, getMessageWithLinkAsHTML } from "@/Helper/extractLink";
import { renderImagesInMessage } from "@/Helper/extractImages";
import { Message, RootState } from "@/lib/Types";
import { getChannelMessages, getGroupMessages, getUserMessages } from "@/services/apiGET";

interface Props {
	messages: Message[];
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
	currentChat: number | null;
	chatType: string;
	searchResults: number[];
	highlightedMessageIndex: number;
}

const ChatComponent = ({
	messages,
	setMessages,
	currentChat,
	chatType,
	searchResults,
	highlightedMessageIndex,
}: Props) => {
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
			} else if (serverId === "dm" && chatType === "group") {
				const groupMessages = await getGroupMessages(currentChat);
				if (groupMessages) setMessages(groupMessages);
			} else if (chatType === "channel") {
				const channelMessages = await getChannelMessages(currentChat);
				if (channelMessages) setMessages(channelMessages)
			}
		} catch (error) {
			console.log("Error fetching messages", error);
		}
		console.log('called')
	}, [currentChat, chatType, serverId]);

	useEffect(() => {
		fetchMessages()
	}, [fetchMessages]);


	useEffect(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
		}
	}, [messages]);


	useEffect(() => {
		if (messagesRef.current && highlightedMessageIndex >= 0) {
			const highlightedMessages = messagesRef.current.getElementsByClassName("highlight current-result");
			Array.from(highlightedMessages).forEach((message) => {
				message.classList.remove('current-result');
			});
			const highlightedMessage = messagesRef.current.getElementsByClassName("highlight")[highlightedMessageIndex] as HTMLElement;
			if (highlightedMessage) {
				highlightedMessage.scrollIntoView({ behavior: "smooth", block: "center" });
				highlightedMessage.classList.add('current-result')
			}
		}
	}, [highlightedMessageIndex]);



	const processMessageContent = useCallback(
		(message: string) => {
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


			<div className={`messages ${chatType === "group" ? "group" : ""}`} ref={messagesRef}>
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

						return (
							<React.Fragment key={JSON.stringify(message.timestamp)}>
								{isNewDate ? (
									<div className="orderby-date">
										<div className="date">{getDayLabel(message.timestamp)}</div>
									</div>
								) : null}

								<div className={`message-holder ${isNewUser && chatType === "group" &&
									message.sender != loggedUser && index > 0 && messages[index - 1].sender != loggedUser ? "mt-2" : ""
									}`}>
									{chatType === "group" && isLastMessage && message.sender != loggedUser ? (
										<div className="channel-avatar avatar name profile-pic">
											{message.profilePic ? (
												<img className="channel-avatar avatar" src={imageBase + message.profilePic} alt="" />
											) : (
												<span className="head">
													{message.username.charAt(0).toUpperCase()}
												</span>
											)}
										</div>
									) : null}

									<li className={`${loggedUser === message.sender ? "send" : "received"
										} message ${isLastMessage ? "after" : ""} ${isHighlighted ? "highlight" : ""
										} ${highlightedMessageIndex === index ? "current" : ""}`}>
										{isNewUser && chatType === "group" && message.sender != loggedUser ? (
											<span className="sender-name">{message.username}</span>
										) : null}

										{message.files && message.files.length > 0 && message.files?.map((fileData) => (
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
												{fileData.fileType === "application" && (
													<a
														className="file-link"
														href=""
														download={fileData.fileName}
													>
														{fileData.fileName.split('.').includes('pdf') && (
															<img
																className="file-thumb"
																src={fileData.file_thumb}
																alt=""
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
																<span dangerouslySetInnerHTML={{ __html: processMessageContent(message.message) }} />
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
													<a
														className="file-link"
														href=""
														download={message.file_name}
													>
														<div className="file-thumb-holder">
															{message.file_name && message.file_name.split('.').includes('pdf') && (
																<>
																	<img
																		className="file-thumb"
																		src={imageBase + message.file_thumb}
																		alt=""
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
																<img src={message.file_name && message.file_name.split('.').includes('pdf') ? '/pdf.png' : '/adobe.jpg'} alt="" />
															</div>
															{message.file_name}
															{message.file_name && message.file_name.split('.').includes('pdf') ? null : (
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

// The remaining helper functions...
