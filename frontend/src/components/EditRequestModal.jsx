import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const EditRequestModal = ({
	showModal,
	setShowModal,
	currentRequest,
	onSaveChanges,
}) => {
	const [editedRequest, setEditedRequest] = useState({
		title: "",
		description: "",
		type: "",
	});
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [fileError, setFileError] = useState("");

	// Update form fields when currentRequest changes
	useEffect(() => {
		if (currentRequest) {
			setEditedRequest({
				title: currentRequest.title || "",
				description: currentRequest.description || "",
				type: currentRequest.type || "General",
				docs: currentRequest.docs || [],
			});
			// Reset file selections when the modal opens with a new request
			setSelectedFiles([]);
			setFileError("");
		}
	}, [currentRequest]);

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
		setEditedRequest({
			...editedRequest,
			docs: files,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Don't proceed if there are file errors
		if (fileError) {
			return;
		}
		onSaveChanges(editedRequest);
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
				<Modal.Title>Edit Request</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3">
						<Form.Label>Request Type</Form.Label>
						<Form.Select
							value={editedRequest.type || "General"}
							onChange={(e) =>
								setEditedRequest({ ...editedRequest, type: e.target.value })
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
							value={editedRequest.title}
							onChange={(e) =>
								setEditedRequest({ ...editedRequest, title: e.target.value })
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
							value={editedRequest.description}
							onChange={(e) =>
								setEditedRequest({
									...editedRequest,
									description: e.target.value,
								})
							}
							required
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Update Supporting Documents</Form.Label>
						<Form.Control
							type="file"
							multiple
							onChange={handleFileChange}
							accept=".pdf"
						/>
						<Form.Text className="text-muted">
							Upload new PDF documents only (optional)
						</Form.Text>
						{fileError && (
							<Alert variant="danger" className="mt-2 p-2">
								{fileError}
							</Alert>
						)}
						{selectedFiles.length > 0 && !fileError && (
							<div className="mt-2">
								<small className="text-success">
									{selectedFiles.length} new PDF file(s) selected
								</small>
							</div>
						)}
						{currentRequest?.docs?.length > 0 && (
							<div className="mt-2">
								<small>
									Current documents: {currentRequest.docs.length} file(s)
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
						<Button variant="primary" type="submit" disabled={!!fileError}>
							Save Changes
						</Button>
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default EditRequestModal;
