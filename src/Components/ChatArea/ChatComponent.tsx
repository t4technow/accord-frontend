import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Message, RootState } from "@/lib/Types";
import axiosInstance from "@/config/axiosInstance";

interface Props {
	messages: Message[];
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
	currentChat: number | null;
	serverId: number | string;
}

const ChatComponent = ({
	messages,
	setMessages,
	currentChat,
	serverId,
}: Props) => {
	const loggedUser = useSelector((state: RootState) => state.user.userId);

	const messagesRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (serverId === "dm" && currentChat) {
			axiosInstance
				.get("get-thread-messages/" + currentChat)
				.then((res) => setMessages(res.data));
		}
	}, [currentChat]);

	useEffect(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<div className="messages" ref={messagesRef}>
			{messages &&
				messages.map((message) => (
					<li
						key={JSON.stringify(message.timestamp)}
						className={`${
							loggedUser === message.sender ? "send" : "received"
						} message`}
					>
						{message.message}
					</li>
				))}
		</div>
	);
};

export default ChatComponent;
