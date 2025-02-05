const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract Bearer Token

    if (!token) {
        console.error("❌ No token provided");
        return res.status(400).json({ message: "Access denied. No token provided." });
    }

    try {
        console.log("🔹 Received Token:", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token Decoded Successfully:", decoded);

        req.user = decoded.user; // Extract user ID
        console.log("🔹 User ID Extracted:", req.user.id);
        
        next();
    } catch (err) {
        console.error("🚨 Invalid Token:", err.message);
        res.status(400).json({ message: "Invalid token." });
    }
};
