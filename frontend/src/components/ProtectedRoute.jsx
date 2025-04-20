import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
	const { user, loading, isAdmin } = useAuth();
	const location = useLocation();

	if (loading) {
		return <div>Loading...</div>;
	}

	// Redirect to login if not authenticated
	if (!user) {
		console.log("User not authenticated, redirecting to login");
		return <Navigate to="/" state={{ from: location }} replace />;
	}

	// Check if this is an admin-only route
	if (adminOnly) {
		const isUserAdmin = isAdmin();
		console.log(
			`Checking admin access: Path=${location.pathname}, isAdmin=${isUserAdmin}`
		);

		// If this is an admin-only route and user is not admin, redirect to user dashboard
		if (!isUserAdmin) {
			console.log("Access denied: Non-admin attempting to access admin route");
			return <Navigate to="/dashboard" replace />;
		} else {
			console.log("Admin access granted");
		}
	}

	return children;
};

export default ProtectedRoute;
