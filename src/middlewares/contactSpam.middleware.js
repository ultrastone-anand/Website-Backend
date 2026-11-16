
const rateLimit = require("express-rate-limit");

/* =========================================================
   HONEYPOT PROTECTION
========================================================= */

const checkContactHoneypot = (req, res, next) => {
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

  const hasHoneypot = Object.prototype.hasOwnProperty.call(
    body,
    "website_url"
  );

  // Allow older frontend versions during deployment.
  // After all clients are updated, this can be required.
  if (!hasHoneypot) {
    return next();
  }

  const value = body.website_url;

  if (
    typeof value !== "string" ||
    value.trim() !== ""
  ) {
    console.warn("[SPAM] Contact honeypot triggered");

    // Return a generic success without sending emails.
    return res.status(200).json({
      success: true,
      message: "Contact enquiry submitted successfully.",
    });
  }

  return next();
};

/* =========================================================
   RATE LIMITING
========================================================= */

const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  // Maximum 5 submissions per IP per 15 minutes.
  limit: 5,

  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please wait 15 minutes before trying again.",
  },
});

module.exports = {
  checkContactHoneypot,
  contactRateLimiter,
};
