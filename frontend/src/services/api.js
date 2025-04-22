import axios from "axios";

// Create an axios instance with base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500/api";

const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Add a request interceptor to include auth token in all requests
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// API functions for authentication
export const authService = {
	login: async (username, password) => {
		try {
			const response = await api.post("/auth/login", { username, password });
			if (response.data.token) {
				localStorage.setItem("token", response.data.token);
				localStorage.setItem("user", JSON.stringify(response.data.user));
			}
			return response.data;
		} catch (error) {
			throw error.response?.data || { message: "Login failed" };
		}
	},

	register: async (userData) => {
		try {
			const response = await api.post("/auth/register", userData);
			return response.data;
		} catch (error) {
			throw error.response?.data || { message: "Registration failed" };
		}
	},

	logout: () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
	},

	getCurrentUser: () => {
		return JSON.parse(localStorage.getItem("user"));
	},

	isAuthenticated: () => {
		return !!localStorage.getItem("token");
	},
};

// API functions for form/request operations
export const formService = {
	getAllForms: async () => {
		try {
			const response = await api.get("/forms");
			return response.data;
		} catch (error) {
			console.error("Error fetching forms:", error);
			// Return empty array instead of throwing error to prevent UI crashes
			return [];
		}
	},

	getFormsByUser: async (username) => {
		try {
			const response = await api.get(`/forms/user/${username}`);
			return response.data;
		} catch (error) {
			console.error("Error fetching user forms:", error);
			// Return empty array instead of throwing error to prevent UI crashes
			return [];
		}
	},

	getFormById: async (id) => {
		try {
			const response = await api.get(`/forms/${id}`);
			return response.data;
		} catch (error) {
			throw error.response?.data || { message: "Failed to fetch form" };
		}
	},

	createForm: async (formData) => {
		try {
			// Check if formData is a FormData object for file uploads
			const config = {};

			if (formData instanceof FormData) {
				// For FormData, we need to set the content type but preserve the Authorization header
				config.headers = {
					"Content-Type": "multipart/form-data",
				};

				// Manually add the token to ensure it's not lost
				const token = localStorage.getItem("token");
				if (token) {
					config.headers["Authorization"] = `Bearer ${token}`;
				}
			}

			const response = await api.post("/forms", formData, config);
			return response.data;
		} catch (error) {
			console.error("Error creating form:", error);
			throw error.response?.data || { message: "Failed to create form" };
		}
	},

	updateForm: async (id, formData) => {
		try {
			// Configuration for FormData object handling
			const config = {};

			if (formData instanceof FormData) {
				// For FormData, we need to set the content type but preserve the Authorization header
				config.headers = {
					"Content-Type": "multipart/form-data",
				};

				// Manually add the token to ensure it's not lost
				const token = localStorage.getItem("token");
				if (token) {
					config.headers["Authorization"] = `Bearer ${token}`;
				}
			}

			const response = await api.put(`/forms/${id}`, formData, config);
			return response.data;
		} catch (error) {
			console.error("Error updating form:", error);
			throw error.response?.data || { message: "Failed to update form" };
		}
	},

	deleteForm: async (id) => {
		try {
			const response = await api.delete(`/forms/${id}`);
			return response.data;
		} catch (error) {
			throw error.response?.data || { message: "Failed to delete form" };
		}
	},

	getFileUrl: (filePath) => {
		// Check if filePath is provided
		if (!filePath) return null;

		// Extract the filename from the path
		const filename = filePath.split("/").pop();

		// Construct the full URL to the file
		return `${API_URL.replace("/api", "")}/uploads/${filename}`;
	},
};

export default api;
