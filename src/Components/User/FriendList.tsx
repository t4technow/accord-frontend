// React types
import { SetStateAction } from "react";

// Axios instance and constants
import axiosInstance from "@/config/axiosInstance";
import { imageBase } from "@/config/Constants";

// Types
import { User } from "@/lib/Types";

interface Props {
	users: User[];
	friends?: User[] | null;
	dm?: User[];
	setDm?: React.Dispatch<SetStateAction<User[]>>;
	currentChat?: number | null;
	setCurrentChat?: React.Dispatch<SetStateAction<number | null>>;
	selection?: boolean;
	active?: string;
	showIcons?: boolean;
	friendsList?: boolean;
	selectedList?: User[] | null;
	setSelectedList?: React.Dispatch<SetStateAction<User[] | null>>;
	selectedIds?: number[] | null;
	setSelectedIds?: React.Dispatch<React.SetStateAction<number[] | null>>;
	chatType?: string;
	setChatType?: React.Dispatch<SetStateAction<string>>;
	members?: boolean;
}

const FriendList = ({
	users,
	friends = null,
	currentChat = null,
	setCurrentChat,
	selection = false,
	selectedList = null,
	setSelectedList,
	selectedIds = null,
	setSelectedIds,
	active = "",
	dm = [],
	setDm,
	showIcons = false,
	friendsList = false,
	chatType = "user",
	setChatType,
	members = false,
}: Props) => {
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
		} else if (friendsList && !selection) {
			setCurrentChat && setCurrentChat(friend.id);
			console.log(friend, "[[[[[[sss[");
		}
		setChatType && friend.chat_type && setChatType(friend.chat_type);
	};

	const setChecked = (friend_id: number | null) => {
		if (friend_id) return selectedIds?.includes(friend_id);
		else return false;
	};

	return (
		<>
			{users?.map((friend, i) => (
				<>
					<li
						className="channel-list_item"
						key={
							friendsList
								? friend.chat_type && friend.chat_type + friend.id
								: friend.chat_type &&
								  friend.friend_id &&
								  friend.chat_type + friend.friend_id
								? friend.friend_id && friend.friend_id
								: friend.id
						}
						onClick={() => handleSelection(friend)}
					>
						<div
							className={`channel dm friends-list_item ${
								currentChat === friend.id && friend.chat_type === chatType
									? "active"
									: ""
							} `}
						>
							<div className="friends-list_item_info">
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
											<div className="channel-avatar avatar name">
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
											<div className="channel-avatar avatar name">
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
																setDm && setDm([...dm, res.data]);
																friends && friends.splice(i, 1);
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
												setCurrentChat && setCurrentChat(friend.friend_id);
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
								<div
									className="add-friend"
									onClick={() => {
										axiosInstance.get("add-friend/" + friend.id);
										friends && friends.splice(i, 1);
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
							) : (
								members &&
								friend.is_admin && <div className="is_admin">admin</div>
							)}
						</div>
					</li>
				</>
			))}
		</>
	);
};

export default FriendList;
