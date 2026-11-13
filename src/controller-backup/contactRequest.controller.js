// controller/contactRequest.controller.js

const contactRequestService =
  require(
    "../services/contactRequest.service"
  );

/* =========================================================
   CREATE CONTACT REQUEST
========================================================= */

const createContactRequest =
  async (req, res) => {
    try {
      const {
        name,
        subject,
        email,
        phone,
        message,
      } = req.body;

      /* =====================================================
         REQUIRED VALIDATION
      ===================================================== */

      if (
        !name ||
        !subject ||
        !email ||
        !phone
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please provide all required fields.",
          });
      }

      /* =====================================================
         CLEAN VALUES
      ===================================================== */

      const safeName =
        String(
          name
        ).trim();

      const safeSubject =
        String(
          subject
        ).trim();

      const safeEmail =
        String(
          email
        )
          .trim()
          .toLowerCase();

      const safePhone =
        String(
          phone
        ).trim();

      const safeMessage =
        String(
          message || ""
        ).trim();

      /* =====================================================
         EMPTY AFTER TRIM
      ===================================================== */

      if (
        !safeName ||
        !safeSubject ||
        !safeEmail ||
        !safePhone
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please provide all required fields.",
          });
      }

      /* =====================================================
         EMAIL VALIDATION
      ===================================================== */

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          safeEmail
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please provide a valid email address.",
          });
      }

      /* =====================================================
         SEND EMAIL
      ===================================================== */

      const result =
        await contactRequestService.sendContactRequest(
          {
            name:
              safeName,

            subject:
              safeSubject,

            email:
              safeEmail,

            phone:
              safePhone,

            message:
              safeMessage,
          }
        );

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Contact enquiry submitted successfully.",

          data:
            result,
        });
    } catch (error) {
      console.error(
        "createContactRequest error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to submit contact enquiry.",
        });
    }
  };

module.exports = {
  createContactRequest,
};