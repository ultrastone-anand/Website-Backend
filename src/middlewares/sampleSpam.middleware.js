
const rateLimit = require("express-rate-limit");

/* =========================================================
   SAMPLE REQUEST - HONEYPOT
========================================================= */

const checkSampleHoneypot = (req, res, next) => {
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

  // Allow existing frontend versions during transition.
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
      "[SPAM] Sample request honeypot triggered"
    );

    // Return success without saving or sending emails.
    return res.status(200).json({
      success: true,
      message: "Sample request submitted successfully.",
    });
  }

  return next();
};

/* =========================================================
   SAMPLE REQUEST - RATE LIMIT
========================================================= */

const sampleRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 5,

  standardHeaders: "draft-7",

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many sample requests. Please wait 15 minutes before trying again.",
  },
});

module.exports = {
  checkSampleHoneypot,
  sampleRateLimiter,
};
