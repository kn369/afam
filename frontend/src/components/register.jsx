import React from "react";
import { Container, Form, Button } from "react-bootstrap";

import "./register.css"

const Register = ({ setIsLogin }) => {
    return (
			<Container id="wrapper">
				<h1 id="heading">Register</h1>
				<Form id="form">
					<Form.Label htmlFor="username">Username</Form.Label>
					<Form.Control
						id="username"
						type="text"
						style={{ pointerEvents: "auto" }}
					/>
					<Form.Label htmlFor="password">Password</Form.Label>
					<Form.Control
						id="password"
						type="password"
						style={{ pointerEvents: "auto" }}
					/>
					<Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
					<Form.Control
						id="confirmPassword"
						type="password"
						style={{ pointerEvents: "auto" }}
					/>
					<Button type="submit">Register</Button>
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