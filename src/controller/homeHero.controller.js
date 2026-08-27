const service =
  require(
    "../services/homeHero.service"
  );

/* =========================================================
   RESPONSE HELPERS
========================================================= */

const sendSuccess = (
  res,
  {
    status = 200,
    message,
    data,
  }
) => {
  const response = {
    success: true,
  };

  if (message) {
    response.message =
      message;
  }

  if (
    data !==
    undefined
  ) {
    response.data =
      data;
  }

  return res
    .status(status)
    .json(response);
};

const sendError = (
  res,
  error,
  fallbackMessage
) => {
  console.error(
    fallbackMessage,
    error
  );

  const status =
    Number.isInteger(
      error?.statusCode
    )
      ? error.statusCode
      : 500;

  return res
    .status(status)
    .json({
      success: false,

      message:
        error?.message ||
        fallbackMessage,
    });
};

/* =========================================================
   ACTIVE HERO
========================================================= */

const getActiveHero =
  async (
    req,
    res
  ) => {
    try {
      const data =
        await service
          .getActiveHero();

      return sendSuccess(
        res,
        {
          data,
        }
      );
    } catch (error) {
      return sendError(
        res,
        error,
        "Failed to fetch active homepage hero"
      );
    }
  };

/* =========================================================
   DEFAULT HERO
========================================================= */

const getDefaultHero =
  async (
    req,
    res
  ) => {
    try {
      const data =
        await service
          .getDefaultHero();

      return sendSuccess(
        res,
        {
          data,
        }
      );
    } catch (error) {
      return sendError(
        res,
        error,
        "Failed to fetch default homepage hero"
      );
    }
  };

const updateDefaultHero =
  async (
    req,
    res
  ) => {
    try {
      const data =
        await service
          .updateDefaultHero(
            req.body
          );

      return sendSuccess(
        res,
        {
          message:
            "Default homepage hero updated successfully",

          data,
        }
      );
    } catch (error) {
      return sendError(
        res,
        error,
        "Failed to update default homepage hero"
      );
    }
  };

/* =========================================================
   CAMPAIGNS
========================================================= */

const getCampaigns =
  async (
    req,
    res
  ) => {
    try {
      const data =
        await service
          .getCampaigns({
            status:
              req.query.status,

            isEnabled:
              req.query
                .isEnabled,
          });

      return sendSuccess(
        res,
        {
          data,
        }
      );
    } catch (error) {
      return sendError(
        res,
        error,
        "Failed to fetch homepage campaigns"
      );
    }
  };

const getCampaignById =
  async (
    req,
    res
  ) => {
    try {
      const data =
        await service
          .getCampaignById(
            req.params.id
          );

      return sendSuccess(
        res,
        {
          data,
        }
      );
    } catch (error) {
      return sendError(
        res,
        error,
        "Failed to fetch homepage campaign"
      );
    }
  };

const createCampaign =
  async (
    req,
    res
  ) => {
    try {
      const data =
        await service
          .createCampaign(
            req.body
          );

      return sendSuccess(
        res,
        {
          status: 201,

          message:
            "Homepage campaign created successfully",

          data,
        }
      );
    } catch (error) {
      return sendError(
        res,
        error,
        "Failed to create homepage campaign"
      );
    }
  };

const updateCampaign =
  async (
    req,
    res
  ) => {
    try {
      const data =
        await service
          .updateCampaign(
            req.params.id,
            req.body
          );

      return sendSuccess(
        res,
        {
          message:
            "Homepage campaign updated successfully",

          data,
        }
      );
    } catch (error) {
      return sendError(
        res,
        error,
        "Failed to update homepage campaign"
      );
    }
  };

const toggleCampaign =
  async (
    req,
    res
  ) => {
    try {
      const data =
        await service
          .toggleCampaign(
            req.params.id,
            req.body
          );

      return sendSuccess(
        res,
        {
          message:
            data.is_enabled
              ? "Campaign enabled successfully"
              : "Campaign disabled successfully",

          data,
        }
      );
    } catch (error) {
      return sendError(
        res,
        error,
        "Failed to update campaign status"
      );
    }
  };

const deleteCampaign =
  async (
    req,
    res
  ) => {
    try {
      await service
        .deleteCampaign(
          req.params.id
        );

      return sendSuccess(
        res,
        {
          message:
            "Homepage campaign deleted successfully",
        }
      );
    } catch (error) {
      return sendError(
        res,
        error,
        "Failed to delete homepage campaign"
      );
    }
  };

/* =========================================================
   HOLIDAYS
========================================================= */

const getHolidays =
  async (
    req,
    res
  ) => {
    try {
      const data =
        await service
          .getHolidays();

      return sendSuccess(
        res,
        {
          data,
        }
      );
    } catch (error) {
      return sendError(
        res,
        error,
        "Failed to fetch holiday heroes"
      );
    }
  };

const getHolidayById =
  async (
    req,
    res
  ) => {
    try {
      const data =
        await service
          .getHolidayById(
            req.params.id
          );

      return sendSuccess(
        res,
        {
          data,
        }
      );
    } catch (error) {
      return sendError(
        res,
        error,
        "Failed to fetch holiday hero"
      );
    }
  };

const updateHoliday =
  async (
    req,
    res
  ) => {
    try {
      const data =
        await service
          .updateHoliday(
            req.params.id,
            req.body
          );

      return sendSuccess(
        res,
        {
          message:
            "Holiday hero updated successfully",

          data,
        }
      );
    } catch (error) {
      return sendError(
        res,
        error,
        "Failed to update holiday hero"
      );
    }
  };

const toggleHoliday =
  async (
    req,
    res
  ) => {
    try {
      const data =
        await service
          .toggleHoliday(
            req.params.id,
            req.body
          );

      return sendSuccess(
        res,
        {
          message:
            data.is_enabled
              ? "Holiday hero enabled successfully"
              : "Holiday hero disabled successfully",

          data,
        }
      );
    } catch (error) {
      return sendError(
        res,
        error,
        "Failed to update holiday hero status"
      );
    }
  };

/* =========================================================
   MEDIA
========================================================= */

const createMediaUploadUrls =
  async (
    req,
    res
  ) => {
    try {
      const data =
        await service
          .createMediaUploadUrls(
            req.body
          );

      return sendSuccess(
        res,
        {
          data,
        }
      );
    } catch (error) {
      return sendError(
        res,
        error,
        "Failed to create hero media upload URLs"
      );
    }
  };

const deleteMedia =
  async (
    req,
    res
  ) => {
    try {
      await service
        .deleteMedia(
          req.body
        );

      return sendSuccess(
        res,
        {
          message:
            "Hero media deleted successfully",
        }
      );
    } catch (error) {
      return sendError(
        res,
        error,
        "Failed to delete hero media"
      );
    }
  };

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  getActiveHero,

  getDefaultHero,
  updateDefaultHero,

  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  toggleCampaign,
  deleteCampaign,

  getHolidays,
  getHolidayById,
  updateHoliday,
  toggleHoliday,

  createMediaUploadUrls,
  deleteMedia,
};