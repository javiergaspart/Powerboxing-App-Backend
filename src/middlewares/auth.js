const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader) {
            console.error("❌ No Authorization header received");
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        // Expecting 'Bearer <token>', extract token from the header
        const token = authHeader.split(" ")[1]; 

        console.log("🔹 Received Token:", token);

        if (!token) {
            console.error("❌ Token is missing from Authorization header");
            return res.status(401).json({ message: "Access denied. Token missing." });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        console.log("✅ Token Decoded Successfully:", decoded);

        // Attach user data to request
        req.user = decoded.user;

        next();
    } catch (err) {
        console.error("🚨 Token Verification Failed:", err.message);
        res.status(400).json({ message: "Invalid token." });
    }
};

module.exports = authMiddleware;
