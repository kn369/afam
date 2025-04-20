import React from "react";
import { Card, Row, Col, Badge, Button } from "react-bootstrap";

const RequestCard = ({ request, onEditClick, onDeleteClick }) => {
	// Format date if it exists
	const formatDate = (dateString) => {
		if (!dateString) return "N/A";

		// Check if it's a timestamp string or Date object
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
			});
		} catch (e) {
			return dateString; // return as is if can't parse
		}
	};

	// Get the correct title from different form schema variations
	const getTitle = () => {
		return request.title || request.type || "Untitled Request";
	};

	// Get the correct status class
	const getStatusClass = () => {
		const status = (request.status || "pending").toLowerCase();

		if (status.includes("approve")) return "approved";
		if (status.includes("reject")) return "rejected";
		return "pending";
	};

	// Check if the request is editable (only if it's pending)
	const isPending = () => {
		const status = (request.status || "pending").toLowerCase();
		return !status.includes("approve") && !status.includes("reject");
	};

	return (
		<Card key={request._id || request.id} className="request-card mb-3">
			<Card.Body>
				<Row>
					<Col>
						<Card.Title>{getTitle()}</Card.Title>
						{request.description && (
							<Card.Text>{request.description}</Card.Text>
						)}
						<div className="d-flex justify-content-between align-items-center mt-2">
							<Card.Text className="text-muted mb-0">
								Submitted on{" "}
								{formatDate(
									request.date ||
										request.createdAt ||
										request.updatedAt ||
										request.timestamps
								)}
							</Card.Text>
							{request.type && (
								<Badge bg="secondary" className="me-2">
									{request.type}
								</Badge>
							)}
						</div>
					</Col>
					<Col xs="auto" className="d-flex flex-column align-items-end">
						<span className={`status-badge status-${getStatusClass()} mb-3`}>
							{request.status || "Pending"}
						</span>
						<div className="action-buttons">
							<Button
								variant="outline-primary"
								size="sm"
								className="me-2"
								onClick={() => onEditClick(request)}
								disabled={!isPending()}
								title={
									!isPending()
										? "Cannot edit requests that have been approved or rejected"
										: ""
								}
							>
								Edit
							</Button>
							<Button
								variant="outline-danger"
								size="sm"
								onClick={() => onDeleteClick(request)}
								disabled={!isPending()}
								title={
									!isPending()
										? "Cannot delete requests that have been approved or rejected"
										: ""
								}
							>
								Delete
							</Button>
						</div>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
};

export default RequestCard;
