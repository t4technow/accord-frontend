// React hooks and types
import React, { ChangeEvent, FormEvent } from "react";

// Styles
import "./MessageInput.css";

interface Props {
	messageInput: string;
	setMessageInput: React.Dispatch<React.SetStateAction<string>>;
	handleSendMessage(e: FormEvent<HTMLFormElement>): void;
	selectedFiles: File[];
	fileUrls: string[];
	handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const MessageInput = ({
	messageInput,
	setMessageInput,
	handleSendMessage,
	selectedFiles,
	fileUrls,
	handleImageChange,
}: Props) => {
	return (
		<form className="send-message" onSubmit={handleSendMessage}>
			{fileUrls.length > 0 && selectedFiles.length > 0 && (
				<div className="media-viewer">
					{fileUrls.map((imageUrl, index) => (
						<img
							key={index}
							src={imageUrl}
							alt={`Image ${index}`}
							className="media"
						/>
					))}
				</div>
			)}
			<div className="input-holder d-flex">
				<div className="upload-file">
					<input
						type="file"
						className="attach-items"
						multiple
						onChange={handleImageChange}
					/>
					<div className="upload-icon">
						<svg width="24" height="24" viewBox="0 0 24 24">
							<path
								className="attachButtonPlus-3IYelE"
								fill="currentColor"
								d="M12 2.00098C6.486 2.00098 2 6.48698 2 12.001C2 17.515 6.486 22.001 12 22.001C17.514 22.001 22 17.515 22 12.001C22 6.48698 17.514 2.00098 12 2.00098ZM17 13.001H13V17.001H11V13.001H7V11.001H11V7.00098H13V11.001H17V13.001Z"
							></path>
						</svg>
					</div>
				</div>
				<input
					type="text"
					name="message"
					autoComplete="off"
					autoCorrect="on"
					autoFocus
					autoCapitalize="sentences"
					value={messageInput}
					onChange={(e) => setMessageInput(e.target.value)}
				/>
				<button type="submit" className="send-btn">
					<svg
						height="22px"
						width="22px"
						version="1.1"
						id="Layer_1"
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
						viewBox="0 0 512.003 512.003"
						xmlSpace="preserve"
						fill="#000000"
					>
						<g id="SVGRepo_bgCarrier" strokeWidth="0" />

						<g
							id="SVGRepo_tracerCarrier"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>

						<g id="SVGRepo_iconCarrier">
							{" "}
							<polygon
								className="one"
								points="276.547,363.724 156.428,439.952 229.841,320.17 "
							/>{" "}
							<g>
								{" "}
								<polygon
									className="two"
									points="424.343,501.551 229.841,320.17 499.021,10.446 "
								/>{" "}
								<polygon
									className="two"
									points="156.428,264.439 12.979,188.915 499.021,10.446 "
								/>{" "}
							</g>{" "}
							<polygon
								className="three"
								points="156.428,264.439 156.428,439.952 229.841,320.17 499.021,10.446 "
							/>{" "}
							<path d="M409.804,197.83c-2.509,0-5.026-0.898-7.027-2.72c-4.269-3.883-4.582-10.491-0.699-14.76l0.164-0.181 c3.883-4.268,10.493-4.582,14.76-0.698c4.27,3.883,4.582,10.491,0.699,14.76l-0.164,0.181 C415.475,196.679,412.644,197.83,409.804,197.83z" />{" "}
							<path d="M318.886,298.027c-2.505,0-5.018-0.895-7.019-2.71c-4.274-3.879-4.594-10.487-0.716-14.759l68.202-75.162 c3.877-4.274,10.487-4.594,14.759-0.717c4.274,3.878,4.594,10.487,0.717,14.759L326.627,294.6 C324.565,296.871,321.731,298.027,318.886,298.027z" />{" "}
							<path d="M503.407,0.963c-2.579-1.193-5.448-1.251-7.987-0.32c0-0.002,0-0.003-0.001-0.005L9.377,179.106 c-3.876,1.423-6.551,4.996-6.823,9.116c-0.275,4.12,1.904,8.015,5.558,9.939l137.867,72.584v169.208 c0,4.679,3.111,8.787,7.612,10.057c0.94,0.265,1.895,0.393,2.837,0.393c1.992,0,3.923-0.589,5.586-1.644 c0.004,0.006,0.008,0.01,0.014,0.017l113.3-71.9l141.89,132.319c1.966,1.833,4.523,2.807,7.127,2.807c1.15,0,2.31-0.19,3.431-0.58 c3.66-1.273,6.315-4.467,6.898-8.299l74.678-491.105C510.051,7.42,507.628,2.915,503.407,0.963z M434.512,45.265l-279.03,206.867 l-116.834-61.51L434.512,45.265z M166.877,269.699l261.434-193.82L221.954,313.315c-0.386,0.444-0.718,0.915-1.016,1.401 c-0.002-0.003-0.004-0.004-0.007-0.007l-54.055,88.198V269.699H166.877z M188.896,406.972l43.17-70.439l27.465,25.613 L188.896,406.972z M416.988,480.407L244.345,319.408l238.93-274.914L416.988,480.407z" />{" "}
						</g>
					</svg>
				</button>
			</div>
		</form>
	);
};

export default MessageInput;
