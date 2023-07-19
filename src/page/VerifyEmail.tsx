import axiosInstance from "@/config/axiosInstance";
import { AccessDetails } from "@/lib/Types";
import { loginReducer } from "@/redux/user/userSlice";
import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const VerifyEmail = () => {
	const { uid, token } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	console.log("uid -->", uid);
	console.log("token--> ", token);

	useEffect(() => {
		axiosInstance
			.get(`user/verify-email/${uid}/${token}/`)
			.then((res) => {
				localStorage.setItem("access_token", res.data.access);
				localStorage.setItem("refresh_token", res.data.refresh);
				axiosInstance.defaults.headers["Authorization"] =
					"JWT " + res.data.access;

				const access_details: AccessDetails = jwtDecode(res.data.access);

				dispatch(
					loginReducer({
						isAuthenticated: true,
						userId: access_details.user_id,
						username: access_details.username,
						access: res.data.access,
						refresh: res.data.refresh,
					})
				);
				navigate("/", {
					state: {
						message: "Email verified successfully",
					},
				});
			})
			.catch((err) => {
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
