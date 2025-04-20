import React, { useState, useEffect } from "react";
import {
	Container,
	Row,
	Col,
	Button,
	Alert,
	Modal,
	Badge,
	ButtonGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./admin.css";

import LoadingSpinner from "../components/LoadingSpinner";
import { formService } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Admin = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [requests, setRequests] = useState([]);
	const [filteredRequests, setFilteredRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [currentRequest, setCurrentRequest] = useState(null);
	const [showStatusModal, setShowStatusModal] = useState(false);
	const [activeFilter, setActiveFilter] = useState("all");

	// Fetch all forms/requests when component mounts
	useEffect(() => {
		fetchAllForms();
	}, []);

	// Apply filters when requests or active filter changes
	useEffect(() => {
		filterRequests(activeFilter);
	}, [requests, activeFilter]);

	const fetchAllForms = async () => {
		try {
			setLoading(true);
			setError("");
			const data = await formService.getAllForms();
			setRequests(Array.isArray(data) ? data : []);
			setLoading(false);
		} catch (err) {
			console.error("Error in fetchAllForms:", err);
			setError("Failed to load requests. Please try again.");
			setRequests([]);
			setLoading(false);
		}
	};

	const filterRequests = (filter) => {
		switch (filter) {
			case "pending":
				setFilteredRequests(
					requests.filter((req) => !req.status || req.status === "Pending")
				);
				break;
			case "approved":
				setFilteredRequests(
					requests.filter((req) => req.status && req.status === "Approved")
				);
				break;
			case "rejected":
				setFilteredRequests(
					requests.filter((req) => req.status && req.status === "Rejected")
				);
				break;
			case "all":
			default:
				setFilteredRequests(requests);
				break;
		}
	};

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	const handleStatusUpdate = (request) => {
		setCurrentRequest(request);
		setShowStatusModal(true);
	};

	const confirmStatusUpdate = async (status) => {
		if (!currentRequest) return;

		try {
			setLoading(true);

			// Create FormData for update
			const formData = new FormData();

			// Copy all existing fields
			formData.append("type", currentRequest.type || "General");
			formData.append("title", currentRequest.title || currentRequest.type);
			formData.append("description", currentRequest.description || "");
			formData.append("status", status); // Set the new status
			formData.append("username", currentRequest.username);

			// Update the form status
			const updatedForm = await formService.updateForm(
				currentRequest._id,
				formData
			);

			// Update local state
			const updatedRequests = requests.map((req) =>
				req._id === currentRequest._id ? updatedForm.form || updatedForm : req
			);

			setRequests(updatedRequests);
			setShowStatusModal(false);
			setCurrentRequest(null);
			setLoading(false);
		} catch (err) {
			console.error("Error updating request status:", err);
			setError("Failed to update request status. Please try again.");
			setLoading(false);
		}
	};

	const retryLoadRequests = () => {
		fetchAllForms();
	};

	// Custom admin view of the request card
	const AdminRequestCard = ({ request }) => {
		return (
			<div className="admin-request-card">
				<div className="d-flex justify-content-between flex-wrap">
					<div className="mb-3">
						<h5>{request.title || request.type || "Untitled Request"}</h5>
						<p className="text-muted mb-1">Submitted by: {request.username}</p>
						<p className="mb-2">{request.description}</p>
						<div>
							<Badge bg="secondary" className="me-2">
								{request.type || "General"}
							</Badge>
							<Badge
								bg={
									request.status?.toLowerCase().includes("approve")
										? "success"
										: request.status?.toLowerCase().includes("reject")
										? "danger"
										: "warning"
								}
							>
								{request.status || "Pending"}
							</Badge>
							{request.docs && request.docs.length > 0 && (
								<Badge bg="info" className="ms-2">
									{request.docs.length} Document(s)
								</Badge>
							)}
						</div>
					</div>
					<div className="d-flex flex-column">
						<Button
							variant="outline-success"
							size="sm"
							className="mb-2"
							onClick={() => handleStatusUpdate(request)}
							disabled={request.status === "Approved"}
						>
							Approve
						</Button>
						<Button
							variant="outline-danger"
							size="sm"
							onClick={() => handleStatusUpdate(request)}
							disabled={request.status === "Rejected"}
						>
							Reject
						</Button>
					</div>
				</div>
			</div>
		);
	};

	return (
		<Container className="admin-dashboard-container py-4">
			<Row className="welcome-section mb-4">
				<Col>
					<h1 className="admin-heading">Admin Dashboard</h1>
					<p className="welcome-subtext">Review and manage all form requests</p>
				</Col>
				<Col xs="auto">
					<Button
						variant="outline-danger"
						className="logout-btn"
						onClick={handleLogout}
					>
						Logout
					</Button>
				</Col>
			</Row>

			<Row className="status-filter-container">
				<Col>
					<h6 className="mb-2">Filter by status:</h6>
					<ButtonGroup aria-label="Filter requests">
						<Button
							variant={activeFilter === "all" ? "primary" : "outline-primary"}
							className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
							onClick={() => setActiveFilter("all")}
						>
							All
						</Button>
						<Button
							variant={
								activeFilter === "pending" ? "primary" : "outline-primary"
							}
							className={`filter-btn ${
								activeFilter === "pending" ? "active" : ""
							}`}
							onClick={() => setActiveFilter("pending")}
						>
							Pending
						</Button>
						<Button
							variant={
								activeFilter === "approved" ? "primary" : "outline-primary"
							}
							className={`filter-btn ${
								activeFilter === "approved" ? "active" : ""
							}`}
							onClick={() => setActiveFilter("approved")}
						>
							Approved
						</Button>
						<Button
							variant={
								activeFilter === "rejected" ? "primary" : "outline-primary"
							}
							className={`filter-btn ${
								activeFilter === "rejected" ? "active" : ""
							}`}
							onClick={() => setActiveFilter("rejected")}
						>
							Rejected
						</Button>
					</ButtonGroup>
				</Col>
			</Row>

			<Row className="request-list">
				<Col>
					<h2 className="section-heading mb-3">All Requests</h2>
					{loading ? (
						<LoadingSpinner message="Loading requests..." />
					) : error ? (
						<Alert variant="danger">
							{error}
							<div className="mt-2">
								<Button
									variant="outline-danger"
									size="sm"
									onClick={retryLoadRequests}
								>
									Try Again
								</Button>
							</div>
						</Alert>
					) : filteredRequests.length === 0 ? (
						<div className="empty-state">
							<p>
								No {activeFilter !== "all" ? activeFilter : ""} requests found.
							</p>
						</div>
					) : (
						filteredRequests.map((request) => (
							<AdminRequestCard
								key={request._id || request.id}
								request={request}
							/>
						))
					)}
				</Col>
			</Row>

			{/* Status Update Confirmation Modal */}
			<Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Update Request Status</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Please select an action for this request:
					<div className="mt-3">
						<strong>Request Details:</strong>
						<p className="mb-1">
							Title: {currentRequest?.title || currentRequest?.type}
						</p>
						<p className="mb-1">From: {currentRequest?.username}</p>
						<p>Type: {currentRequest?.type || "General"}</p>
						<p>Current Status: {currentRequest?.status || "Pending"}</p>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowStatusModal(false)}>
						Cancel
					</Button>
					<Button
						variant="success"
						onClick={() => confirmStatusUpdate("Approved")}
						disabled={currentRequest?.status === "Approved"}
					>
						Approve
					</Button>
					<Button
						variant="danger"
						onClick={() => confirmStatusUpdate("Rejected")}
						disabled={currentRequest?.status === "Rejected"}
					>
						Reject
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
};

export default Admin;
