
const rateLimit = require("express-rate-limit");

/* =========================================================
   DISPLAY REQUEST - HONEYPOT
========================================================= */

const checkDisplayHoneypot = (req, res, next) => {
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
      "[SPAM] Display request honeypot triggered"
    );

    return res.status(200).json({
      success: true,
      message:
        "Display request submitted successfully.",
    });
  }

  return next();
};

/* =========================================================
   DISPLAY REQUEST - RATE LIMITER
========================================================= */

const displayRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,

  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many display requests. Please wait 15 minutes before trying again.",
  },
});

module.exports = {
  checkDisplayHoneypot,
  displayRateLimiter,
};
