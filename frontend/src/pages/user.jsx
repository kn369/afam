import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./user.css";

import RequestCard from "../components/requestCard";
import RequestModal from "../components/RequestModal";

const User = ({ username = "Guest" }) => {
	const [showModal, setShowModal] = useState(false);
	const [requests, setRequests] = useState([
		{ id: 1, title: "Library Access", status: "Pending", date: "2025-04-10" },
		{ id: 2, title: "Lab Equipment", status: "Approved", date: "2025-04-05" },
		{ id: 3, title: "Conference Room", status: "Rejected", date: "2025-03-28" },
	]);
	const [newRequest, setNewRequest] = useState({ title: "", description: "" });

	const handleSubmitRequest = (e) => {
		e.preventDefault();
		const request = {
			id: requests.length + 1,
			title: newRequest.title,
			description: newRequest.description,
			status: "Pending",
			date: new Date().toISOString().split("T")[0],
		};
		setRequests([...requests, request]);
		setNewRequest({ title: "", description: "" });
		setShowModal(false);
	};

	return (
		<Container className="dashboard-container py-4">
			<Row className="welcome-section mb-4">
				<Col>
					<h1 className="welcome-heading">Welcome, {username}!</h1>
					<p className="welcome-subtext">
						Manage your form requests and submissions
					</p>
				</Col>
				<Col xs="auto">
					<Button
						variant="primary"
						className="add-request-btn"
						onClick={() => setShowModal(true)}
					>
						+ New Request
					</Button>
				</Col>
			</Row>

			<Row className="request-list">
				<Col>
					<h2 className="section-heading mb-3">Your Requests</h2>
					{requests.length === 0 ? (
						<div className="empty-state">
							<p>You haven't submitted any requests yet.</p>
						</div>
					) : (
						requests.map((request) => <RequestCard request={request} />)
					)}
				</Col>
			</Row>

			{/* Add Request Modal */}
			<RequestModal
				showModal={showModal}
				setShowModal={setShowModal}
				newRequest={newRequest}
				setNewRequest={setNewRequest}
				handleSubmitRequest={handleSubmitRequest}
			/>
		</Container>
	);
};

export default User;
