// React and React Router hooks
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Components
import ServerList from "@/Components/Sidebar/ServerList";
import ServerCreation from "@/Components/Forms/ServerCreation";
import ChannelsList from "@/Components/Sidebar/ChannelsList";
import Topbar from "@/Components/Topbar/Topbar";
import ChatArea from "@/Components/ChatArea/ChatArea";
import RightBar from "@/Components/RightBar/RightBar";

// Types
import { User } from "@/lib/Types";

const Home = () => {
	const [currentChat, setCurrentChat] = useState<number | null>(null);
	const [chatType, setChatType] = useState<string>("user");

	const [active, setActive] = useState<string>("");
	const [friends, setFriends] = useState<User[]>([]);

	const [showMessage, setShowMessage] = useState<boolean>(true);
	const [showCreateServer, setShowCreateServer] = useState<boolean>(false);

	const [dm, setDm] = useState<User[]>([]);

	const location = useLocation();

	// Function to show message, if any in redirect
	useEffect(() => {
		const timer = setTimeout(() => {
			setShowMessage(false);
		}, 3000);
		location.state = null;
		return () => clearTimeout(timer);
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
				/>
			</div>
			<div className="main-content-wrapper">
				<Topbar
					currentChat={currentChat}
					active={active}
					setActive={setActive}
					dm={dm}
					setDm={setDm}
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
		</div>
	);
};

export default Home;
