
const newsletterService = require(
  "../services/newsletter.service"
);

const { serialize } = require("../utils/serialize");

// ============================================================
// SUBSCRIBE
// ============================================================

const subscribe = async (req, res, next) => {
  try {
    const subscriber =
      await newsletterService.subscribe(req.body);

    return res.status(201).json({
      success: true,
      message: "Successfully subscribed",
      data: serialize(subscriber),
    });

  } catch (error) {

    // --------------------------------------------------------
    // KNOWN VALIDATION ERROR
    // --------------------------------------------------------

    if (error.message === "Email already subscribed") {
      return res.status(400).json({
        success: false,
        message: "Email already subscribed",
      });
    }

    // --------------------------------------------------------
    // UNEXPECTED ERRORS
    // Forward to centralized error middleware
    // --------------------------------------------------------

    return next(error);
  }
};

// ============================================================
// GET ALL SUBSCRIBERS
// ============================================================

const getAllSubscribers = async (req, res, next) => {
  try {
    const subscribers =
      await newsletterService.getAllSubscribers();

    return res.status(200).json({
      success: true,
      data: serialize(subscribers),
    });

  } catch (error) {
    return next(error);
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  subscribe,
  getAllSubscribers,
};
