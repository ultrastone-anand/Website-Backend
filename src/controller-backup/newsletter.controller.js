const newsletterService = require(
  "../services/newsletter.service"
);
const { serialize } = require("../utils/serialize");

// ================== SUBSCRIBE ==================

const subscribe = async (
  req,
  res
) => {

  try {

    const subscriber =
      await newsletterService.subscribe(
        req.body
      );

    res.status(201).json({

      success: true,

      message:
        "Successfully subscribed",

      data: serialize(subscriber)

    });

  } catch (error) {

    if (
      error.message ===
      "Email already subscribed"
    ) {

      return res.status(400).json({

        success: false,

        message: error.message

      });

    }

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ================== GET ALL SUBSCRIBERS ==================

const getAllSubscribers =async (
    req,
    res
  ) => {

    try {

      const subscribers =
        await newsletterService.getAllSubscribers();

      res.status(200).json({

        success: true,

        data: serialize(subscribers)

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message

      });

    }

  };

module.exports = {

  subscribe,

  getAllSubscribers

};