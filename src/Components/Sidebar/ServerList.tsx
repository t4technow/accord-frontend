// React hooks and types
import { useEffect, SetStateAction } from "react";

// Redux hooks and states stored in redux
import { useDispatch, useSelector } from "react-redux";
import { setServers, setCurrentServer } from "@/redux/server/ServerSlice";

// AxiosInstance and constants
import { imageBase } from "@/config/Constants";

// Types
import { RootState } from "@/lib/Types";

// Styles
import "./ServerList.css";
import { useNavigate } from "react-router-dom";
import { getUserServers } from "@/services/apiGET";
import { setChatType } from "@/redux/chat/currentChatSlice";

// Props & Peculiar Types
type Props = {
	showCreateServer: boolean;
	setShowCreateServer: React.Dispatch<SetStateAction<boolean>>;
};

const ServerList = ({ showCreateServer, setShowCreateServer }: Props) => {
	// Get servers and active from redux state
	const servers = useSelector((state: RootState) => state.server.servers) || [];
	const currentServer = useSelector(
		(state: RootState) => state.server.currentServer
	);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Get servers of current user
	const fetchServers = async () => {
		const servers = await getUserServers()
		if (servers) {
			dispatch(setServers(servers))
		}
	}

	useEffect(() => {
		if (servers.length < 1)
			fetchServers()
	}, []);


	return (
		<div className="server-list">
			<div className="server-list_item direct-messages">
				<div className="mention-pill unread"></div>
				<div
					className={`server ${currentServer === "dm" ? "active" : ""}`}
					onClick={() => {
						dispatch(setCurrentServer("dm"));
						navigate("/@me");
					}}
				>
					<img className="server_avatar avatar" src="/adobe.jpg" />
				</div>
			</div>
			<div className="separator"></div>
			{servers &&
				servers.map((server) => (
					<div className="server-list_item" key={server.id}>
						<div className="mention-pill unread"></div>
						<div
							className={`server ${server.id === currentServer ? "active" : ""
								}`}
							onClick={() => {
								dispatch(setCurrentServer(server.id));
								dispatch(setChatType('channel'))
								navigate(`/${server.id}`);
							}}
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
