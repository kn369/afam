const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Create uploads directory if it doesn't exist
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		// Create a safe filename with original extension
		const fileExtension = path.extname(file.originalname);
		cb(
			null,
			`${Date.now()}-${file.originalname
				.replace(fileExtension, "")
				.replace(/\s+/g, "-")}${fileExtension}`
		);
	},
});

// File filter to allow only PDFs
const fileFilter = (req, file, cb) => {
	// Check if the file is a PDF
	if (file.mimetype === "application/pdf") {
		cb(null, true);
	} else {
		cb(new Error("Only PDF files are allowed"), false);
	}
};

// Configure Multer with storage and file filter
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB file size limit
	},
});

module.exports = upload;
