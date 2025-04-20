const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
	try {
		const { username, email, password, role } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({
			username,
			email,
			password: hashedPassword,
			role: role || "user", // Default to 'user' if role is not provided
		});
		await newUser.save();
		res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.login = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		// Allow login with either username or email
		let user;
		if (email) {
			user = await User.findOne({ email });
		} else if (username) {
			user = await User.findOne({ username });
		} else {
			return res.status(400).json({ message: "Email or username is required" });
		}

		if (!user) return res.status(400).json({ message: "User Not Found" });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(400).json({ message: "Invalid Credentials" });

		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		// Return user info without password
		const userWithoutPassword = {
			_id: user._id,
			username: user.username,
			email: user.email,
			role: user.role,
		};

		res.json({ token, user: userWithoutPassword });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
