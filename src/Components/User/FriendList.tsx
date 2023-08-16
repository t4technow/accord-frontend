// React types
import React, { SetStateAction, useEffect, useState } from "react";

// Axios instance and constants
import axiosInstance from "@/config/axiosInstance";
import { imageBase } from "@/config/Constants";

// Types
import { RootState, User } from "@/lib/Types";
import { useDispatch, useSelector } from "react-redux";
import { setChatType, setCurrentChat, setShowSidebar } from "@/redux/chat/currentChatSlice";
import { getRandomColor } from "@/utils/colorGenerator";
import { setPendingRequests } from "@/redux/user/userSlice";
import { setFriendsList } from "@/redux/chat/friendsSlice";
import { getFriends } from "@/services/apiGET";

interface Props {
	users: User[] | undefined;
	friends?: User[] | null;
	setFriends?: React.Dispatch<SetStateAction<User[]>>;
	dm?: User[];
	setDm?: React.Dispatch<SetStateAction<User[]>>;
	selection?: boolean;
	active?: string;
	showIcons?: boolean;
	selectedList?: User[] | null;
	setSelectedList?: React.Dispatch<SetStateAction<User[] | null>>;
	selectedIds?: number[] | null;
	setSelectedIds?: React.Dispatch<React.SetStateAction<number[] | null>>;
	members?: boolean;
	chatList?: boolean;
}

const FriendList = ({
	users,
	friends = null,
	setFriends,
	selection = false,
	selectedList = null,
	setSelectedList,
	selectedIds = null,
	setSelectedIds,
	active = "",
	dm = [],
	setDm,
	showIcons = false,
	members = false,
	chatList = false,
}: Props) => {

	const dispatch = useDispatch()
	const [localUsers, setLocalUsers] = useState<User[] | undefined>([]);
	const onlineUsers = useSelector((state: RootState) => state.onlineUsers.users)
	const chatType = useSelector((state: RootState) => state.chat.chatType)
	const currentChat = useSelector((state: RootState) => state.chat.currentChat)
	const pendingReqCount = useSelector((state: RootState) => state.user.loggedUser?.pending_requests) || 0


	useEffect(() => {
		setLocalUsers(users);
	}, [users]);

	const handleSelection = (friend: User) => {
		if (
			selection &&
			selectedList &&
			setSelectedList &&
			setSelectedIds &&
			friend.friend_id
		) {
			if (selectedIds?.includes(friend.friend_id)) {
				setSelectedIds(selectedIds.filter((id) => id !== friend.friend_id));
				setSelectedList(
					selectedList.filter((user) => user.friend_id !== friend.friend_id)
				);
			} else {
				setSelectedIds(selectedIds && [...selectedIds, friend.friend_id]);
				setSelectedList(selectedList && [...selectedList, friend]);
			}
		} else if (chatList && !selection) {
			dispatch(setCurrentChat(friend.id));
			dispatch(setShowSidebar(false))
		}
		friend.chat_type && dispatch(setChatType(friend.chat_type));
	};

	const setChecked = (friend_id: number | null) => {
		if (friend_id) return selectedIds?.includes(friend_id);
		else return false;
	};

	const fetchFriends = async () => {
		try {
			const friendsList = await getFriends()
			if (friendsList) {
				dispatch(setFriendsList(friendsList));
			}
		}
		catch {
			console.log('error fetching friends')
		}
	}
	return (
		<>
			{localUsers?.map((friend, i) => {
				const randomColor = getRandomColor()
				return (
					<React.Fragment key={
						friend.username
							? friend.username
							: friend.name
					}>
						<li
							className="channel-list_item"
							onClick={() => handleSelection(friend)}
						>
							<div
								className={`channel dm friends-list_item ${currentChat === friend.id && friend.chat_type === chatType
									? "active"
									: ""
									} `}
							>
								<div className="friends-list_item_info">
									{friend.chat_type === 'user' &&
										<div className={`online-indicator ${onlineUsers?.includes(friend.id + '') ? 'online' : 'offline'}`}></div>
									}
									{friend.chat_type === "user" || !friend.chat_type ? (
										<>
											{friend.profile?.avatar || friend.friend_profile?.avatar ? (
												<img
													className="channel-avatar avatar"
													src={
														friend.friend_profile?.avatar
															? friend.friend_profile.avatar
															: friend.profile?.avatar
													}
													alt=""
												/>
											) : (
												<div className="channel-avatar avatar name" style={{ backgroundColor: randomColor }}>
													<span className="head">
														{friend.username.charAt(0).toUpperCase()}
													</span>
												</div>
											)}{" "}
											<span className="channel-name">{friend?.username}</span>
										</>
									) : (
										<>
											{friend.avatar ? (
												<img
													className="channel-avatar avatar"
													src={imageBase + friend?.avatar}
													alt=""
												/>
											) : (
												<div className="channel-avatar avatar name" style={{ backgroundColor: randomColor }}>
													<span className="head">
														{friend.name && friend.name.charAt(0).toUpperCase()}
													</span>
												</div>
											)}{" "}
											<span className="channel-name">{friend?.name}</span>
										</>
									)}
								</div>

								{selection && (
									<div className="selection-box">
										<input
											type="checkbox"
											name=""
											id=""
											readOnly
											checked={setChecked(friend.friend_id)}
										/>
									</div>
								)}

								{showIcons && friend.friend_id ? (
									<>
										{active === "pending" ? (
											<>
												{friend?.type === "send" ? (
													<span>awaiting confirmation</span>
												) : (
													<div
														className="add-friend"
														onClick={() =>
															axiosInstance
																.get(`accept-request/${friend.friend_id}/`)
																.then((res) => {
																	if (pendingReqCount > 0) dispatch(setPendingRequests(pendingReqCount - 1))
																	setDm && setDm([...dm, res.data]);
																	if (Array.isArray(friends) && i >= 0 && i < friends.length && setFriends) {
																		const newFriends = [...friends];
																		newFriends.splice(i, 1);
																		// Update state with the new array
																		setFriends(newFriends);
																	}
																	fetchFriends()
																})
														}
													>
														<svg
															className="icon-1WVg4I"
															aria-hidden="true"
															role="img"
															width="24"
															height="24"
															viewBox="0 0 24 24"
														>
															<path
																fill="currentColor"
																fillRule="evenodd"
																clipRule="evenodd"
																d="M8.99991 16.17L4.82991 12L3.40991 13.41L8.99991 19L20.9999 7.00003L19.5899 5.59003L8.99991 16.17Z"
															></path>
														</svg>
													</div>
												)}
											</>
										) : (
											<div
												className="add-friend"
												onClick={() => {
													dispatch(setCurrentChat(friend.friend_id))
													dispatch(setChatType('user'))
												}}
											>
												<svg
													className="icon-1WVg4I"
													aria-hidden="true"
													role="img"
													width="24"
													height="24"
													viewBox="0 0 24 24"
													fill="none"
												>
													<path
														fill="currentColor"
														d="M4.79805 3C3.80445 3 2.99805 3.8055 2.99805 4.8V15.6C2.99805 16.5936 3.80445 17.4 4.79805 17.4H7.49805V21L11.098 17.4H19.198C20.1925 17.4 20.998 16.5936 20.998 15.6V4.8C20.998 3.8055 20.1925 3 19.198 3H4.79805Z"
													></path>
												</svg>
											</div>
										)}
									</>
								) : showIcons ? (
									<>
										{active === '' ? (
											<div
												className="add-friend"
												onClick={() => {
													dispatch(setCurrentChat(friend.id))
												}}
											>
												<svg
													className="icon-1WVg4I"
													aria-hidden="true"
													role="img"
													width="24"
													height="24"
													viewBox="0 0 24 24"
													fill="none"
												>
													<path
														fill="currentColor"
														d="M4.79805 3C3.80445 3 2.99805 3.8055 2.99805 4.8V15.6C2.99805 16.5936 3.80445 17.4 4.79805 17.4H7.49805V21L11.098 17.4H19.198C20.1925 17.4 20.998 16.5936 20.998 15.6V4.8C20.998 3.8055 20.1925 3 19.198 3H4.79805Z"
													></path>
												</svg>
											</div>
										) : (
											<div
												className="add-friend"
												onClick={() => {
													axiosInstance.get("add-friend/" + friend.id);
													if (setFriends && friends) {
														const updatedFriends = friends.filter(f => f.id !== friend.id);
														setFriends(updatedFriends);
													}
												}}
											>
												<svg
													className="icon-1WVg4I"
													aria-hidden="true"
													role="img"
													width="24"
													height="24"
													viewBox="0 0 24 24"
												>
													<path
														fill="currentColor"
														fillRule="evenodd"
														clipRule="evenodd"
														d="M8.99991 16.17L4.82991 12L3.40991 13.41L8.99991 19L20.9999 7.00003L19.5899 5.59003L8.99991 16.17Z"
													></path>
												</svg>
											</div>

										)}
									</>
								) : chatList ? (
									<span>{friend.unread_count && friend.unread_count}</span>
								) : (
									members &&
									friend.is_admin && <div className="is_admin">admin</div>
								)}
							</div>
						</li>
					</React.Fragment>
				)
			}
			)}
		</>
	);
};

export default FriendList;
