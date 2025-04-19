import Login from "../components/login";
import Register from "../components/register";
import { Container } from "react-bootstrap";
import React, { useState } from "react";
import SplineScene from "../components/splineScene";
import "./home.css";

const Home = () => {
	const [isLogin, setIsLogin] = useState(true);

	return (
		<Container
			fluid
			className="main-container"
			style={{ padding: "0", position: "relative" }}
		>
			<div className="spline-container">
				<SplineScene />
			</div>
			<Container fluid id="home" style={{ position: "relative" }}>
				<Container id="brand">AFAM</Container>
				<Container id="centerBox" style={{ pointerEvents: "none" }}>
					<Container style={{ height: "100%", padding: "0.5vh" }}>
						{isLogin ? (
							<Login setIsLogin={setIsLogin} />
						) : (
							<Register setIsLogin={setIsLogin} />
						)}
					</Container>
				</Container>
			</Container>
		</Container>
	);
};

export default Home;
