import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingSpinner = ({ message = "Loading..." }) => {
	return (
		<div className="d-flex flex-column justify-content-center align-items-center p-5">
			<Spinner
				animation="border"
				role="status"
				variant="primary"
				className="mb-2"
			/>
			<span className="text-muted">{message}</span>
		</div>
	);
};

export default LoadingSpinner;
