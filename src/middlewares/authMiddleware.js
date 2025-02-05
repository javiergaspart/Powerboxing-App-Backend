const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        console.error("❌ No Authorization header received");
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract token
    console.log("🔹 Received Token:", token);

    if (!token) {
        console.error("❌ Token is missing from Authorization header");
        return res.status(401).json({ message: "Access denied. Token missing." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token Decoded Successfully:", decoded);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error("🚨 Token Verification Failed:", err.message);
        res.status(400).json({ message: "Invalid token." });
    }
};

module.exports = authMiddleware;
