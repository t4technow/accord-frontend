import { useEffect, SetStateAction } from "react";
import axiosInstance from "@/config/axiosInstance";
import { Server } from "@/lib/Types";

import "./ServerList.css";
import { imageBase } from "@/config/Constants";

type Props = {
	currentServer: number | string;
	setCurrentServer: React.Dispatch<SetStateAction<number | string>>;
	showCreateServer: boolean;
	setShowCreateServer: React.Dispatch<SetStateAction<boolean>>;
	servers: Server[];
	setServers: React.Dispatch<SetStateAction<Server[]>>;
};

const ServerList = ({
	currentServer,
	setCurrentServer,
	showCreateServer,
	setShowCreateServer,
	servers,
	setServers,
}: Props) => {
	useEffect(() => {
		axiosInstance.get("server/").then((res) => setServers(res.data));
		return () => {};
	}, []);

	return (
		<div className="server-list">
			<div className="server-list_item direct-messages">
				<div className="mention-pill unread"></div>
				<div
					className={`server ${currentServer === "dm" ? "active" : ""}`}
					onClick={() => {
						setCurrentServer("dm");
					}}
				>
					<img className="server_avatar avatar" src="adobe.jpg" />
				</div>
			</div>
			<div className="separator"></div>
			{servers.map((server) => (
				<div className="server-list_item" key={server.id}>
					<div className="mention-pill unread"></div>
					<div
						className={`server ${server.id === currentServer ? "active" : ""}`}
						onClick={() => setCurrentServer(server.id)}
					>
						<img
							className="server_avatar avatar"
							src={`${imageBase}${server.avatar}`}
						/>
					</div>
				</div>
			))}
			<div
				className="server-list_item"
				onClick={() => setShowCreateServer(true)}
			>
				<div
					className={`server add-server ${showCreateServer ? "active" : ""}`}
				>
					<svg
						className="add"
						aria-hidden="true"
						role="img"
						width="24"
						height="24"
						viewBox="0 0 24 24"
					>
						<path d="M20 11.1111H12.8889V4H11.1111V11.1111H4V12.8889H11.1111V20H12.8889V12.8889H20V11.1111Z"></path>
					</svg>
				</div>
			</div>
		</div>
	);
};

export default ServerList;
