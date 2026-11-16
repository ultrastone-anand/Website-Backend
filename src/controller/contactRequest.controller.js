
const contactRequestService = require(
  "../services/contactRequest.service"
);

/* =========================================================
   HELPERS
========================================================= */

const isValidText = (value, maxLength) => {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength
  );
};

const sendValidationError = (res, message) => {
  return res.status(400).json({
    success: false,
    message,
  });
};

/* =========================================================
   CREATE CONTACT REQUEST
========================================================= */

const createContactRequest = async (req, res) => {
  try {
    const {
      name,
      subject,
      email,
      phone,
      message = "",
    } = req.body || {};

    /* =====================================================
       REQUIRED FIELD VALIDATION
    ===================================================== */

    if (!isValidText(name, 150)) {
      return sendValidationError(
        res,
        "Please provide a valid name (maximum 150 characters)."
      );
    }

    if (!isValidText(subject, 250)) {
      return sendValidationError(
        res,
        "Please provide a valid subject (maximum 250 characters)."
      );
    }

    if (!isValidText(email, 254)) {
      return sendValidationError(
        res,
        "Please provide a valid email address."
      );
    }

    if (!isValidText(phone, 50)) {
      return sendValidationError(
        res,
        "Please provide a valid phone number."
      );
    }

    if (
      typeof message !== "string" ||
      message.length > 5000
    ) {
      return sendValidationError(
        res,
        "Message must not exceed 5000 characters."
      );
    }

    /* =====================================================
       NORMALIZE VALUES
    ===================================================== */

    const safeName = name.trim();
    const safeSubject = subject.trim();
    const safeEmail = email.trim().toLowerCase();
    const safePhone = phone.trim();
    const safeMessage = message.trim();

    /* =====================================================
       EMAIL VALIDATION
    ===================================================== */

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(safeEmail)) {
      return sendValidationError(
        res,
        "Please provide a valid email address."
      );
    }

    /* =====================================================
       PHONE VALIDATION
    ===================================================== */

    const phoneDigits = safePhone.replace(/\D/g, "");

    if (
      phoneDigits.length < 10 ||
      phoneDigits.length > 15
    ) {
      return sendValidationError(
        res,
        "Please provide a valid phone number."
      );
    }

    /* =====================================================
       SEND EMAIL

       Honeypot and rate limiting have already run
       in route middleware.
    ===================================================== */

    const result =
      await contactRequestService.sendContactRequest({
        name: safeName,
        subject: safeSubject,
        email: safeEmail,
        phone: safePhone,
        message: safeMessage,
      });

    return res.status(200).json({
      success: true,
      message:
        "Contact enquiry submitted successfully.",
      data: result,
    });
  } catch (error) {
    console.error(
      "createContactRequest error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to submit contact enquiry.",
    });
  }
};

module.exports = {
  createContactRequest,
};
  