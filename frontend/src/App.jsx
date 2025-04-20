import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import User from "./pages/user";
import Admin from "./pages/admin";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

const App = () => {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />

					{/* Regular user dashboard */}
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<User />
							</ProtectedRoute>
						}
					/>

					{/* Admin dashboard - admin only */}
					<Route
						path="/admin"
						element={
							<ProtectedRoute adminOnly={true}>
								<Admin />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
};

export default App;
