import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

import "./register.css";

const Register = ({ setIsLogin }) => {
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const { register } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");
		setSuccess(false);

		const username = e.target.username.value;
		const email = e.target.email.value;
		const password = e.target.password.value;
		const confirmPassword = e.target.confirmPassword.value;

		// Validate passwords match
		if (password !== confirmPassword) {
			setError("Passwords do not match");
			setIsLoading(false);
			return;
		}

		try {
			await register({ username, email, password });
			setSuccess(true);
			setIsLoading(false);
			// Auto switch to login after successful registration
			setTimeout(() => setIsLogin(true), 2000);
		} catch (err) {
			setIsLoading(false);
			setError(err.message || "Registration failed. Please try again.");
		}
	};

	return (
		<Container id="wrapper">
			<h1 id="heading">Register</h1>
			{error && <Alert variant="danger">{error}</Alert>}
			{success && (
				<Alert variant="success">
					Registration successful! Redirecting to login...
				</Alert>
			)}
			<Form id="form" onSubmit={handleSubmit}>
				<Form.Label htmlFor="username">Username</Form.Label>
				<Form.Control
					id="username"
					type="text"
					style={{ pointerEvents: "auto" }}
					required
				/>
				<Form.Label htmlFor="email">Email</Form.Label>
				<Form.Control
					id="email"
					type="email"
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
				<Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
				<Form.Control
					id="confirmPassword"
					type="password"
					style={{ pointerEvents: "auto" }}
					required
				/>
				<Button type="submit" disabled={isLoading} style={{ pointerEvents: "auto" }}>
					{isLoading ? "Registering..." : "Register"}
				</Button>
			</Form>
			<div
				id="registerLink"
				onClick={() => setIsLogin(true)}
				style={{ pointerEvents: "auto" }}
			>
				Already have an account? Login Instead.
			</div>
		</Container>
	);
};

export default Register;
