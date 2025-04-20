const express = require("express");
const {
	getForms,
	createForm,
	getFormById,
	updateForm,
	deleteForm,
	getFormsByUser,
} = require("../controllers/formController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", authMiddleware, getForms);
router.post("/", authMiddleware, upload.array("docs"), createForm);
router.get("/user/:username", authMiddleware, getFormsByUser);
router.get("/:id", authMiddleware, getFormById);
router.put("/:id", authMiddleware, upload.array("docs"), updateForm);
router.delete("/:id", authMiddleware, deleteForm);

module.exports = router;
