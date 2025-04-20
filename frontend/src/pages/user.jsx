import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Alert, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./user.css";

import RequestCard from "../components/requestCard";
import RequestModal from "../components/RequestModal";
import EditRequestModal from "../components/EditRequestModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { formService } from "../services/api";
import { useAuth } from "../context/AuthContext";

const User = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [currentRequest, setCurrentRequest] = useState(null);
	const [newRequest, setNewRequest] = useState({
		title: "",
		description: "",
		type: "General",
		docs: [],
	});

	// Fetch forms/requests when component mounts
	useEffect(() => {
		fetchForms();
	}, []);

	const fetchForms = async () => {
		try {
			setLoading(true);
			setError("");

			if (!user || !user.username) {
				console.error("No user or username found");
				setError(
					"User information not available. Please try logging in again."
				);
				setLoading(false);
				return;
			}

			// Use getFormsByUser instead of getAllForms to only fetch the current user's forms
			const data = await formService.getFormsByUser(user.username);
			setRequests(Array.isArray(data) ? data : []);
			setLoading(false);
		} catch (err) {
			console.error("Error in fetchForms:", err);
			setError("Failed to load requests. Please try again.");
			setRequests([]);
			setLoading(false);
		}
	};

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	const handleSubmitRequest = async (e) => {
		e.preventDefault();
		try {
			// Create FormData object for file uploads
			const formData = new FormData();

			// Add text fields
			formData.append("type", newRequest.type || "General");
			formData.append("title", newRequest.title);
			formData.append("description", newRequest.description);
			formData.append("status", "Pending");
			formData.append("username", user?.username || "");
			formData.append("id", Date.now().toString()); // Generate a temporary ID

			// Add files if any
			if (newRequest.docs && newRequest.docs.length > 0) {
				for (let i = 0; i < newRequest.docs.length; i++) {
					formData.append("docs", newRequest.docs[i]);
				}
			}

			const newForm = await formService.createForm(formData);
			setRequests([...requests, newForm.form || newForm]);

			// Reset form
			setNewRequest({
				title: "",
				description: "",
				type: "General",
				docs: [],
			});
			setShowModal(false);
		} catch (err) {
			console.error("Error creating request:", err);
			setError("Failed to create request. Please try again.");
		}
	};

	// Check if a request is in pending status
	const isPendingRequest = (request) => {
		const status = (request?.status || "pending").toLowerCase();
		return !status.includes("approve") && !status.includes("reject");
	};

	const handleEditClick = (request) => {
		// Only allow editing of pending requests
		if (!isPendingRequest(request)) {
			setError("You cannot edit requests that have been approved or rejected.");
			// Show error for 3 seconds then clear it
			setTimeout(() => setError(""), 3000);
			return;
		}

		setCurrentRequest(request);
		setShowEditModal(true);
	};

	const handleDeleteClick = (request) => {
		// Only allow deletion of pending requests
		if (!isPendingRequest(request)) {
			setError(
				"You cannot delete requests that have been approved or rejected."
			);
			// Show error for 3 seconds then clear it
			setTimeout(() => setError(""), 3000);
			return;
		}

		setCurrentRequest(request);
		setShowDeleteConfirm(true);
	};

	const handleSaveChanges = async (editedRequest) => {
		try {
			setLoading(true);
			// Create FormData for file upload if needed
			const formData = new FormData();

			// Add text fields
			formData.append("type", editedRequest.type || currentRequest.type);
			formData.append("title", editedRequest.title);
			formData.append("description", editedRequest.description);
			formData.append("status", currentRequest.status || "Pending");
			formData.append("username", currentRequest.username);

			// Add files if new ones were selected
			if (editedRequest.docs && editedRequest.docs.length > 0) {
				for (let i = 0; i < editedRequest.docs.length; i++) {
					formData.append("docs", editedRequest.docs[i]);
				}
			}

			// Send update request
			const updatedForm = await formService.updateForm(
				currentRequest._id,
				formData
			);

			// Update local state with the edited request
			const updatedRequests = requests.map((req) =>
				req._id === currentRequest._id ? updatedForm.form || updatedForm : req
			);

			setRequests(updatedRequests);
			setShowEditModal(false);
			setCurrentRequest(null);
			setLoading(false);
		} catch (err) {
			console.error("Error updating request:", err);
			setError("Failed to update request. Please try again.");
			setLoading(false);
		}
	};

	const handleDeleteConfirm = async () => {
		if (!currentRequest) return;

		try {
			setLoading(true);
			await formService.deleteForm(currentRequest._id);

			// Remove the deleted request from the local state
			const updatedRequests = requests.filter(
				(req) => req._id !== currentRequest._id
			);
			setRequests(updatedRequests);

			setShowDeleteConfirm(false);
			setCurrentRequest(null);
			setLoading(false);
		} catch (err) {
			console.error("Error deleting request:", err);
			setError("Failed to delete request. Please try again.");
			setLoading(false);
		}
	};

	const retryLoadRequests = () => {
		fetchForms();
	};

	return (
		<Container className="dashboard-container py-4">
			<Row className="welcome-section mb-4">
				<Col>
					<h1 className="welcome-heading">
						Welcome, {user ? user.username : "User"}!
					</h1>
					<p className="welcome-subtext">
						Manage your form requests and submissions
					</p>
				</Col>
				<Col xs="auto" className="d-flex">
					<Button
						variant="primary"
						className="add-request-btn me-2"
						onClick={() => setShowModal(true)}
					>
						+ New Request
					</Button>
					<Button
						variant="outline-danger"
						className="logout-btn"
						onClick={handleLogout}
					>
						Logout
					</Button>
				</Col>
			</Row>

			<Row className="request-list">
				<Col>
					<h2 className="section-heading mb-3">Your Requests</h2>
					{loading ? (
						<LoadingSpinner message="Loading your requests..." />
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
					) : requests.length === 0 ? (
						<div className="empty-state">
							<p>You haven't submitted any requests yet.</p>
							<Button
								variant="outline-primary"
								size="sm"
								onClick={() => setShowModal(true)}
							>
								Create Your First Request
							</Button>
						</div>
					) : (
						requests.map((request) => (
							<RequestCard
								key={request._id || request.id}
								request={request}
								onEditClick={handleEditClick}
								onDeleteClick={handleDeleteClick}
							/>
						))
					)}
				</Col>
			</Row>

			{/* New Request Modal */}
			<RequestModal
				showModal={showModal}
				setShowModal={setShowModal}
				newRequest={newRequest}
				setNewRequest={setNewRequest}
				handleSubmitRequest={handleSubmitRequest}
			/>

			{/* Edit Request Modal */}
			<EditRequestModal
				showModal={showEditModal}
				setShowModal={setShowEditModal}
				currentRequest={currentRequest}
				onSaveChanges={handleSaveChanges}
			/>

			{/* Delete Confirmation Modal */}
			<Modal
				show={showDeleteConfirm}
				onHide={() => setShowDeleteConfirm(false)}
			>
				<Modal.Header closeButton>
					<Modal.Title>Confirm Delete</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Are you sure you want to delete this request? This action cannot be
					undone.
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => setShowDeleteConfirm(false)}
					>
						Cancel
					</Button>
					<Button variant="danger" onClick={handleDeleteConfirm}>
						Delete Request
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
};

export default User;
