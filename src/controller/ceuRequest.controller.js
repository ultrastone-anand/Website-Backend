// controller/ceuRequest.controller.js

const ceuRequestService =
  require(
    "../services/ceuRequest.service"
  );

const createCeuRequest =
  async (req, res) => {
    try {
      const {
        course,
        name,
        email,
        phone,
        company,
        role,
        preferredDate,
        message,
      } = req.body;

      if (
        !course ||
        !name ||
        !email ||
        !phone ||
        !company
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Please provide all required fields.",
          });
      }

      const result =
        await ceuRequestService.sendCeuRequest(
          {
            course:
              String(course).trim(),

            name:
              String(name).trim(),

            email:
              String(email)
                .trim()
                .toLowerCase(),

            phone:
              String(phone).trim(),

            company:
              String(company).trim(),

            role:
              String(
                role || ""
              ).trim(),

            preferredDate:
              String(
                preferredDate || ""
              ).trim(),

            message:
              String(
                message || ""
              ).trim(),
          }
        );

      return res
        .status(200)
        .json({
          success: true,
          message:
            "CEU course request submitted successfully.",
          data: result,
        });
    } catch (error) {
      console.error(
        "createCeuRequest error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to submit CEU course request.",
        });
    }
  };

module.exports = {
  createCeuRequest,
};