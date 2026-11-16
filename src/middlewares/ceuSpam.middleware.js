
const rateLimit = require("express-rate-limit");

/* =========================================================
   CEU REQUEST - HONEYPOT PROTECTION
========================================================= */

const checkCeuHoneypot = (req, res, next) => {
  const body = req.body;

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid request body.",
    });
  }

  // Backward compatibility with existing submissions
  if (
    !Object.prototype.hasOwnProperty.call(
      body,
      "website_url"
    )
  ) {
    return next();
  }

  const value = body.website_url;

  if (
    typeof value !== "string" ||
    value.trim() !== ""
  ) {
    console.warn(
      "[SPAM] CEU request honeypot triggered"
    );

    // Fake success - no database or email processing
    return res.status(200).json({
      success: true,
      message:
        "CEU course request submitted successfully.",
    });
  }

  return next();
};

/* =========================================================
   CEU REQUEST - RATE LIMITING
========================================================= */

const ceuRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 5,

  standardHeaders: "draft-7",

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many CEU requests. Please wait 15 minutes before trying again.",
  },
});

module.exports = {
  checkCeuHoneypot,
  ceuRateLimiter,
};
