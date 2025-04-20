const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema(
	{
		type: { type: String, required: true },
		id: { type: String, required: true },
		username: { type: String, required: true },
		description: { type: String, required: true },
		status: { type: String, required: true },
		docs: { type: Array, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Form", FormSchema);
