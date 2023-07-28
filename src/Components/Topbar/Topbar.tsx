// React hooks and types
import {
	FormEvent,
	MouseEvent,
	useState,
	useEffect,
	useRef,
	SetStateAction,
} from "react";

// Axios Instance and types
import axiosInstance from "@/config/axiosInstance";
import { AxiosError, AxiosResponse } from "axios";

// Components
import ImageSelector from "../ImageSelector/ImageSelector";
import FriendList from "../User/FriendList";

// Types
import { User } from "@/lib/Types";

// Styles
import "./Topbar.css";

// Props and peculiar types
interface Props {
	currentChat: number | null;
	active: string;
	setActive: React.Dispatch<SetStateAction<string>>;
	dm: User[];
	setDm: React.Dispatch<SetStateAction<User[]>>;
}

const Topbar = ({ currentChat, active, setActive, dm, setDm }: Props) => {
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
	const searchUsers = (e: React.ChangeEvent<HTMLInputElement>) => {
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
							className={`topbar-item ${
								active === "suggestions" ? "active" : ""
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
				) : null}
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
										className={`header ${
											section === 2 && isScrolled ? "shadow" : ""
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
											className={`modal-heading light ${
												section === 2 && "small"
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
											<FriendList
												users={filteredList.length > 0 ? filteredList : friends}
												selection={true}
												selectedList={selectedMembers}
												setSelectedList={setSelectedMembers}
												selectedIds={selectedIds}
												setSelectedIds={setSelectedIds}
											/>
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
					) : null}
				</ul>
			</div>
		</div>
	);
};

export default Topbar;
