import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const RequestModal = ({
	showModal,
	setShowModal,
	newRequest,
	setNewRequest,
	handleSubmitRequest,
}) => {
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [fileError, setFileError] = useState("");

	const handleFileChange = (e) => {
		const files = Array.from(e.target.files);
		setFileError("");

		// Validate that all files are PDFs
		const invalidFiles = files.filter(
			(file) => file.type !== "application/pdf"
		);

		if (invalidFiles.length > 0) {
			setFileError(
				"Only PDF files are allowed. Please select valid documents."
			);
			// Reset the file input
			e.target.value = null;
			return;
		}

		setSelectedFiles(files);
		setNewRequest({
			...newRequest,
			docs: files,
		});
	};

	const requestTypes = [
		"Medical Leave",
		"On Duty Leave",
		"Budget Approval",
		"Other",
	];

	return (
		<Modal show={showModal} onHide={() => setShowModal(false)}>
			<Modal.Header closeButton>
				<Modal.Title>New Request</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmitRequest}>
					<Form.Group className="mb-3">
						<Form.Label>Request Type</Form.Label>
						<Form.Select
							value={newRequest.type}
							onChange={(e) =>
								setNewRequest({ ...newRequest, type: e.target.value })
							}
							required
						>
							{requestTypes.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</Form.Select>
					</Form.Group>

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

					<Form.Group className="mb-3">
						<Form.Label>Supporting Documents</Form.Label>
						<Form.Control
							type="file"
							multiple
							onChange={handleFileChange}
							accept=".pdf"
						/>
						<Form.Text className="text-muted">
							Upload PDF documents only (optional)
						</Form.Text>
						{fileError && (
							<Alert variant="danger" className="mt-2 p-2">
								{fileError}
							</Alert>
						)}
						{selectedFiles.length > 0 && !fileError && (
							<div className="mt-2">
								<small className="text-success">
									{selectedFiles.length} PDF file(s) selected
								</small>
							</div>
						)}
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
