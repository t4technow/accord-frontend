// React hooks and types
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// axios instance
import axiosInstance from "@/config/axiosInstance";

const Register = () => {
	const navigate = useNavigate();

	// state to handle loading
	const [isValidating, setIsValidating] = useState(false);

	const [errors, setErrors] = useState({
		email: "",
		username: "",
		password: "",
	});

	// reference to input fields
	const emailRef = useRef<HTMLInputElement | null>(null);
	const usernameRef = useRef<HTMLInputElement | null>(null);
	const passwordRef = useRef<HTMLInputElement | null>(null);

	// Function to Validate form and set errors
	function validateForm() {
		let isValid = true;
		let updatedErrors = {
			email: "",
			username: "",
			password: "",
		};

		if (!emailRef.current?.value) {
			updatedErrors.email = "Email is required";
			isValid = false;
		}
		if (!passwordRef.current?.value) {
			updatedErrors.password = "Password is required";
			isValid = false;
		} else if (passwordRef.current?.value.length < 4) {
			updatedErrors.password = "Password must contain at least 4 characters";
			isValid = false;
		}
		if (!usernameRef.current?.value) {
			updatedErrors.username = "Username is required";
			isValid = false;
		} else if (usernameRef.current?.value.length < 4) {
			updatedErrors.username = "Username must contain at least 4 characters";
			isValid = false;
		}
		setErrors(updatedErrors);
		return isValid;
	}

	// Function to register new user
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Set Loading animation
		setIsValidating(true);
		if (validateForm()) {
			// Register user if form is valid
			axiosInstance
				.post("user/register/", {
					email: emailRef.current?.value,
					username: usernameRef.current?.value,
					password: passwordRef.current?.value,
				})
				.then(() => {
					// On Successful registration
					// set loading to false
					setIsValidating(false);

					// Redirect user to login page along with message
					navigate("login", {
						state: {
							title: "Registered successfully",
							message: `Account created successfully! Please verify your email to login`,
						},
					});
				})
				.catch((err) => {
					console.log(err);
					if (err.response && err.response.data) {
						setErrors(err.response.data);
						setIsValidating(false);
					}
					setIsValidating(false);
				});
		}
	};

	return (
		<form
			name="loginForm"
			className="login-form"
			method="post"
			onSubmit={handleSubmit}
		>
			<div className="header">
				<h2 className="heading">Welcome to the Club</h2>
				<p className="sub-text">we are so excited to have you here</p>
			</div>
			<div className="input-wrapper">
				<div className="input-element">
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
				<div className="input-element">
					<label htmlFor="username">
						{errors && errors.username ? (
							<>
								<span className="red"> {errors.username}</span>
							</>
						) : (
							<>
								Username <span className="red">*</span>
							</>
						)}
					</label>
					<input type="text" name="username" id="username" ref={usernameRef} />
				</div>
				<div className="input-element">
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
						"Sign Up"
					)}
				</button>

				<p className="register-link-text">
					Already have an account?{" "}
					<Link to="login" className="link">
						Login
					</Link>
				</p>
			</div>
		</form>
	);
};

export default Register;
