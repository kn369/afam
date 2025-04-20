const Form = require("../models/Form");
const User = require("../models/User");

exports.createForm = async (req, res) => {
	try {
		const { type, username, description, status, id } = req.body;
		const docs = req.docs ? req.docs : [];
		const newForm = new Form({
			id,
			type,
			username,
			description,
			status,
			docs,
		});
		await newForm.save();
		res
			.status(201)
			.json({ message: "Form created successfully", form: newForm });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.getForms = async (req, res) => {
	const forms = await Form.find();
	res.status(200).json(forms);
};

exports.deleteForm = async (req, res) => {
	await Form.findByIdAndDelete(req.params.id);
	res.status(200).json({ message: "Form deleted successfully" });
};

exports.updateForm = async (req, res) => {
	try {
		const { type, username, description, status } = req.body;

		// Create update object with text fields
		const updateData = {
			type,
			username,
			description,
			status,
		};

		// If new files were uploaded, add them to the update
		if (req.files && req.files.length > 0) {
			// Save file information
			const docs = req.files.map((file) => ({
				filename: file.filename,
				path: file.path,
				originalname: file.originalname,
			}));
			updateData.docs = docs;
		}

		const updatedForm = await Form.findByIdAndUpdate(
			req.params.id,
			updateData,
			{ new: true }
		);

		if (!updatedForm) {
			return res.status(404).json({ message: "Form not found" });
		}

		res
			.status(200)
			.json({ message: "Form updated successfully", form: updatedForm });
	} catch (error) {
		console.error("Error updating form:", error);
		res.status(500).json({ error: error.message || "Failed to update form" });
	}
};

exports.getFormById = async (req, res) => {
	const form = await Form.findById(req.params.id);
	if (!form) return res.status(404).json({ message: "Form not found" });
	res.status(200).json(form);
};
exports.getFormsByUser = async (req, res) => {
	const { username } = req.params;
	const forms = await Form.find({ username });
	if (!forms) return res.status(404).json({ message: "Forms not found" });
	res.status(200).json(forms);
};
