const express = require("express");
const router = express.Router();

// Example Trainer Route
router.get("/", (req, res) => {
  res.json({ message: "Trainer API is working" });
});

module.exports = router;
