// controller/sampleRequest.controller.js

const sampleRequestService =
  require(
    "../services/sampleRequest.service"
  );

const createSampleRequest =
  async (req, res) => {
    try {
      const {
        product_id,
        product_name,
        category_name,

        first_name,
        last_name,
        company_name,

        street_address,
        city,
        county,
        state,
        zip_code,

        email,
        phone,

        quantity,
        remarks,
      } = req.body;

      /* ============================
         VALIDATION
      ============================ */

      if (
        !product_id ||
        !product_name ||
        !category_name ||
        !first_name ||
        !last_name ||
        !street_address ||
        !city ||
        !state ||
        !zip_code ||
        !email ||
        !phone ||
        !quantity
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Please provide all required fields.",
          });
      }

      const safeQuantity =
        Number(quantity);

      if (
        !Number.isInteger(
          safeQuantity
        ) ||
        safeQuantity < 1 ||
        safeQuantity > 20
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid sample quantity.",
          });
      }

      const result =
        await sampleRequestService.sendSampleRequest(
          {
            product_id,

            product_name:
              String(
                product_name
              ).trim(),

            category_name:
              String(
                category_name
              ).trim(),

            first_name:
              String(
                first_name
              ).trim(),

            last_name:
              String(
                last_name
              ).trim(),

            company_name:
              String(
                company_name || ""
              ).trim(),

            street_address:
              String(
                street_address
              ).trim(),

            city:
              String(
                city
              ).trim(),

            county:
              String(
                county || ""
              ).trim(),

            state:
              String(
                state
              ).trim(),

            zip_code:
              String(
                zip_code
              ).trim(),

            email:
              String(
                email
              ).trim(),

            phone:
              String(
                phone
              ).trim(),

            quantity:
              safeQuantity,

            remarks:
              String(
                remarks || ""
              ).trim(),
          }
        );

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Sample request submitted successfully.",

          data: result,
        });
    } catch (error) {
      console.error(
        "createSampleRequest error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to submit sample request.",
        });
    }
  };

module.exports = {
  createSampleRequest,
};