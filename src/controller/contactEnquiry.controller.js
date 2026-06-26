const contactEnquiryService = require(
  "../services/contactEnquiry.service"
);
const { serialize } = require("../utils/serialize");

// ================== CREATE ENQUIRY ==================

const createEnquiry = async (
  req,
  res
) => {

  try {

    const {
      name,
      subject,
      email,
      phone,
      message
    } = req.body;

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const cleanedPhone =
      phone?.replace(
        /\D/g,
        ""
      );

    if (!name?.trim()) {

      return res.status(400).json({

        success: false,

        message:
          "Name is required"

      });

    }

    if (!subject?.trim()) {

      return res.status(400).json({

        success: false,

        message:
          "Subject is required"

      });

    }

    if (!email?.trim()) {

      return res.status(400).json({

        success: false,

        message:
          "Email is required"

      });

    }

    if (
      !emailRegex.test(email)
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid email address"

      });

    }

    if (!phone?.trim()) {

      return res.status(400).json({

        success: false,

        message:
          "Phone number is required"

      });

    }

    if (
      cleanedPhone.length < 10 ||
      cleanedPhone.length > 15
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid phone number"

      });

    }

    const enquiry =
      await contactEnquiryService.createEnquiry(
        req.body
      );

    res.status(201).json({

      success: true,

      message:
        "Enquiry submitted successfully",

      data:
        serialize(enquiry)

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};

// ================== GET ALL ENQUIRIES ==================

const getAllEnquiries =async (
    req,
    res
  ) => {

    try {

      const enquiries =
        await contactEnquiryService.getAllEnquiries();

      res.status(200).json({

        success: true,

        data: serialize(enquiries)

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message

      });

    }

  };

// ================== UPDATE STATUS ==================

const updateStatus = async (
    req,
    res
  ) => {

    try {

      const { id } =
        req.params;

      const enquiry =
        await contactEnquiryService.updateStatus(
          id,
          req.body
        );

      res.status(200).json({

        success: true,

        data: serialize(enquiry)

      });

    } catch (error) {

      if (
        error.message ===
        "Enquiry not found"
      ) {

        return res.status(404).json({

          success: false,

          message:
            error.message

        });

      }

      res.status(500).json({

        success: false,

        message:
          error.message

      });

    }

  };

module.exports = {

  createEnquiry,

  getAllEnquiries,

  updateStatus

};