const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
    
    if (!token) {
        return res.status(401).json({ message: "Access denied. Token missing." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
};

// ✅ Ensure only this function is exported
module.exports = authMiddleware;
