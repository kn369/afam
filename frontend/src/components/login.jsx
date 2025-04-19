import React from "react";
import { Container, Form, Button } from "react-bootstrap";

import "./login.css"

const Login = ({ setIsLogin }) => {

	const handleSubmit = (e) => {
		e.preventDefault();

		const username = e.target.username.value;
		const password = e.target.password.value;

		if (username === "admin" && password === "admin123") {
			window.location.href = "/dashboard";
		} else {
			alert("Invalid credentials");
		}
	}

	return (
		<Container id="wrapper" style={{padding: 0}}>
			<h1 id="heading">Login</h1>
			<Form id="form" onSubmit={handleSubmit}>
				<Form.Label htmlFor="username">Username</Form.Label>
				<Form.Control id="username" type="text" style={{pointerEvents: "auto"}} />
				<Form.Label htmlFor="password">Password</Form.Label>
				<Form.Control id="password" type="password" style={{pointerEvents: "auto"}} />
				<Button type="submit" style={{pointerEvents: "auto"}}>Login</Button>
			</Form>
			<text id="registerLink" onClick={() => setIsLogin(false)} style={{pointerEvents: "auto"}}>New User? Register Instead.</text>
		</Container>
	);
};

export default Login;
