import { SetStateAction } from "react";
import "./Topbar.css";

interface Props {
	currentChat: number | null;
	active: string;
	setActive: React.Dispatch<SetStateAction<string>>;
}
const Topbar = ({ currentChat, active, setActive }: Props) => {
	return (
		<div className="topbar d-flex">
			<div className="left-side">
				{!currentChat ? (
					<ul className="topbar-menu d-flex">
						<li className="channel-list_item  topbar-header">
							<div className="topbar-header d-flex">
								<img className="channel-avatar avatar" src="" alt="" />{" "}
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
			<div className="right-side"></div>
		</div>
	);
};

export default Topbar;
