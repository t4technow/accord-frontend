// React hooks and types
import {
	FormEvent,
	MouseEvent,
	useState,
	useEffect,
	useRef,
	SetStateAction,
	useCallback,
} from "react";

// Axios Instance and types
import axiosInstance from "@/config/axiosInstance";
import { AxiosError, AxiosResponse } from "axios";

// Components
import ImageSelector from "../ImageSelector/ImageSelector";
import FriendList from "../User/FriendList";

// Types
import { Group, Message, RootState, Server, User } from "@/lib/Types";

// Styles
import "./Topbar.css";
import { getGroupInfo, getServerInfo, getUserInfo } from "@/services/apiGET";
import { useSelector } from "react-redux";

// Props and peculiar types
interface Props {
	currentChat: number | null;
	chatType: string;
	active: string;
	setActive: React.Dispatch<SetStateAction<string>>;
	searchQuery: string;
	setSearchQuery: React.Dispatch<SetStateAction<string>>;
	searchResults: number[];
	setSearchResults: React.Dispatch<SetStateAction<number[]>>;
	setHighlightedMessageIndex: React.Dispatch<SetStateAction<number>>;
	messages: Message[];
	setShowVideo: React.Dispatch<SetStateAction<boolean>>;
}

const Topbar = ({
	currentChat,
	chatType = "user",
	active,
	setActive,
	searchQuery,
	setSearchQuery,
	searchResults,
	setSearchResults,
	setHighlightedMessageIndex,
	messages,
	setShowVideo,
}: Props) => {
	const [section, setSection] = useState<1 | 2>(1);
	const [friends, setFriends] = useState<User[]>([]);
	const [selectedMembers, setSelectedMembers] = useState<User[] | null>([]);
	const [selectedIds, setSelectedIds] = useState<number[] | null>([]);
	const [showCreateGroup, setShowCreateGroup] = useState<boolean>(false);
	const [isScrolled, setIsScrolled] = useState(false);

	const [selectedImage, setSelectedImage] = useState<File | null>(null);

	const friendsListRef = useRef<HTMLUListElement>(null);
	const createGroupRef = useRef<HTMLDivElement | null>(null);

	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");

	const [recipient, setRecipient] = useState<User | Group | Server | null>(null);

	const onlineUsers = useSelector(
		(state: RootState) => state.onlineUsers.users
	);

	const serverId = useSelector((state: RootState) => state.server.currentServer)

	const fetchChatInfo = async (chatId: number) => {
		try {
			if (chatType === "user") {
				const userInfo = await getUserInfo(chatId);
				if (userInfo) setRecipient(userInfo);
			} else if (chatType === "group") {
				const groupInfo = await getGroupInfo(chatId);
				if (groupInfo) setRecipient(groupInfo);
			} else if (chatType === "channel") {
				const serverInfo = await getServerInfo(serverId!);
				if (serverInfo) setRecipient(serverInfo);
			}
		} catch (error) {
			console.warn("Error fetching chat info", error as Error);
		}
	};
	useEffect(() => {
		if (!currentChat) return;
		fetchChatInfo(currentChat);
		setSearchQuery("");
		setSearchResults([]);
		setHighlightedMessageIndex(-1);
	}, [currentChat, chatType]);

	// type guard function to check if it's a User
	function isUser(recipient: User | Group): recipient is User {
		return "profile" in recipient;
	}

	// change state to toggle shadow to friends-list section if scrolled
	const handleScroll = () => {
		if (friendsListRef.current) {
			// set to true if scrolled
			setIsScrolled(friendsListRef.current.scrollTop > 0);
		}
	};

	// Submit group creation form
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("first", name.trim());

		if (name) {
			const updatedData = {
				name: name.trim(),
				avatar: selectedImage,
				members: selectedIds || [],
				description: description.trim(),
			};

			axiosInstance
				.post("group/create/", updatedData, {
					headers: { "Content-Type": "multipart/form-data" },
				})
				.then((res: AxiosResponse) => {
					console.log(res);
					setShowCreateGroup(false);
				})
				.catch((err: AxiosError) => {
					console.log(err);
				});
		}
	};

	// Close group creation Form if clicked outside the form
	const handleOutsideClick = (event: MouseEvent) => {
		if (
			createGroupRef.current &&
			!createGroupRef.current.contains(event.target as Node)
		) {
			setShowCreateGroup(false);
		}
	};

	// add event listener for mouse, required for the above function
	useEffect(() => {
		document.addEventListener("mousedown", handleOutsideClick as any);
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick as any);
		};
	}, []);

	// Get friends of the logged in user
	// TODO: get friends from state in redux
	useEffect(() => {
		axiosInstance.get("friends/").then((res) => {
			setFriends(res.data);
			console.log(res.data);
		});
	}, []);

	// Function and to search users
	const [filteredList, setFilteredList] = useState<User[]>(friends);
	const searchQueryRef = useRef<HTMLInputElement>(null);
	const searchUsers = () => {
		const query = searchQueryRef?.current?.value.trim();
		const filtered = friends.filter(
			(friend) =>
				query && friend.username.toLowerCase().includes(query.toLowerCase())
		);

		setFilteredList(query === "" ? friends : filtered);
	};

	// Function to remove user from selected list
	const removeFromList = (friend: User) => {
		setSelectedIds(
			selectedIds && selectedIds.filter((id) => id !== friend.friend_id)
		);
		setSelectedMembers(
			selectedMembers &&
			selectedMembers.filter((user) => user.friend_id !== friend.friend_id)
		);
	};

	// Handle message search
	const handleSearch = useCallback(() => {
		if (searchQuery.trim() === "") {
			setSearchResults([]);
			setHighlightedMessageIndex(-1);
		} else {
			const results: number[] = [];
			messages.forEach((message, index) => {
				if (message.message.toLowerCase().includes(searchQuery.toLowerCase())) {
					results.push(index);
				}
			});
			setSearchResults(results.reverse());
			setHighlightedMessageIndex(results.length > 0 ? results.length - 1 : -1);
		}
	}, [searchQuery]);

	const handlePrevSearchResult = useCallback(() => {
		if (searchResults.length > 0) {
			setHighlightedMessageIndex((prevIndex) =>
				prevIndex > 0 ? prevIndex - 1 : searchResults.length - 1
			);
		}
	}, [searchResults]);

	const handleNextSearchResult = useCallback(() => {
		if (searchResults.length > 0) {
			setHighlightedMessageIndex((prevIndex) =>
				prevIndex < searchResults.length - 1 ? prevIndex + 1 : 0
			);
		}
	}, [searchResults]);

	return (
		<div className="topbar d-flex">
			<div className="left-side">
				{!currentChat ? (
					<ul className="topbar-menu d-flex">
						<li className="channel-list_item  topbar-header">
							<div className="topbar-header d-flex">
								<svg
									x="0"
									y="0"
									className="icon-2xnN2Y"
									aria-hidden="true"
									role="img"
									width="24"
									height="24"
									viewBox="0 0 24 24"
								>
									<g fill="none" fillRule="evenodd">
										<path
											fill="currentColor"
											fillRule="nonzero"
											d="M0.5,0 L0.5,1.5 C0.5,5.65 2.71,9.28 6,11.3 L6,16 L21,16 L21,14 C21,11.34 15.67,10 13,10 C13,10 12.83,10 12.75,10 C8,10 4,6 4,1.5 L4,0 L0.5,0 Z M13,0 C10.790861,0 9,1.790861 9,4 C9,6.209139 10.790861,8 13,8 C15.209139,8 17,6.209139 17,4 C17,1.790861 15.209139,0 13,0 Z"
											transform="translate(2 4)"
										></path>
										<path d="M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z"></path>
									</g>
								</svg>{" "}
								<span className="channel-name">Friends</span>
							</div>
						</li>

						<li
							className={`topbar-item ${active === "" ? "active" : ""}`}
							onClick={() => setActive("")}
						>
							Online
						</li>
						<li
							className={`topbar-item ${active === "friends" ? "active" : ""}`}
							onClick={() => setActive("friends")}
						>
							All
						</li>
						<li
							className={`topbar-item ${active === "pending" ? "active" : ""}`}
							onClick={() => setActive("pending")}
						>
							Pending
						</li>
						<li
							className={`topbar-item ${active === "suggestions" ? "active" : ""
								}`}
							onClick={() => setActive("suggestions")}
						>
							Suggestion
						</li>
						<li
							className={`topbar-item ${active === "blocked" ? "active" : ""}`}
							onClick={() => setActive("blocked")}
						>
							Blocked
						</li>
					</ul>
				) : (
					<div className="topbar-menu d-flex">
						<div className="topbar-header d-flex">
							{recipient && (
								<>
									{recipient?.avatar ||
										(isUser(recipient) && (recipient as User).profile?.avatar) ? (
										<img
											className="channel-avatar avatar"
											src={
												chatType === "user" && isUser(recipient)
													? recipient.profile?.avatar
													: recipient.avatar
											}
											alt=""
										/>
									) : (
										<div className="channel-avatar avatar name">
											<span className="head">
												{chatType === "user" && isUser(recipient)
													? recipient?.username.charAt(0).toUpperCase()
													: recipient?.name?.charAt(0).toUpperCase()}
											</span>
										</div>
									)}
									<div className="meta">
										<span className="channel-name">
											{chatType === "user" && isUser(recipient)
												? recipient?.username
												: recipient?.name}
										</span>
										{chatType === "user" && (
											<div className="online-status">
												{onlineUsers?.includes(recipient.id + "")
													? "online"
													: "offline"}
											</div>
										)}
									</div>
								</>
							)}
						</div>
					</div>
				)}
			</div>
			<div className="right-side">
				<ul className="action-menu">
					{!currentChat ? (
						<>
							<li
								className="action-item"
								onClick={() => setShowCreateGroup(true)}
							>
								<div className="icon">
									<svg
										x="0"
										y="0"
										className="icon-2xnN2Y"
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
											d="M20.998 0V3H23.998V5H20.998V8H18.998V5H15.998V3H18.998V0H20.998ZM2.99805 20V24L8.33205 20H14.998C16.102 20 16.998 19.103 16.998 18V9C16.998 7.896 16.102 7 14.998 7H1.99805C0.894047 7 -0.00195312 7.896 -0.00195312 9V18C-0.00195312 19.103 0.894047 20 1.99805 20H2.99805Z"
										></path>
									</svg>
								</div>

								<p className="hidden-title">create new group</p>
							</li>
							<div
								className={`create-group ${showCreateGroup && "show"}`}
								ref={createGroupRef}
							>
								<form onSubmit={handleSubmit}>
									<div
										className={`header ${section === 2 && isScrolled ? "shadow" : ""
											}`}
									>
										<button
											className="close-modal"
											role="button"
											onClick={() => setShowCreateGroup(!showCreateGroup)}
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
										<h2
											className={`modal-heading light ${section === 2 && "small"
												}`}
										>
											{section === 1 ? "Create a group" : "Select friends"}
										</h2>
										{section === 2 && (
											<div className="search-bar">
												<>
													{selectedMembers &&
														selectedMembers?.length > 0 &&
														selectedMembers.map((user) => (
															<div className="user-card" key={user.friend_id}>
																<p className="name">{user?.username}</p>
																<span
																	className="close"
																	onClick={() => removeFromList(user)}
																>
																	x
																</span>
															</div>
														))}
													<input
														type="text"
														className="find-user dark"
														placeholder="Type the username of a friend"
														ref={searchQueryRef}
														onChange={searchUsers}
													/>
												</>
											</div>
										)}
									</div>
									{section === 1 ? (
										<div className="group-info mt-1">
											<ImageSelector
												selectedImage={selectedImage}
												setSelectedImage={setSelectedImage}
											/>
											<div className="group-name-container">
												<label
													htmlFor="group-name"
													className="secondary-label dark"
												>
													GROUP NAME
												</label>
												<input
													type="text"
													name="group-name"
													className="grayed-out dark"
													onChange={(e) => setName(e.target.value)}
												/>
											</div>

											<div className="group-name-container mt-1">
												<label
													htmlFor="group-description"
													className="secondary-label dark"
												>
													GROUP DESCRIPTION
												</label>
												<input
													type="text"
													name="group-description"
													className="grayed-out dark"
													onChange={(e) => setDescription(e.target.value)}
												/>
											</div>
										</div>
									) : (
										<ul
											className="friends-list"
											ref={friendsListRef}
											onScroll={handleScroll}
										>
											{filteredList.length > 0 ? (
												<FriendList
													users={filteredList}
													selection={true}
													selectedList={selectedMembers}
													setSelectedList={setSelectedMembers}
													selectedIds={selectedIds}
													setSelectedIds={setSelectedIds}
												/>
											) : (
												<p
													style={{
														textAlign: "center",
														color: "var(--primary-color)",
													}}
												>
													{" "}
													No user found{" "}
												</p>
											)}
										</ul>
									)}
									<div className="modal-footer dark">
										{section === 2 ? (
											<button type="submit" className="create w-100">
												Create
											</button>
										) : (
											<a
												role="button"
												className="create w-100"
												onClick={() => setSection(2)}
											>
												Next
											</a>
										)}
									</div>
								</form>
							</div>
						</>
					) : (
						<>
							<div className="icon-wrapper" onClick={() => setShowVideo(true)}>
								<svg
									x="0"
									y="0"
									className="icon-2xnN2Y"
									aria-hidden="true"
									role="img"
									width="24"
									height="24"
									viewBox="0 0 24 24"
								>
									<path
										fill="currentColor"
										d="M21.526 8.149C21.231 7.966 20.862 7.951 20.553 8.105L18 9.382V7C18 5.897 17.103 5 16 5H4C2.897 5 2 5.897 2 7V17C2 18.104 2.897 19 4 19H16C17.103 19 18 18.104 18 17V14.618L20.553 15.894C20.694 15.965 20.847 16 21 16C21.183 16 21.365 15.949 21.526 15.851C21.82 15.668 22 15.347 22 15V9C22 8.653 21.82 8.332 21.526 8.149Z"
									></path>
								</svg>
							</div>
							<div className="secondary-sidebar_header search-messages-holder">
								<input
									type="text"
									placeholder="search message"
									className="search-messages"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
								<div className="search-args">
									{searchResults.length > 0 && (
										<>
											<button onClick={handlePrevSearchResult}>{`<`} </button>
											<button onClick={handleNextSearchResult}>{`>`}</button>
										</>
									)}
									<button className="search-button" onClick={handleSearch}>
										search
									</button>
								</div>
							</div>
						</>
					)}
				</ul>
			</div>
		</div>
	);
};

export default Topbar;
