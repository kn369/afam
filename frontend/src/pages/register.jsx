import React from "react";
import { Container, Form } from "react-bootstrap";

const register = () => {
	return (
		<Container
			fluid
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
			}}
		>
			<Container style={{ display: "flex", justifyContent: "center" }}>
				<Container>
					<Form>
						<Form.Group className="mb-3" controlId="email">
							<Form.Label>Email address</Form.Label>
							<Form.Control type="email" placeholder="Enter email" />
							<Form.Text>Enter your SRM email address</Form.Text>
						</Form.Group>
						<Form.Group className="mb-3" controlId="password">
							<Form.Label>Password</Form.Label>
							<Form.Control type="password" placeholder="Password" />
						</Form.Group>
					</Form>
				</Container>
				<Container>Image</Container>
			</Container>
		</Container>
	);
};

export default register;
