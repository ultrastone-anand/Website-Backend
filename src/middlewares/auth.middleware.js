
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  // Require exactly: Bearer <token>
  const match = /^Bearer\s+(\S+)$/i.exec(authHeader);

  if (!match) {
    return res.status(401).json({
      message: "Invalid authorization format",
    });
  }

  const token = match[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        algorithms: ["HS256"],
      }
    );

    // JWT payload must identify a user
    if (
      !decoded ||
      typeof decoded !== "object" ||
      (!decoded.id && !decoded.userId)
    ) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    req.user = decoded;

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired. Please login again.",
      });
    }

    return res.status(401).json({
      message: "Invalid authentication token",
    });
  }
};

module.exports = authenticate;
