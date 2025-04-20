import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "./login.css";

const Login = ({ setIsLogin }) => {
	const navigate = useNavigate();
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		const username = e.target.username.value;
		const password = e.target.password.value;

		try {
			const data = await login(username, password);
			setIsLoading(false);

			// Check role directly and navigate accordingly
			if (data.user && data.user.role === "admin") {
				// Small delay to ensure context is updated
				setTimeout(() => {
					console.log("Admin user detected - navigating to admin dashboard");
					navigate("/admin", { replace: true });
				}, 100);
			} else {
				console.log("Regular user detected - navigating to user dashboard");
				navigate("/dashboard", { replace: true });
			}
		} catch (err) {
			setIsLoading(false);
			setError(err.message || "Login failed. Please check your credentials.");
		}
	};

	return (
		<Container id="wrapper" style={{ padding: 0 }}>
			<h1 id="heading">Login</h1>
			{error && <Alert variant="danger">{error}</Alert>}
			<Form id="form" onSubmit={handleSubmit}>
				<Form.Label htmlFor="username">Username</Form.Label>
				<Form.Control
					id="username"
					type="text"
					style={{ pointerEvents: "auto" }}
					required
				/>
				<Form.Label htmlFor="password">Password</Form.Label>
				<Form.Control
					id="password"
					type="password"
					style={{ pointerEvents: "auto" }}
					required
				/>
				<Button
					type="submit"
					disabled={isLoading}
					style={{ pointerEvents: "auto" }}
				>
					{isLoading ? "Logging in..." : "Login"}
				</Button>
			</Form>
			<text
				id="registerLink"
				onClick={() => setIsLogin(false)}
				style={{ pointerEvents: "auto" }}
			>
				New User? Register Instead.
			</text>
		</Container>
	);
};

export default Login;
