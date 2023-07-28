// React Hooks
import { useState, useEffect } from "react";

// Redux hooks and states
import { useSelector } from "react-redux";

// Axios Instance
import axiosInstance from "@/config/axiosInstance";

// Helper functions
import { formatDate } from "@/Helper/FormatDate";

// Components
import FriendList from "../User/FriendList";

// Types
import { RootState, User } from "@/lib/Types";

// Styles
import "./RightBar.css";

// Props & Peculiar Types
interface Props {
	currentChat?: number | null;
	chatType?: string;
}

const RightBar = ({ currentChat, chatType }: Props) => {
	// Current Server
	const serverId = useSelector(
		(state: RootState) => state.server.currentServer
	);

	const [user, setUser] = useState<User | null>(null);
	const [mutualFriends, setMutualFriends] = useState<User[]>([]);
	const [showMutualFriends, setShowMutualFriends] = useState<boolean>(false);

	const [members, setMembers] = useState<User[]>([]);

	// Function to get details of the user of current chat along with mutual friends
	useEffect(() => {
		if (serverId === "dm" && currentChat && chatType === "user") {
			axiosInstance.get(`user_info/${currentChat}/`).then((res) => {
				setUser(res.data);
			});
			axiosInstance.get(`mutual-friends/${currentChat}/`).then((res) => {
				setMutualFriends(res.data);
			});
		}

		if (serverId === "dm" && currentChat && chatType === "group") {
			axiosInstance
				.get(`group-info/${currentChat}/`)
				.then((res) => {
					console.log(res.data);
					setMembers(res.data);
				})
				.catch((err) => console.log(err));
		}

		return () => {};
	}, [currentChat, chatType]);

	return (
		<div className="right-side-bar">
			{chatType === "user" ? (
				user && (
					<>
						<div className="user-profile">
							<div className="user-image-holder">
								<div className="user-cover">
									{user?.profile?.cover ? (
										<img
											className="user-cover-photo"
											src={user?.profile?.cover || ""}
											alt=""
										/>
									) : (
										<div className="user-cover-photo"></div>
									)}
									<div className="user-meta m-1 mt-0">
										{user?.profile?.avatar ? (
											<img
												src={(user && user?.profile?.avatar) || ""}
												alt=""
												className="user-profile avatar"
											/>
										) : (
											<div className="user-profile avatar name">
												<span className="head">
													{user.username.charAt(0).toUpperCase()}
												</span>
											</div>
										)}
										<span className="hash"></span>
									</div>
								</div>
							</div>
							<div className="user-details m-1 mt-0">
								<h3 className="username">{user ? user.username : ""}</h3>
								<h4 className="user-email">{user ? user.email : ""}</h4>

								<div className="divider"></div>

								<h4 className="member-since sub-head">Accord member since</h4>
								<h6 className="member-since_sub sub">
									{user ? formatDate(user.date_joined) : ""}
								</h6>
							</div>
						</div>

						<>
							{mutualFriends.length > 0 ? (
								<div className="mutual-friends m-1 mt-0">
									<button
										className="element-toggler sub-head"
										onClick={() => setShowMutualFriends(!showMutualFriends)}
									>
										<div className="mutual-friends_info">
											<span className="count">{mutualFriends.length}</span>
											<span>&nbsp;&nbsp;Mutual Friends</span>
										</div>
										<div className="chevron-right">
											<svg
												fill="none"
												height="20"
												viewBox="0 0 20 20"
												width="20"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													clipRule="evenodd"
													d="m5.41667 4.2625 5.66573 5.7375-5.66573 5.7375 1.74426 1.7625 7.42237-7.5-7.42237-7.5z"
													fill="#dbdee1"
													fillRule="evenodd"
												/>
											</svg>
										</div>
									</button>
									{showMutualFriends ? (
										<FriendList users={mutualFriends} friendsList={true} />
									) : null}
								</div>
							) : null}
						</>
					</>
				)
			) : (
				<div className="members-list">
					<h4 className="sub-head d-flex">
						<span className="header">Members</span>
						<span className="add-users"> + </span>
					</h4>
					<FriendList users={members} friendsList={true} members={true} />
				</div>
			)}
		</div>
	);
};

export default RightBar;
