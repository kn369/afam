import Login from "../components/login";
import Register from "../components/register";
import { Container } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SplineScene from "../components/splineScene";
import { useAuth } from "../context/AuthContext";
import "./home.css";

const Home = () => {
	const [isLogin, setIsLogin] = useState(true);
	const { isAuthenticated, loading } = useAuth();
	const navigate = useNavigate();

	// Redirect to dashboard if already logged in
	useEffect(() => {
		if (!loading && isAuthenticated) {
			navigate("/dashboard");
		}
	}, [isAuthenticated, loading, navigate]);

	// If still checking auth status, show a loading indicator
	if (loading) {
		return (
			<Container
				fluid
				className="main-container d-flex justify-content-center align-items-center"
				style={{ height: "100vh" }}
			>
				<div>Loading...</div>
			</Container>
		);
	}

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
							<Login setIsLogin={setIsLogin} style={{PointerEvent: "none"}} />
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
