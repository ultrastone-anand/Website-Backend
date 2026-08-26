// controller/displayRequest.controller.js

const displayRequestService =
  require(
    "../services/displayRequest.service"
  );

/* =========================================================
   CREATE DISPLAY REQUEST
========================================================= */

const createDisplayRequest =
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        company,

        display,

        concerned_person_name,
        concerned_person_phone,

        street_address,
        suite_number,
        city,
        county,
        state,
        zip_code,

        message,
      } = req.body;

      /* ===================================================
         REQUIRED FIELD VALIDATION
      =================================================== */

      if (
        !name ||
        !email ||
        !phone ||
        !company ||
        !display ||
        !street_address ||
        !city ||
        !state ||
        !zip_code
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please provide all required fields.",
          });
      }

      /* ===================================================
         CLEAN VALUES
      =================================================== */

      const safeName =
        String(
          name
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

      const safeCompany =
        String(
          company
        ).trim();

      const safeDisplay =
        String(
          display
        ).trim();

      const safeConcernedPersonName =
        String(
          concerned_person_name ||
          ""
        ).trim();

      const safeConcernedPersonPhone =
        String(
          concerned_person_phone ||
          ""
        ).trim();

      const safeStreetAddress =
        String(
          street_address
        ).trim();

      const safeSuiteNumber =
        String(
          suite_number ||
          ""
        ).trim();

      const safeCity =
        String(
          city
        ).trim();

      const safeCounty =
        String(
          county ||
          ""
        ).trim();

      const safeState =
        String(
          state
        ).trim();

      const safeZipCode =
        String(
          zip_code
        ).trim();

      const safeMessage =
        String(
          message ||
          ""
        ).trim();

      /* ===================================================
         CHECK EMPTY AFTER TRIM
      =================================================== */

      if (
        !safeName ||
        !safeEmail ||
        !safePhone ||
        !safeCompany ||
        !safeDisplay ||
        !safeStreetAddress ||
        !safeCity ||
        !safeState ||
        !safeZipCode
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please provide all required fields.",
          });
      }

      /* ===================================================
         EMAIL VALIDATION
      =================================================== */

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailPattern.test(
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

      /* ===================================================
         OPTIONAL CONCERNED PERSON PHONE VALIDATION

         Only validate if provided.
      =================================================== */

      if (
        safeConcernedPersonPhone &&
        safeConcernedPersonPhone.length <
          7
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please provide a valid concerned person phone number.",
          });
      }

      /* ===================================================
         SEND EMAIL
      =================================================== */

      const result =
        await displayRequestService.sendDisplayRequest(
          {
            name:
              safeName,

            email:
              safeEmail,

            phone:
              safePhone,

            company:
              safeCompany,

            display:
              safeDisplay,

            concerned_person_name:
              safeConcernedPersonName,

            concerned_person_phone:
              safeConcernedPersonPhone,

            street_address:
              safeStreetAddress,

            suite_number:
              safeSuiteNumber,

            city:
              safeCity,

            county:
              safeCounty,

            state:
              safeState,

            zip_code:
              safeZipCode,

            message:
              safeMessage,
          }
        );

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Display request submitted successfully.",

          data:
            result,
        });
    } catch (error) {
      console.error(
        "createDisplayRequest error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to submit display request.",
        });
    }
  };

module.exports = {
  createDisplayRequest,
};