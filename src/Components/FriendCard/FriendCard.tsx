import { SetStateAction } from "react";
import { User } from "@/lib/Types";

interface Props {
	friend: User;
	currentChat?: number | null;
	setCurrentChat?: React.Dispatch<SetStateAction<number | null>>;
}

const FriendCard = ({ friend, currentChat, setCurrentChat }: Props) => {
	const handleClick = () => {
		if (setCurrentChat) {
			setCurrentChat(friend.id);
		}
	};

	return (
		<li className="channel-list_item" key={friend.id} onClick={handleClick}>
			<div
				className={
					currentChat === friend.id ? "channel dm active" : "channel dm"
				}
			>
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
			</div>
		</li>
	);
};

export default FriendCard;
