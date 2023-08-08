// React hooks and types
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import * as ReactDOMServer from 'react-dom/server'

import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { Emoji } from 'emoji-picker-react'


// Styles
import "./MessageInput.css";
// import { useSelector } from "react-redux";
// import { RootState } from "@/lib/Types";

interface Props {
	messageInput: string;
	setMessageInput: React.Dispatch<React.SetStateAction<string>>;
	handleSendMessage(): void;
	selectedFiles: {
		file: File;
		fileName: string;
		fileType?: "image" | "video" | "application";
		fileUrl?: string;
	}[];
	handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
	// chatSocket: WebSocket;
	// chatType: string
}

type Emoji = {
	unified: string;
	emojiStyle?: EmojiStyle;
	size?: number;
	lazyLoad?: boolean;
	getEmojiUrl?: string
}

const MessageInput = ({
	messageInput = "",
	setMessageInput,
	handleSendMessage,
	selectedFiles,
	handleImageChange,
	// chatSocket,
	// chatType,
}: Props) => {

	const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
	// const userId = useSelector((state: RootState) => state.user.userId);


	const inputRef = useRef<HTMLDivElement>(null);
	const sendRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		inputRef.current!.focus();
	}, [])

	const handleEmojiClick = (emoji: Emoji) => {
		// Create a new Emoji component and convert it to its HTML representation
		const newEmojiComponent = <Emoji unified={emoji.unified} size={25} />;
		const emojiHTML = ReactDOMServer.renderToString(newEmojiComponent);

		setMessageInput(messageInput + ' ' + emojiHTML + ' ');
	};

	const handleInput = (e: any) => {
		const container = document.createElement('div');
		container.innerHTML = e.target.innerHTML;

		// Remove <div> elements containing only <br> tags
		const divsWithOnlyBr = container.querySelectorAll('div:only-child');
		divsWithOnlyBr.forEach((div) => {
			if (div.innerHTML.trim().toLowerCase() === '<br>') {
				div.parentNode?.removeChild(div);
			}
		});

		// Remove consecutive <br> tags
		const cleanedHtml = container.innerHTML.replace(/<br\s*\/?>\s*(<br\s*\/?>\s*)+/g, '<br>').trim();
		setMessageInput(cleanedHtml);
		console.log(cleanedHtml);

	};


	return (
		<div className="send-message">

			{selectedFiles.length > 0 && (
				<div className="media-viewer">
					{selectedFiles.map((file, index) => (
						<div className="media-holder" key={index}>

							{file.fileType === 'image' &&
								<img
									src={file.fileUrl}
									alt={`Image ${index}`}
									className="media"
								/>
							}
							{file.fileType === 'video' &&
								<video
									src={file.fileUrl}
									className="media"
								/>
							}
							{file.fileType === 'application' &&
								<img
									src='/pdf.png'
									className="media"
								/>
							}
							<div className="media-name">
								{file.fileName}
							</div>
						</div>
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
				<div
					className="rendered-message"
					role="input"
					dangerouslySetInnerHTML={{ __html: messageInput }}
					contentEditable="true"
					onBlur={handleInput}
					// onInput={() => chatSocket.send(JSON.stringify({ type: "typing", sender: userId, is_group_chat: chatType === "group" ? true : false, }))}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							inputRef.current!.blur();
							setTimeout(() => {
								sendRef.current?.click();
								inputRef.current!.focus();
							}, 0);
						}
					}}
					ref={inputRef} // Use the "innerRef" prop to access the DOM element
					autoFocus
				></div>
				{/* <input
					type="text"
					name="message"
					autoComplete="off"
					autoCorrect="on"
					autoFocus
					autoCapitalize="sentences"
					value={messageInput}
					onChange={(e) => setMessageInput(e.target.value)}
					style={{ display: 'none' }}
				/> */}
				<div className="right">
					<div className="emoji">
						<span className="emoji-selector" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
							<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
								viewBox="0 0 120 120" enableBackground="new 0 0 120 120" xmlSpace="preserve">
								<g>
									<circle fill="#E8EBEC" cx="51.502" cy="82.699" r="14" />
									<circle fill="#E8EBEC" cx="87.646" cy="61.883" r="12" />
									<circle fill="#E8EBEC" cx="39.481" cy="42.382" r="20" />
									<g>
										<path fill="#BDC3D8" d="M53.778,30.133h-12c-7.732,0-14,6.269-14,14v12c0,7.732,6.268,14,14,14h12c7.732,0,14-6.268,14-14v-12
			C67.778,36.402,61.51,30.133,53.778,30.133z"/>
										<path fill="#FFFFFF" d="M49.778,30.133h-8c-7.732,0-14,6.269-14,14v8c0,7.731,6.268,14,14,14h8c7.732,0,14-6.269,14-14v-8
			C63.778,36.402,57.51,30.133,49.778,30.133z"/>
										<path fill="#21365F" d="M53.778,70.883h-12c-8.133,0-14.75-6.617-14.75-14.75v-12c0-8.133,6.617-14.75,14.75-14.75h12
			c8.133,0,14.75,6.617,14.75,14.75v12C68.528,64.266,61.911,70.883,53.778,70.883z M41.778,30.883
			c-7.306,0-13.25,5.944-13.25,13.25v12c0,7.306,5.944,13.25,13.25,13.25h12c7.306,0,13.25-5.944,13.25-13.25v-12
			c0-7.306-5.944-13.25-13.25-13.25H41.778z"/>
										<path fill="#FFFFFF" d="M36.278,45.133c0,2.209,1.791,4,4,4c2.209,0,4-1.791,4-4c0-0.732-0.212-1.41-0.555-2.001h-6.89
			C36.489,43.723,36.278,44.401,36.278,45.133z"/>
										<path fill="#BDC3D8" d="M41.14,43.132c0.087,0.319,0.137,0.653,0.137,1.001c0,2.093-1.613,3.791-3.662,3.966
			c0.708,0.636,1.635,1.034,2.662,1.034c2.209,0,4-1.791,4-4c0-0.732-0.212-1.41-0.555-2.001H41.14z"/>
										<path fill="#21365F" d="M40.278,49.883c-2.619,0-4.75-2.131-4.75-4.75c0-0.829,0.221-1.63,0.656-2.378
			c0.134-0.231,0.381-0.373,0.648-0.373h6.89c0.267,0,0.514,0.142,0.648,0.373c0.436,0.749,0.657,1.549,0.657,2.378
			C45.028,47.752,42.897,49.883,40.278,49.883z M37.292,43.882c-0.175,0.404-0.264,0.823-0.264,1.251c0,1.792,1.458,3.25,3.25,3.25
			c1.792,0,3.25-1.458,3.25-3.25c0-0.428-0.089-0.847-0.264-1.251H37.292z"/>
										<path fill="#FFFFFF" d="M51.834,43.132c-0.344,0.591-0.555,1.269-0.555,2.001c0,2.209,1.791,4,4,4s4-1.791,4-4
			c0-0.732-0.211-1.41-0.555-2.001H51.834z"/>
										<path fill="#BDC3D8" d="M59.279,45.133c0-0.732-0.211-1.41-0.555-2.001h-2.583c0.087,0.319,0.137,0.653,0.137,1.001
			c0,2.093-1.613,3.791-3.662,3.966c0.708,0.636,1.635,1.034,2.662,1.034C57.488,49.133,59.279,47.342,59.279,45.133z"/>
										<path fill="#21365F" d="M55.279,49.883c-2.619,0-4.75-2.131-4.75-4.75c0-0.829,0.221-1.63,0.656-2.378
			c0.134-0.231,0.381-0.373,0.648-0.373h6.89c0.267,0,0.514,0.142,0.648,0.373c0.436,0.749,0.657,1.549,0.657,2.378
			C60.029,47.752,57.898,49.883,55.279,49.883z M52.293,43.882c-0.175,0.404-0.264,0.823-0.264,1.251c0,1.792,1.458,3.25,3.25,3.25
			s3.25-1.458,3.25-3.25c0-0.428-0.089-0.847-0.264-1.251H52.293z"/>
										<path fill="#21365F" d="M55.778,54.884h-18c-0.414,0-0.75-0.336-0.75-0.75c0-0.414,0.336-0.75,0.75-0.75h18
			c0.414,0,0.75,0.336,0.75,0.75C56.528,54.548,56.192,54.884,55.778,54.884z"/>
										<path fill="#FFFFFF" d="M42.778,61.133L42.778,61.133c-2.762,0-5-2.238-5-5v-2h10v2C47.778,58.895,45.539,61.133,42.778,61.133z"
										/>
										<path fill="#BDC3D8" d="M44.778,54.133v2c0,2.235-1.477,4.105-3.5,4.745c0.476,0.151,0.974,0.255,1.5,0.255c2.761,0,5-2.238,5-5
			v-2H44.778z"/>
										<path fill="#21365F" d="M42.778,61.883c-3.171,0-5.75-2.579-5.75-5.75v-2c0-0.414,0.336-0.75,0.75-0.75h10
			c0.414,0,0.75,0.336,0.75,0.75v2C48.528,59.304,45.948,61.883,42.778,61.883z M38.528,54.883v1.25c0,2.344,1.907,4.25,4.25,4.25
			c2.343,0,4.25-1.906,4.25-4.25v-1.25H38.528z"/>
										<path fill="#21365F" d="M44.278,39.882h-8c-0.414,0-0.75-0.336-0.75-0.75s0.336-0.75,0.75-0.75h8c0.414,0,0.75,0.336,0.75,0.75
			S44.692,39.882,44.278,39.882z"/>
										<path fill="#21365F" d="M59.279,39.882h-8c-0.414,0-0.75-0.336-0.75-0.75s0.336-0.75,0.75-0.75h8c0.414,0,0.75,0.336,0.75,0.75
			S59.693,39.882,59.279,39.882z"/>
										<path fill="#BDC3D8" d="M77.78,54.136h-12c-7.732,0-14,6.268-14,14v12c0,7.731,6.268,14,14,14h12c7.732,0,14-6.269,14-14v-12
			C91.78,60.404,85.512,54.136,77.78,54.136z"/>
										<path fill="#FFFFFF" d="M73.78,54.136H65.78c-7.732,0-14,6.268-14,14v7.999c0,7.732,6.268,14,14,14h7.999c7.732,0,14-6.268,14-14
			v-7.999C87.78,60.404,81.512,54.136,73.78,54.136z"/>
										<path fill="#21365F" d="M77.78,94.886h-12c-8.133,0-14.75-6.617-14.75-14.75v-12c0-8.133,6.617-14.75,14.75-14.75h12
			c8.133,0,14.75,6.617,14.75,14.75v12C92.53,88.269,85.914,94.886,77.78,94.886z M65.78,54.886c-7.306,0-13.25,5.944-13.25,13.25
			v12c0,7.306,5.944,13.25,13.25,13.25h12c7.306,0,13.25-5.944,13.25-13.25v-12c0-7.306-5.944-13.25-13.25-13.25H65.78z"/>
										<path fill="#21365F" d="M84.231,64.936c-0.192,0-0.384-0.073-0.53-0.22c-1.181-1.181-2.75-1.831-4.419-1.831
			c-1.67,0-3.239,0.65-4.42,1.831c-0.293,0.293-0.767,0.293-1.06,0c-0.293-0.293-0.293-0.768,0-1.061
			c1.464-1.464,3.41-2.271,5.48-2.271c2.07,0,4.016,0.807,5.48,2.271c0.293,0.293,0.293,0.768,0,1.061
			C84.615,64.863,84.423,64.936,84.231,64.936z"/>
										<path fill="#21365F" d="M69.23,64.936c-0.192,0-0.384-0.073-0.53-0.22c-1.181-1.181-2.75-1.831-4.42-1.831
			c-1.669,0-3.239,0.65-4.419,1.831c-0.293,0.293-0.768,0.293-1.061,0c-0.293-0.293-0.293-0.768,0-1.061
			c1.464-1.464,3.41-2.271,5.48-2.271c2.07,0,4.017,0.807,5.481,2.271c0.293,0.293,0.293,0.768,0,1.061
			C69.613,64.863,69.422,64.936,69.23,64.936z"/>
										<path fill="#FFFFFF" d="M64.28,65.635L64.28,65.635c-1.933,0-3.5,1.567-3.5,3.5l0,0c0,1.933,1.567,3.5,3.5,3.5l0,0
			c1.933,0,3.5-1.567,3.5-3.5l0,0C67.78,67.202,66.213,65.635,64.28,65.635z"/>
										<path fill="#BDC3D8" d="M64.28,65.635c-0.173,0-0.338,0.026-0.504,0.051c0.62,0.632,1.004,1.495,1.004,2.449
			c0,1.761-1.304,3.203-2.996,3.449c0.635,0.647,1.518,1.051,2.496,1.051c1.933,0,3.5-1.567,3.5-3.5S66.213,65.635,64.28,65.635z"/>
										<path fill="#21365F" d="M64.279,73.385c-2.343,0-4.25-1.906-4.25-4.25c0-2.344,1.907-4.25,4.25-4.25c2.343,0,4.25,1.906,4.25,4.25
			C68.529,71.479,66.623,73.385,64.279,73.385z M64.279,66.385c-1.517,0-2.75,1.233-2.75,2.75s1.233,2.75,2.75,2.75
			c1.517,0,2.75-1.233,2.75-2.75S65.796,66.385,64.279,66.385z"/>
										<path fill="#FFFFFF" d="M79.281,65.635L79.281,65.635c-1.933,0-3.5,1.567-3.5,3.5l0,0c0,1.933,1.567,3.5,3.5,3.5l0,0
			c1.933,0,3.5-1.567,3.5-3.5l0,0C82.781,67.202,81.215,65.635,79.281,65.635z"/>
										<path fill="#BDC3D8" d="M79.281,65.635c-0.173,0-0.338,0.026-0.504,0.051c0.62,0.632,1.004,1.495,1.004,2.449
			c0,1.761-1.304,3.203-2.996,3.449c0.635,0.647,1.518,1.051,2.496,1.051c1.933,0,3.5-1.567,3.5-3.5S81.215,65.635,79.281,65.635z"
										/>
										<path fill="#21365F" d="M79.281,73.385c-2.343,0-4.25-1.906-4.25-4.25c0-2.344,1.907-4.25,4.25-4.25c2.343,0,4.25,1.906,4.25,4.25
			C83.531,71.479,81.625,73.385,79.281,73.385z M79.281,66.385c-1.517,0-2.75,1.233-2.75,2.75s1.233,2.75,2.75,2.75
			c1.517,0,2.75-1.233,2.75-2.75S80.798,66.385,79.281,66.385z"/>
										<path fill="#FFFFFF" d="M81.78,77.136c0,5.522-4.477,10-10,10c-5.523,0-10-4.478-10-10H81.78z" />
										<path fill="#BDC3D8" d="M75.78,77.136c0,4.478-2.943,8.266-6.999,9.54c0.947,0.298,1.955,0.46,3,0.46c5.523,0,10-4.478,10-10
			H75.78z"/>
										<path fill="#21365F" d="M71.78,87.886c-5.928,0-10.75-4.822-10.75-10.75c0-0.414,0.336-0.75,0.75-0.75h20
			c0.414,0,0.75,0.336,0.75,0.75C82.53,83.064,77.708,87.886,71.78,87.886z M62.561,77.886c0.383,4.751,4.371,8.5,9.22,8.5
			c4.848,0,8.837-3.749,9.22-8.5H62.561z"/>
										<path fill="#FFFFFF" d="M65.011,84.481c1.782,1.644,4.154,2.655,6.769,2.655c2.615,0,4.988-1.012,6.769-2.655
			C74.423,81.883,69.138,81.883,65.011,84.481z"/>
										<path fill="#BDC3D8" d="M78.55,84.481c-1.333-0.84-2.789-1.403-4.287-1.7c0.438,0.209,0.87,0.438,1.286,0.7
			c-1.782,1.644-4.154,2.655-6.769,2.655c-0.553,0-1.091-0.055-1.619-0.142c1.381,0.726,2.95,1.142,4.619,1.142
			C74.395,87.136,76.768,86.124,78.55,84.481z"/>
										<path fill="#21365F" d="M71.78,87.886c-2.698,0-5.282-1.014-7.278-2.854c-0.172-0.158-0.26-0.388-0.239-0.62
			c0.021-0.232,0.15-0.442,0.348-0.566c4.354-2.74,9.983-2.74,14.338,0c0.198,0.124,0.326,0.334,0.348,0.566
			c0.021,0.232-0.067,0.462-0.239,0.62C77.063,86.872,74.478,87.886,71.78,87.886z M66.326,84.595
			c1.581,1.161,3.483,1.791,5.454,1.791c1.971,0,3.873-0.63,5.454-1.791C73.826,82.853,69.735,82.853,66.326,84.595z"/>
										<path fill="#21365F" d="M72.163,33.884h-1.385c-0.414,0-0.75-0.336-0.75-0.75c0-0.414,0.336-0.75,0.75-0.75h1.385
			c0.414,0,0.75,0.336,0.75,0.75C72.913,33.548,72.577,33.884,72.163,33.884z"/>
										<path fill="#21365F" d="M76.778,33.884h-1.384c-0.414,0-0.75-0.336-0.75-0.75c0-0.414,0.336-0.75,0.75-0.75h1.384
			c0.414,0,0.75,0.336,0.75,0.75C77.528,33.548,77.193,33.884,76.778,33.884z"/>
										<path fill="#21365F" d="M73.778,36.884c-0.414,0-0.75-0.336-0.75-0.75v-1.385c0-0.414,0.336-0.75,0.75-0.75
			c0.414,0,0.75,0.336,0.75,0.75v1.385C74.528,36.548,74.193,36.884,73.778,36.884z"/>
										<path fill="#21365F" d="M73.778,32.268c-0.414,0-0.75-0.336-0.75-0.75v-1.384c0-0.414,0.336-0.75,0.75-0.75
			c0.414,0,0.75,0.336,0.75,0.75v1.384C74.528,31.932,74.193,32.268,73.778,32.268z"/>
										<path fill="#21365F" d="M87.165,39.884H85.78c-0.414,0-0.75-0.336-0.75-0.75c0-0.414,0.336-0.75,0.75-0.75h1.385
			c0.414,0,0.75,0.336,0.75,0.75C87.915,39.548,87.579,39.884,87.165,39.884z"/>
										<path fill="#21365F" d="M91.78,39.884h-1.384c-0.414,0-0.75-0.336-0.75-0.75c0-0.414,0.336-0.75,0.75-0.75h1.384
			c0.414,0,0.75,0.336,0.75,0.75C92.53,39.548,92.194,39.884,91.78,39.884z"/>
										<path fill="#21365F" d="M88.78,42.884c-0.414,0-0.75-0.336-0.75-0.75v-1.385c0-0.414,0.336-0.75,0.75-0.75s0.75,0.336,0.75,0.75
			v1.385C89.53,42.548,89.194,42.884,88.78,42.884z"/>
										<path fill="#21365F" d="M88.78,38.269c-0.414,0-0.75-0.336-0.75-0.75v-1.385c0-0.414,0.336-0.75,0.75-0.75s0.75,0.336,0.75,0.75
			v1.385C89.53,37.933,89.194,38.269,88.78,38.269z"/>
										<path fill="#21365F" d="M79.164,46.885h-1.384c-0.414,0-0.75-0.336-0.75-0.75c0-0.414,0.336-0.75,0.75-0.75h1.384
			c0.414,0,0.75,0.336,0.75,0.75C79.914,46.549,79.578,46.885,79.164,46.885z"/>
										<path fill="#21365F" d="M83.779,46.885h-1.385c-0.414,0-0.75-0.336-0.75-0.75c0-0.414,0.336-0.75,0.75-0.75h1.385
			c0.414,0,0.75,0.336,0.75,0.75C84.529,46.549,84.194,46.885,83.779,46.885z"/>
										<path fill="#21365F" d="M80.779,49.885c-0.414,0-0.75-0.336-0.75-0.75V47.75c0-0.414,0.336-0.75,0.75-0.75
			c0.414,0,0.75,0.336,0.75,0.75v1.385C81.529,49.549,81.194,49.885,80.779,49.885z"/>
										<path fill="#21365F" d="M80.779,45.27c-0.414,0-0.75-0.336-0.75-0.75v-1.385c0-0.414,0.336-0.75,0.75-0.75
			c0.414,0,0.75,0.336,0.75,0.75v1.385C81.529,44.934,81.194,45.27,80.779,45.27z"/>
										<path fill="#21365F" d="M42.16,85.889h-1.385c-0.414,0-0.75-0.336-0.75-0.75c0-0.414,0.336-0.75,0.75-0.75h1.385
			c0.414,0,0.75,0.336,0.75,0.75C42.91,85.553,42.574,85.889,42.16,85.889z"/>
										<path fill="#21365F" d="M46.776,85.889h-1.384c-0.414,0-0.75-0.336-0.75-0.75c0-0.414,0.336-0.75,0.75-0.75h1.384
			c0.414,0,0.75,0.336,0.75,0.75C47.526,85.553,47.19,85.889,46.776,85.889z"/>
										<path fill="#21365F" d="M43.776,88.889c-0.414,0-0.75-0.336-0.75-0.75v-1.385c0-0.414,0.336-0.75,0.75-0.75
			c0.414,0,0.75,0.336,0.75,0.75v1.385C44.526,88.553,44.19,88.889,43.776,88.889z"/>
										<path fill="#21365F" d="M43.776,84.274c-0.414,0-0.75-0.336-0.75-0.75v-1.385c0-0.414,0.336-0.75,0.75-0.75
			c0.414,0,0.75,0.336,0.75,0.75v1.385C44.526,83.938,44.19,84.274,43.776,84.274z"/>
										<path fill="#21365F" d="M31.159,79.888h-1.384c-0.414,0-0.75-0.336-0.75-0.75c0-0.414,0.336-0.75,0.75-0.75h1.384
			c0.414,0,0.75,0.336,0.75,0.75C31.909,79.552,31.573,79.888,31.159,79.888z"/>
										<path fill="#21365F" d="M35.775,79.888H34.39c-0.414,0-0.75-0.336-0.75-0.75c0-0.414,0.336-0.75,0.75-0.75h1.385
			c0.414,0,0.75,0.336,0.75,0.75C36.525,79.552,36.189,79.888,35.775,79.888z"/>
										<path fill="#21365F" d="M32.775,82.888c-0.414,0-0.75-0.336-0.75-0.75v-1.384c0-0.414,0.336-0.75,0.75-0.75
			c0.414,0,0.75,0.336,0.75,0.75v1.384C33.525,82.552,33.189,82.888,32.775,82.888z"/>
										<path fill="#21365F" d="M32.775,78.273c-0.414,0-0.75-0.336-0.75-0.75v-1.385c0-0.414,0.336-0.75,0.75-0.75
			c0.414,0,0.75,0.336,0.75,0.75v1.385C33.525,77.937,33.189,78.273,32.775,78.273z"/>
									</g>
								</g>
							</svg>
							{showEmojiPicker && <EmojiPicker previewConfig={{ showPreview: false }} onEmojiClick={handleEmojiClick} />}
						</span>
					</div>
					<button type="submit" className="send-btn" ref={sendRef} onClick={handleSendMessage}>
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

			</div>
		</div>
	);
};

export default MessageInput;
