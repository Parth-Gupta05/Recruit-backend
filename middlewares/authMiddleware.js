import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * Middleware to verify JWT token
 * Attaches decoded token data to req.user
 */
export const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    console.error("❌ Token verification error:", error.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

/**
 * Middleware to check if user has specific role
 * @param {string|array} roles - Role(s) required to access route
 */
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Required role(s): ${requiredRoles.join(", ")}`,
      });
    }

    next();
  };
};
