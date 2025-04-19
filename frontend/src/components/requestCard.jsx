import React from "react";
import { Card, Row, Col } from "react-bootstrap";
const RequestCard = ({ request }) => {
	return (
		<Card key={request.id} className="request-card mb-3">
			<Card.Body>
				<Row>
					<Col>
						<Card.Title>{request.title}</Card.Title>
						<Card.Text className="text-muted">
							Submitted on {request.date}
						</Card.Text>
					</Col>
					<Col xs="auto">
						<span
							className={`status-badge status-${request.status.toLowerCase()}`}
						>
							{request.status}
						</span>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
};

export default RequestCard;
