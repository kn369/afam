import React from "react";
import { Badge, Button } from "react-bootstrap";

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

	// Check if the request is editable (only if it's pending)
	const isPending = () => {
		const status = (request.status || "pending").toLowerCase();
		return !status.includes("approve") && !status.includes("reject");
	};

	return (
		<div className="admin-request-card">
			<div className="d-flex justify-content-between flex-wrap">
				<div className="mb-3 request-info-container">
					<h5>{request.title || request.type || "Untitled Request"}</h5>
					<p className="text-muted mb-1">
						Submitted on{" "}
						{formatDate(
							request.date ||
								request.createdAt ||
								request.updatedAt ||
								request.timestamps
						)}
					</p>
					<p className="mb-2 request-description">{request.description}</p>
					<div className="mb-2">
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
						variant="outline-primary"
						size="sm"
						className="mb-2"
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
			</div>
		</div>
	);
};

export default RequestCard;
