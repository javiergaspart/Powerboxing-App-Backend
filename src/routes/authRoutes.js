const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/authController"); // Import controller functions

router.post("/login", login);
router.post("/register", register);

module.exports = router;
