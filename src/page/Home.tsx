import ChatArea from "@/Components/ChatArea/ChatArea";
import ServerCreation from "@/Components/Forms/ServerCreation";
import RightBar from "@/Components/RightBar/RightBar";
import ChannelsList from "@/Components/Sidebar/ChannelsList";
import ServerList from "@/Components/Sidebar/ServerList";
import Topbar from "@/Components/Topbar/Topbar";
import { Server, User } from "@/lib/Types";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Home = () => {
	const [servers, setServers] = useState<Server[]>([]);
	const [currentServer, setCurrentServer] = useState<number | string>("dm");
	const [currentChat, setCurrentChat] = useState<number | null>(null);

	const [active, setActive] = useState<string>("");
	const [friends, setFriends] = useState<User[]>([]);

	const [showMessage, setShowMessage] = useState<boolean>(true);
	const [showCreateServer, setShowCreateServer] = useState<boolean>(false);

	const [dm, setDm] = useState<User[]>([]);

	const location = useLocation();

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
					servers={servers}
					setServers={setServers}
					currentServer={currentServer}
					setCurrentServer={setCurrentServer}
					showCreateServer={showCreateServer}
					setShowCreateServer={setShowCreateServer}
				/>
				<ChannelsList
					serverId={currentServer}
					currentChat={currentChat}
					setCurrentChat={setCurrentChat}
					dm={dm}
					setDm={setDm}
				/>
			</div>
			<div className="main-content-wrapper">
				<Topbar
					currentChat={currentChat}
					active={active}
					setActive={setActive}
				/>
				<div className="main-content d-flex">
					<ChatArea
						currentChat={currentChat}
						setCurrentChat={setCurrentChat}
						serverId={currentServer}
						friends={friends}
						setFriends={setFriends}
						active={active}
						dm={dm}
						setDm={setDm}
					/>
					<RightBar currentChat={currentChat} serverId={currentServer} />
				</div>
			</div>

			{showCreateServer && (
				<ServerCreation
					showModal={showCreateServer}
					setShowModal={setShowCreateServer}
					setCurrentServer={setCurrentServer}
					servers={servers}
					setServers={setServers}
				/>
			)}
		</div>
	);
};

export default Home;
