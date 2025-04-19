import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const RequestModal = ({
	showModal,
	setShowModal,
	newRequest,
	setNewRequest,
	handleSubmitRequest,
}) => {
	return (
		<Modal show={showModal} onHide={() => setShowModal(false)}>
			<Modal.Header closeButton>
				<Modal.Title>New Request</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmitRequest}>
					<Form.Group className="mb-3">
						<Form.Label>Request Title</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter title"
							value={newRequest.title}
							onChange={(e) =>
								setNewRequest({ ...newRequest, title: e.target.value })
							}
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Description</Form.Label>
						<Form.Control
							as="textarea"
							rows={3}
							placeholder="Describe your request"
							value={newRequest.description}
							onChange={(e) =>
								setNewRequest({ ...newRequest, description: e.target.value })
							}
							required
						/>
					</Form.Group>
					<div className="d-flex justify-content-end">
						<Button
							variant="secondary"
							className="me-2"
							onClick={() => setShowModal(false)}
						>
							Cancel
						</Button>
						<Button variant="primary" type="submit">
							Submit Request
						</Button>
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default RequestModal;
