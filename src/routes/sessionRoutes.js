const express = require("express");
const router = express.Router();
const { saveAvailability } = require("../controllers/sessionController");

router.post("/save-availability", saveAvailability);

module.exports = router;
