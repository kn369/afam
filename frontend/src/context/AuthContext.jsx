import React, { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check if user is logged in on application startup
		const checkUserLoggedIn = () => {
			const currentUser = authService.getCurrentUser();
			setUser(currentUser);
			setLoading(false);
		};

		checkUserLoggedIn();
	}, []);

	const login = async (username, password) => {
		const data = await authService.login(username, password);
		setUser(data.user);
		return data;
	};

	const logout = () => {
		authService.logout();
		setUser(null);
	};

	const register = async (userData) => {
		return await authService.register(userData);
	};

	// Fixed isAdmin function to properly check against 'admin' role value from the backend
	const isAdmin = () => {
		// More reliable role checking logic
		if (!user) return false;

		// Debug logs to help troubleshoot
		console.log("Current user role:", user.role);

		// Check role using exact string comparison - per authController.js implementation
		return user.role === "admin";
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				login,
				logout,
				register,
				isAuthenticated: !!user,
				isAdmin: isAdmin,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
