import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriendsList } from "@/redux/chat/friendsSlice";

import { getFriends, getGroupMembers, getMutualFriends, getUserInfo } from "@/services/apiGET";

// Helper functions
import { formatDate } from "@/Helper/FormatDate";

import FriendList from "../User/FriendList";

// Types
import { RootState, User } from "@/lib/Types";

import "./RightBar.css";
import { addToGroupRequest } from "@/services/apiPOST";
import { getRandomColor } from "@/utils/colorGenerator";

// Props & Peculiar Types


const RightBar = () => {
	// Current Server
	const serverId = useSelector(
		(state: RootState) => state.server.currentServer
	);
	const chatType = useSelector((state: RootState) => state.chat.chatType)
	const currentChat = useSelector((state: RootState) => state.chat.currentChat)

	const friends = useSelector((state: RootState) => state.friends.friendsList)
	const [selectedMembers, setSelectedMembers] = useState<User[] | null>([]);
	const [selectedIds, setSelectedIds] = useState<number[] | null>([]);
	const [nonMembers, setNonMembers] = useState<User[] | undefined>([]);

	const [user, setUser] = useState<User | null>(null);
	const [mutualFriends, setMutualFriends] = useState<User[] | null>(null);
	const [showMutualFriends, setShowMutualFriends] = useState<boolean>(false);

	const [members, setMembers] = useState<User[]>([]);

	const [showSubmenu, setShowSubmenu] = useState<boolean>(false);
	const [showAddFriends, setShowAddFriends] = useState<boolean>(false)

	// const [loading, setLoading] = useState<boolean>(false)
	// const [popUpMessage, setPopUpMessage] = useState<string>('')

	const dispatch = useDispatch()


	// Function to get details of the user of current chat along with mutual friends/ group members
	const fetchData = async () => {
		if (serverId !== "dm" || !currentChat) return;

		if (chatType === "user") {
			const userInfo = await getUserInfo(currentChat);
			if (userInfo) setUser(userInfo);

			const mutualFriendsData = await getMutualFriends(currentChat);
			if (mutualFriendsData) setMutualFriends(mutualFriendsData);

		} else if (chatType === "group") {
			const groupMembers = await getGroupMembers(currentChat);
			if (groupMembers) setMembers(groupMembers);
		}
	};

	useEffect(() => {
		fetchData();
	}, [currentChat, chatType, serverId]);


	const addFriends = async () => {
		try {
			setShowAddFriends(!showAddFriends);

			if (!friends?.length) {
				const friendsList = await getFriends()
				if (friendsList) dispatch(setFriendsList(friendsList));
			}

			const memberUserNames = members.map((member) => member.username);
			const nonMembersList = friends?.filter(
				(friend) => !memberUserNames.includes(friend.username)
			);

			setNonMembers(nonMembersList);
		} catch (error) {
			console.log("Error adding friends:", error);
		}
	};


	const friendsListRef = useRef<HTMLUListElement>(null);
	// // change state to toggle shadow to friends-list section if scrolled
	// const handleScroll = () => {
	// 	if (friendsListRef.current) {
	// 		// set to true if scrolled
	// 		setIsScrolled(friendsListRef.current.scrollTop > 0);
	// 	}
	// };

	useEffect(() => {
		console.log("RightBar selectedIds:", selectedIds);
	}, [selectedIds]);

	const addToGroup = async () => {
		// setLoading(true);

		if (!selectedIds || selectedIds.length === 0 || !currentChat) {
			// setLoading(false);
			// setPopUpMessage("Please select at least 1 member");
			return;
		}

		try {
			const responseData = await addToGroupRequest(currentChat, selectedIds);
			console.log(responseData);

			const groupMembers = await getGroupMembers(currentChat);
			if (groupMembers) setMembers(groupMembers);
			setShowSubmenu(false);
			setShowAddFriends(false);
		} catch (error) {
			console.error("Error while adding members to group:", error);
		} finally {
			// setLoading(false);
		}
	};

	const friendListKey = nonMembers?.length;
	const randomColor = getRandomColor()
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
										<div className="user-cover-photo" style={{ backgroundColor: randomColor }}></div>
									)}
									<div className="user-meta m-1 mt-0">
										{user?.profile?.avatar ? (
											<img
												src={(user && user?.profile?.avatar) || ""}
												alt=""
												className="user-profile avatar"
											/>
										) : (
											<div className="user-profile avatar name" style={{ backgroundColor: randomColor }}>
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
							{mutualFriends && mutualFriends.length > 0 ? (
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
										<FriendList users={mutualFriends} />
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
						<span className="add-users" onClick={() => {
							setShowSubmenu(!showSubmenu)
							setShowAddFriends(false)
						}}> + </span>
					</h4>
					<div className={`submenu drop-down ${showSubmenu ? 'show' : ''}`}>
						<li className="submenu_item">
							<span className="submenu_item__link" onClick={() => addFriends()}>
								Add friends
							</span>
							<div className={`submenu_dropdown ${showAddFriends ? 'show' : ''}`}>
								<ul
									className="friends-list"
									ref={friendsListRef}
								// onScroll={handleScroll}
								>

									<FriendList
										key={friendListKey}
										users={nonMembers}
										selection={true}
										selectedList={selectedMembers}
										setSelectedList={setSelectedMembers}
										selectedIds={selectedIds}
										setSelectedIds={setSelectedIds}
									/>
								</ul>
								{
									nonMembers && nonMembers?.length > 0 ?
										<button className="btn-primary" onClick={() => addToGroup()}>Add to group</button>
										:
										<button className="btn-primary dark">All your friends are in the group</button>

								}
							</div>
						</li>
						<li className="submenu_item">
							<span className="submenu_item__link">
								invite to group
							</span>
						</li>
						<li className="submenu_item">

							<button className="btn-primary">
								copy invite link
							</button>
						</li>
					</div>
					<FriendList users={members} members={true} />
				</div>
			)}
		</div>
	);
};

export default RightBar;
