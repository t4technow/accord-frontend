import { useRef, useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { useDispatch } from "react-redux";
import { loginReducer } from "@/redux/user/userSlice";

import axiosInstance from "@/config/axiosInstance";
import jwtDecode from "jwt-decode";
import { AccessDetails } from "@/lib/Types";

const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const location = useLocation();

	const emailRef = useRef<HTMLInputElement | null>(null);
	const passwordRef = useRef<HTMLInputElement | null>(null);

	const [isValidating, setIsValidating] = useState(false);
	const [errors, setErrors] = useState({ email: "", password: "" });
	const [authError, setAuthError] = useState("");

	useEffect(() => {
		if (location.state) {
			if (location.state.message) {
				setAuthError(location.state.message);
			}
			if (location.state.email && emailRef.current) {
				emailRef?.current?.focus();
				emailRef.current.value = location.state.email;
			}
		}
	}, []);

	function validateForm() {
		let isValid = true;
		let updatedErrors = { email: "", password: "" };

		if (emailRef.current && !emailRef.current.value) {
			updatedErrors.email = "Email is required";
			isValid = false;
		}
		if (passwordRef.current && passwordRef.current.value.length < 4) {
			updatedErrors.password = "Password is required";
			isValid = false;
		}
		setErrors(updatedErrors);
		return isValid;
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (validateForm()) {
			setIsValidating(true);
			axiosInstance
				.post("user/token/", {
					email: emailRef.current?.value,
					password: passwordRef.current?.value,
				})
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
					navigate("/");
				})
				.catch((err) => {
					setIsValidating(false);
					if (err.response) {
						if (err.response.status === 401) {
							setAuthError("invalid username or password");
						}
					} else {
						setAuthError("something went wrong");
					}
				});
		}
	};

	return (
		<>
			<form
				name="loginForm"
				className="login-form"
				method="post"
				onSubmit={handleSubmit}
			>
				<div className="header">
					{authError ? (
						<>
							<h2 className="heading">
								{location.state ? location.state.title : "oops!"}
							</h2>
							<p className="sub-text">{authError}</p>
						</>
					) : (
						<>
							<h2 className="heading">Welcome back!</h2>
							<p className="sub-text">we are so excited to have you back</p>
						</>
					)}
				</div>
				<div className="input-wrapper">
					<div
						className={`input-element ${
							authError && !location.state ? "invalid" : ""
						}`}
					>
						<label htmlFor="email">
							{errors && errors.email ? (
								<>
									<span className="red"> {errors.email}</span>
								</>
							) : (
								<>
									Email <span className="red">*</span>
								</>
							)}
						</label>
						<input type="email" name="email" id="email" ref={emailRef} />
					</div>
					<div
						className={`input-element ${
							authError && !location.state ? "invalid" : ""
						}`}
					>
						<label htmlFor="password">
							{errors && errors.password ? (
								<>
									<span className="red"> {errors.password}</span>
								</>
							) : (
								<>
									Password <span className="red">*</span>
								</>
							)}
						</label>
						<input
							type="password"
							name="password"
							id="password"
							ref={passwordRef}
						/>
						<a href="" className="link">
							Forgot your password ?
						</a>
					</div>

					<button type="submit" className="submit">
						{isValidating ? (
							<div className="lds-ellipsis">
								<div></div>
								<div></div>
								<div></div>
								<div></div>
							</div>
						) : (
							"Login"
						)}
					</button>

					<p className="register-link-text">
						Need an account?{" "}
						<Link to="register" className="link">
							Register here
						</Link>
					</p>
				</div>
			</form>
			<div className="login-image">
				<img src="/login.jpg" alt="" />
			</div>
		</>
	);
};

export default Login;
