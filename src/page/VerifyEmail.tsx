// React & React Router hooks
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Redux and states stored in redux
import { useDispatch } from "react-redux";
import { loginReducer } from "@/redux/user/userSlice";

// Axios Instance
import axiosInstance from "@/config/axiosInstance";

// Package to decode jwt token
import jwtDecode from "jwt-decode";

// Types
import { AccessDetails } from "@/lib/Types";

const VerifyEmail = () => {
	// uid and token from url params
	const { uid, token } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Function to verify user email
	useEffect(() => {
		axiosInstance
			.get(`user/verify-email/${uid}/${token}/`)
			.then((res) => {
				// on success set tokens to local storage
				localStorage.setItem("access_token", res.data.access);
				localStorage.setItem("refresh_token", res.data.refresh);
				axiosInstance.defaults.headers["Authorization"] =
					"JWT " + res.data.access;

				// Decode access token
				const access_details: AccessDetails = jwtDecode(res.data.access);

				// Update user state in redux with logged in user details
				dispatch(
					loginReducer({
						isAuthenticated: true,
						userId: access_details.user_id,
						username: access_details.username,
						access: res.data.access,
						refresh: res.data.refresh,
					})
				);

				// Redirect user to home with a message
				navigate("/", {
					state: {
						message: "Email verified successfully",
					},
				});
			})
			.catch((err) => {
				// check if email is already verified
				if (err.response.status === 409) {
					navigate("/user/login", {
						state: {
							message: "Email is already verified",
							email: err.response.data.email,
						},
					});
				}
			});
	}, []);

	return (
		<div className="email-container-fluid">
			<h1>Verifying</h1>
			<div className="lds-ellipsis">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
};

export default VerifyEmail;
