const prisma =
  require(
    "../config/prisma"
  );

const {
  deleteFileFromR2,
} = require(
  "../utils/uploadToR2"
);

const {
  createR2UploadUrl,
} = require(
  "../utils/r2Presigned"
);

/* =========================================================
   CONSTANTS
========================================================= */

const DEFAULT_HERO_ID =
  1;

const DEFAULT_TIMEZONE =
  "America/New_York";

const MEDIA_TYPES = [
  "IMAGE",
  "VIDEO",
];

const ANIMATIONS = [
  "NONE",
  "FADE",
  "SLIDE_UP",
  "SLIDE_DOWN",
  "SLIDE_LEFT",
  "SLIDE_RIGHT",
  "ZOOM_IN",
  "ZOOM_OUT",
];

const CAMPAIGN_STATUSES = [
  "DRAFT",
  "SCHEDULED",
  "ACTIVE",
  "ARCHIVED",
];

const DURATION_MODES = [
  "DAY",
  "TWO_DAYS",
  "WEEK",
  "CUSTOM",
];

/* =========================================================
   ERROR
========================================================= */

const throwError = (
  message,
  statusCode = 400
) => {
  const error =
    new Error(message);

  error.statusCode =
    statusCode;

  throw error;
};

/* =========================================================
   NORMALIZATION
========================================================= */

const normalizeString = (
  value
) => {
  if (
    value === undefined ||
    value === null
  ) {
    return null;
  }

  const normalized =
    String(value).trim();

  return normalized || null;
};

const parseInteger = (
  value,
  fallback = 0
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  const parsed =
    Number(value);

  if (
    !Number.isFinite(
      parsed
    )
  ) {
    return fallback;
  }

  return Math.round(
    parsed
  );
};

const parseBoolean = (
  value,
  fallback = false
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  if (
    typeof value ===
    "boolean"
  ) {
    return value;
  }

  const normalized =
    String(value)
      .trim()
      .toLowerCase();

  if (
    normalized ===
      "true" ||
    normalized ===
      "1"
  ) {
    return true;
  }

  if (
    normalized ===
      "false" ||
    normalized ===
      "0"
  ) {
    return false;
  }

  return fallback;
};

/* =========================================================
   ID
========================================================= */

const parseId = (
  value,
  label
) => {
  const id =
    Number(value);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throwError(
      `Valid ${label} ID is required`
    );
  }

  return id;
};

/* =========================================================
   ENUM
========================================================= */

const validateEnum = (
  value,
  allowed,
  field
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return;
  }

  if (
    !allowed.includes(
      value
    )
  ) {
    throwError(
      `Invalid ${field}`
    );
  }
};

/* =========================================================
   NUMERIC VALIDATION
========================================================= */

const validateNonNegative = (
  value,
  field
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return;
  }

  const parsed =
    Number(value);

  if (
    !Number.isFinite(
      parsed
    ) ||
    parsed < 0
  ) {
    throwError(
      `${field} must be 0 or greater`
    );
  }
};

const validateOverlay = (
  value
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return;
  }

  const parsed =
    Number(value);

  if (
    !Number.isFinite(
      parsed
    ) ||
    parsed < 0 ||
    parsed > 100
  ) {
    throwError(
      "Overlay opacity must be between 0 and 100"
    );
  }
};

/* =========================================================
   TIMEZONE
========================================================= */

const validateTimezone = (
  timezone
) => {
  const value =
    normalizeString(
      timezone
    ) ||
    DEFAULT_TIMEZONE;

  try {
    new Intl
      .DateTimeFormat(
        "en-US",
        {
          timeZone:
            value,
        }
      )
      .format(
        new Date()
      );

    return value;
  } catch {
    throwError(
      "Invalid timezone"
    );
  }
};

/* =========================================================
   DATE
========================================================= */

const parseDate = (
  value,
  field
) => {
  if (!value) {
    throwError(
      `${field} is required`
    );
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    throwError(
      `Invalid ${field.toLowerCase()}`
    );
  }

  return date;
};

/* =========================================================
   COMMON HERO VALIDATION
========================================================= */

const validateHeroOptions = (
  body = {}
) => {
  validateEnum(
    body.media_type,
    MEDIA_TYPES,
    "media type"
  );

  validateEnum(
    body.text_animation,
    ANIMATIONS,
    "text animation"
  );

  validateOverlay(
    body.overlay_opacity
  );

  validateNonNegative(
    body.text_start_delay,
    "Text start delay"
  );

  validateNonNegative(
    body
      .text_animation_duration,
    "Text animation duration"
  );

  validateNonNegative(
    body.description_delay,
    "Description delay"
  );

  validateNonNegative(
    body
      .text_visible_duration,
    "Text visible duration"
  );

  validateNonNegative(
    body.text_fade_duration,
    "Text fade duration"
  );

  validateNonNegative(
    body.video_load_delay,
    "Video load delay"
  );
};

/* =========================================================
   HERO UPDATE DATA
========================================================= */

const buildHeroUpdateData = (
  body = {}
) => {
  const data = {};

  const nullableStringFields = [
    "poster_url",
    "mobile_media_url",
    "mobile_poster_url",
    "alt_text",
    "description",
  ];

  nullableStringFields.forEach(
    (field) => {
      if (
        body[field] !==
        undefined
      ) {
        data[field] =
          normalizeString(
            body[field]
          );
      }
    }
  );

  if (
    body.media_type !==
    undefined
  ) {
    data.media_type =
      body.media_type;
  }

  if (
    body.text_animation !==
    undefined
  ) {
    data.text_animation =
      body.text_animation;
  }

  const numericFields = [
    "text_start_delay",
    "text_animation_duration",
    "description_delay",
    "text_visible_duration",
    "text_fade_duration",
    "video_load_delay",
    "overlay_opacity",
  ];

  numericFields.forEach(
    (field) => {
      if (
        body[field] !==
        undefined
      ) {
        data[field] =
          parseInteger(
            body[field]
          );
      }
    }
  );

  return data;
};

/* =========================================================
   DEFAULT HERO FORMAT
========================================================= */

const formatDefaultHero = (
  hero
) => ({
  ...hero,

  source_type:
    "DEFAULT",

  phase:
    "HERO",

  priority:
    0,

  runtime_status:
    "ACTIVE",

  is_live:
    true,
});

/* =========================================================
   GET DEFAULT HERO
========================================================= */

const getDefaultHero =
  async () => {
    const hero =
      await prisma
        .home_hero_default
        .findUnique({
          where: {
            id:
              DEFAULT_HERO_ID,
          },
        });

    if (!hero) {
      throwError(
        "Default homepage hero has not been configured",
        404
      );
    }

    return formatDefaultHero(
      hero
    );
  };

/* =========================================================
   UPDATE DEFAULT HERO
========================================================= */

const updateDefaultHero =
  async (
    body = {}
  ) => {
    validateHeroOptions(
      body
    );

    const existing =
      await prisma
        .home_hero_default
        .findUnique({
          where: {
            id:
              DEFAULT_HERO_ID,
          },
        });

    const heading =
      normalizeString(
        body.heading ??
          existing?.heading
      );

    const mediaUrl =
      normalizeString(
        body.media_url ??
          existing?.media_url
      );

    if (!heading) {
      throwError(
        "Default hero heading is required"
      );
    }

    if (!mediaUrl) {
      throwError(
        "Default hero media is required"
      );
    }

    const sharedData =
      buildHeroUpdateData(
        body
      );

    const updated =
      await prisma
        .home_hero_default
        .upsert({
          where: {
            id:
              DEFAULT_HERO_ID,
          },

          update: {
            ...sharedData,

            heading,

            media_url:
              mediaUrl,
          },

          create: {
            id:
              DEFAULT_HERO_ID,

            heading,

            media_url:
              mediaUrl,

            media_type:
              body.media_type ||
              "IMAGE",

            poster_url:
              normalizeString(
                body.poster_url
              ),

            mobile_media_url:
              normalizeString(
                body
                  .mobile_media_url
              ),

            mobile_poster_url:
              normalizeString(
                body
                  .mobile_poster_url
              ),

            alt_text:
              normalizeString(
                body.alt_text
              ),

            description:
              normalizeString(
                body.description
              ),

            text_animation:
              body.text_animation ||
              "SLIDE_UP",

            text_start_delay:
              parseInteger(
                body
                  .text_start_delay,
                150
              ),

            text_animation_duration:
              parseInteger(
                body
                  .text_animation_duration,
                1400
              ),

            description_delay:
              parseInteger(
                body
                  .description_delay,
                450
              ),

            text_visible_duration:
              parseInteger(
                body
                  .text_visible_duration,
                3100
              ),

            text_fade_duration:
              parseInteger(
                body
                  .text_fade_duration,
                700
              ),

            video_load_delay:
              parseInteger(
                body
                  .video_load_delay,
                1800
              ),

            overlay_opacity:
              parseInteger(
                body
                  .overlay_opacity,
                35
              ),
          },
        });

    return formatDefaultHero(
      updated
    );
  };

/* =========================================================
   CAMPAIGN RUNTIME STATUS
========================================================= */

const getCampaignRuntimeStatus = (
  campaign,
  now = new Date()
) => {
  if (
    campaign.status ===
    "DRAFT"
  ) {
    return "DRAFT";
  }

  if (
    campaign.status ===
    "ARCHIVED"
  ) {
    return "ARCHIVED";
  }

  if (
    !campaign.is_enabled
  ) {
    return "DISABLED";
  }

  if (
    campaign.end_at <=
    now
  ) {
    return "EXPIRED";
  }

  if (
    campaign.start_at >
    now
  ) {
    return "UPCOMING";
  }

  return "LIVE";
};

/* =========================================================
   FORMAT CAMPAIGN
========================================================= */

const formatCampaign = (
  campaign,
  now = new Date()
) => {
  const runtimeStatus =
    getCampaignRuntimeStatus(
      campaign,
      now
    );

  return {
    ...campaign,

    source_type:
      "CAMPAIGN",

    phase:
      "HERO",

    runtime_status:
      runtimeStatus,

    is_live:
      runtimeStatus ===
      "LIVE",
  };
};

/* =========================================================
   CAMPAIGN VALIDATION
========================================================= */

const validateCampaign = (
  body = {},
  existing = null
) => {
  validateHeroOptions(
    body
  );

  validateEnum(
    body.status ??
      existing?.status,
    CAMPAIGN_STATUSES,
    "campaign status"
  );

  validateNonNegative(
    body.priority,
    "Priority"
  );

  const name =
    normalizeString(
      body.name ??
        existing?.name
    );

  const heading =
    normalizeString(
      body.heading ??
        existing?.heading
    );

  const mediaUrl =
    normalizeString(
      body.media_url ??
        existing?.media_url
    );

  if (!name) {
    throwError(
      "Campaign name is required"
    );
  }

  if (!heading) {
    throwError(
      "Campaign heading is required"
    );
  }

  if (!mediaUrl) {
    throwError(
      "Campaign media is required"
    );
  }

  const startAt =
    parseDate(
      body.start_at ??
        existing?.start_at,
      "Campaign start date"
    );

  const endAt =
    parseDate(
      body.end_at ??
        existing?.end_at,
      "Campaign end date"
    );

  if (
    endAt <=
    startAt
  ) {
    throwError(
      "Campaign end date must be after start date"
    );
  }

  return {
    name,
    heading,
    mediaUrl,
    startAt,
    endAt,
  };
};

/* =========================================================
   GET CAMPAIGNS
========================================================= */

const getCampaigns =
  async ({
    status,
    isEnabled,
  } = {}) => {
    const where = {};

    if (status) {
      validateEnum(
        status,
        CAMPAIGN_STATUSES,
        "campaign status"
      );

      where.status =
        status;
    }

    if (
      isEnabled !==
        undefined &&
      isEnabled !==
        null &&
      isEnabled !==
        ""
    ) {
      where.is_enabled =
        parseBoolean(
          isEnabled
        );
    }

    const campaigns =
      await prisma
        .home_hero_campaigns
        .findMany({
          where,

          orderBy: [
            {
              start_at:
                "desc",
            },

            {
              priority:
                "desc",
            },

            {
              id:
                "desc",
            },
          ],
        });

    const now =
      new Date();

    return campaigns.map(
      (campaign) =>
        formatCampaign(
          campaign,
          now
        )
    );
  };

/* =========================================================
   GET CAMPAIGN BY ID
========================================================= */

const getCampaignById =
  async (
    value
  ) => {
    const id =
      parseId(
        value,
        "campaign"
      );

    const campaign =
      await prisma
        .home_hero_campaigns
        .findUnique({
          where: {
            id,
          },
        });

    if (!campaign) {
      throwError(
        "Homepage campaign not found",
        404
      );
    }

    return formatCampaign(
      campaign
    );
  };

/* =========================================================
   CREATE CAMPAIGN
========================================================= */

const createCampaign =
  async (
    body = {}
  ) => {
    const validated =
      validateCampaign(
        body
      );

    const timezone =
      validateTimezone(
        body.timezone
      );

    const campaign =
      await prisma
        .home_hero_campaigns
        .create({
          data: {
            name:
              validated.name,

            status:
              body.status ||
              "SCHEDULED",

            is_enabled:
              parseBoolean(
                body.is_enabled,
                true
              ),

            priority:
              parseInteger(
                body.priority,
                500
              ),

            media_type:
              body.media_type ||
              "IMAGE",

            media_url:
              validated.mediaUrl,

            poster_url:
              normalizeString(
                body.poster_url
              ),

            mobile_media_url:
              normalizeString(
                body
                  .mobile_media_url
              ),

            mobile_poster_url:
              normalizeString(
                body
                  .mobile_poster_url
              ),

            alt_text:
              normalizeString(
                body.alt_text
              ),

            heading:
              validated.heading,

            description:
              normalizeString(
                body.description
              ),

            text_animation:
              body.text_animation ||
              "SLIDE_UP",

            text_start_delay:
              parseInteger(
                body
                  .text_start_delay,
                150
              ),

            text_animation_duration:
              parseInteger(
                body
                  .text_animation_duration,
                1400
              ),

            description_delay:
              parseInteger(
                body
                  .description_delay,
                450
              ),

            text_visible_duration:
              parseInteger(
                body
                  .text_visible_duration,
                3100
              ),

            text_fade_duration:
              parseInteger(
                body
                  .text_fade_duration,
                700
              ),

            video_load_delay:
              parseInteger(
                body
                  .video_load_delay,
                1800
              ),

            overlay_opacity:
              parseInteger(
                body
                  .overlay_opacity,
                35
              ),

            start_at:
              validated.startAt,

            end_at:
              validated.endAt,

            timezone,
          },
        });

    return formatCampaign(
      campaign
    );
  };

/* =========================================================
   UPDATE CAMPAIGN
========================================================= */

const updateCampaign =
  async (
    value,
    body = {}
  ) => {
    const id =
      parseId(
        value,
        "campaign"
      );

    const existing =
      await prisma
        .home_hero_campaigns
        .findUnique({
          where: {
            id,
          },
        });

    if (!existing) {
      throwError(
        "Homepage campaign not found",
        404
      );
    }

    const validated =
      validateCampaign(
        body,
        existing
      );

    const data = {
      ...buildHeroUpdateData(
        body
      ),

      name:
        validated.name,

      heading:
        validated.heading,

      media_url:
        validated.mediaUrl,

      start_at:
        validated.startAt,

      end_at:
        validated.endAt,
    };

    if (
      body.status !==
      undefined
    ) {
      data.status =
        body.status;
    }

    if (
      body.is_enabled !==
      undefined
    ) {
      data.is_enabled =
        parseBoolean(
          body.is_enabled
        );
    }

    if (
      body.priority !==
      undefined
    ) {
      data.priority =
        parseInteger(
          body.priority,
          existing.priority
        );
    }

    if (
      body.timezone !==
      undefined
    ) {
      data.timezone =
        validateTimezone(
          body.timezone
        );
    }

    const updated =
      await prisma
        .home_hero_campaigns
        .update({
          where: {
            id,
          },

          data,
        });

    return formatCampaign(
      updated
    );
  };

/* =========================================================
   TOGGLE CAMPAIGN
========================================================= */

const toggleCampaign =
  async (
    value,
    body = {}
  ) => {
    const id =
      parseId(
        value,
        "campaign"
      );

    const existing =
      await prisma
        .home_hero_campaigns
        .findUnique({
          where: {
            id,
          },
        });

    if (!existing) {
      throwError(
        "Homepage campaign not found",
        404
      );
    }

    const isEnabled =
      body.is_enabled ===
      undefined
        ? !existing.is_enabled
        : parseBoolean(
            body.is_enabled
          );

    const updated =
      await prisma
        .home_hero_campaigns
        .update({
          where: {
            id,
          },

          data: {
            is_enabled:
              isEnabled,
          },
        });

    return formatCampaign(
      updated
    );
  };

/* =========================================================
   DELETE CAMPAIGN
========================================================= */

const deleteCampaign =
  async (
    value
  ) => {
    const id =
      parseId(
        value,
        "campaign"
      );

    const existing =
      await prisma
        .home_hero_campaigns
        .findUnique({
          where: {
            id,
          },

          select: {
            id: true,
          },
        });

    if (!existing) {
      throwError(
        "Homepage campaign not found",
        404
      );
    }

    await prisma
      .home_hero_campaigns
      .delete({
        where: {
          id,
        },
      });

    return true;
  };

/* =========================================================
   ACTIVE CAMPAIGN
========================================================= */

const getActiveCampaign =
  async (
    now = new Date()
  ) => {
    const campaign =
      await prisma
        .home_hero_campaigns
        .findFirst({
          where: {
            is_enabled:
              true,

            status: {
              in: [
                "SCHEDULED",
                "ACTIVE",
              ],
            },

            start_at: {
              lte:
                now,
            },

            end_at: {
              gt:
                now,
            },
          },

          orderBy: [
            {
              priority:
                "desc",
            },

            {
              created_at:
                "desc",
            },

            {
              id:
                "desc",
            },
          ],
        });

    if (!campaign) {
      return null;
    }

    return formatCampaign(
      campaign,
      now
    );
  };

/* =========================================================
   TIMEZONE DATE PARTS
========================================================= */

const getDatePartsInTimezone = (
  date = new Date(),
  timezone =
    DEFAULT_TIMEZONE
) => {
  const safeTimezone =
    validateTimezone(
      timezone
    );

  const formatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          safeTimezone,

        year:
          "numeric",

        month:
          "2-digit",

        day:
          "2-digit",

        hour:
          "2-digit",

        minute:
          "2-digit",

        second:
          "2-digit",

        hourCycle:
          "h23",
      }
    );

  const parts =
    formatter
      .formatToParts(
        date
      );

  const result = {};

  parts.forEach(
    (part) => {
      if (
        part.type !==
        "literal"
      ) {
        result[
          part.type
        ] =
          Number(
            part.value
          );
      }
    }
  );

  return {
    year:
      result.year,

    month:
      result.month,

    day:
      result.day,

    hour:
      result.hour,

    minute:
      result.minute,

    second:
      result.second,
  };
};

/* =========================================================
   WALL CLOCK TIMESTAMP
========================================================= */

/*
 * Used only to compare calendar values
 * inside the same configured timezone.
 */

const toWallClockTimestamp = ({
  year,
  month,
  day,
  hour = 0,
  minute = 0,
  second = 0,
}) =>
  Date.UTC(
    year,
    month - 1,
    day,
    hour,
    minute,
    second
  );

/* =========================================================
   HOLIDAY DATE HELPERS
========================================================= */

const getNthWeekdayOfMonth = (
  year,
  month,
  weekday,
  occurrence
) => {
  const first =
    new Date(
      Date.UTC(
        year,
        month - 1,
        1
      )
    );

  const offset =
    (
      weekday -
      first.getUTCDay() +
      7
    ) % 7;

  return {
    year,
    month,

    day:
      1 +
      offset +
      (
        occurrence -
        1
      ) *
        7,
  };
};

const getLastWeekdayOfMonth = (
  year,
  month,
  weekday
) => {
  const last =
    new Date(
      Date.UTC(
        year,
        month,
        0
      )
    );

  const offset =
    (
      last.getUTCDay() -
      weekday +
      7
    ) % 7;

  return {
    year,
    month,

    day:
      last.getUTCDate() -
      offset,
  };
};

/* =========================================================
   GET HOLIDAY DATE
========================================================= */

const getHolidayDate = (
  event,
  year
) => {
  switch (event) {
    case "NEW_YEAR":
      return {
        year,
        month: 1,
        day: 1,
      };

    case "MEMORIAL_DAY":
      return getLastWeekdayOfMonth(
        year,
        5,
        1
      );

    case "INDEPENDENCE_DAY":
      return {
        year,
        month: 7,
        day: 4,
      };

    case "LABOR_DAY":
      return getNthWeekdayOfMonth(
        year,
        9,
        1,
        1
      );

    case "HALLOWEEN":
      return {
        year,
        month: 10,
        day: 31,
      };

    case "THANKSGIVING":
      return getNthWeekdayOfMonth(
        year,
        11,
        4,
        4
      );

    case "CHRISTMAS":
      return {
        year,
        month: 12,
        day: 25,
      };

    default:
      return null;
  }
};

/* =========================================================
   HOLIDAY WINDOW
========================================================= */

const getHolidayWindow = (
  holiday,
  year
) => {
  const eventDate =
    getHolidayDate(
      holiday.event,
      year
    );

  if (!eventDate) {
    return null;
  }

  const eventTimestamp =
    toWallClockTimestamp(
      eventDate
    );

  const ONE_HOUR =
    60 *
    60 *
    1000;

  const ONE_DAY =
    24 *
    ONE_HOUR;

  let startTimestamp =
    eventTimestamp;

  let endTimestamp =
    eventTimestamp +
    ONE_DAY;

  switch (
    holiday.duration_mode
  ) {
    case "TWO_DAYS":
      /*
       * Day before + event day.
       */
      startTimestamp =
        eventTimestamp -
        ONE_DAY;

      endTimestamp =
        eventTimestamp +
        ONE_DAY;

      break;

    case "WEEK":
      /*
       * Event day + previous six days.
       */
      startTimestamp =
        eventTimestamp -
        6 *
          ONE_DAY;

      endTimestamp =
        eventTimestamp +
        ONE_DAY;

      break;

    case "CUSTOM": {
      const startOffset =
        holiday
          .custom_start_offset_hours;

      const endOffset =
        holiday
          .custom_end_offset_hours;

      if (
        startOffset ===
          null ||
        startOffset ===
          undefined ||
        endOffset ===
          null ||
        endOffset ===
          undefined
      ) {
        return null;
      }

      if (
        endOffset <=
        startOffset
      ) {
        return null;
      }

      startTimestamp =
        eventTimestamp +
        startOffset *
          ONE_HOUR;

      endTimestamp =
        eventTimestamp +
        endOffset *
          ONE_HOUR;

      break;
    }

    case "DAY":
    default:
      break;
  }

  return {
    eventDate,
    startTimestamp,
    endTimestamp,
  };
};

/* =========================================================
   FIND LIVE HOLIDAY WINDOW
========================================================= */

const findActiveHolidayWindow = (
  holiday,
  currentParts
) => {
  const currentTimestamp =
    toWallClockTimestamp(
      currentParts
    );

  /*
   * Surrounding years matter for
   * NEW_YEAR WEEK/CUSTOM windows.
   */

  const years = [
    currentParts.year - 1,
    currentParts.year,
    currentParts.year + 1,
  ];

  for (
    const year of years
  ) {
    const window =
      getHolidayWindow(
        holiday,
        year
      );

    if (!window) {
      continue;
    }

    if (
      currentTimestamp >=
        window
          .startTimestamp &&
      currentTimestamp <
        window
          .endTimestamp
    ) {
      return window;
    }
  }

  return null;
};

/* =========================================================
   NEW YEAR COUNTDOWN
========================================================= */

const resolveNewYearCountdown = (
  holiday,
  currentParts
) => {
  if (
    holiday.event !==
      "NEW_YEAR" ||
    !holiday
      .enable_countdown
  ) {
    return null;
  }

  /*
   * Countdown phase:
   *
   * December 31
   * in holiday timezone.
   */

  if (
    currentParts.month !==
      12 ||
    currentParts.day !==
      31
  ) {
    return null;
  }

  const mediaUrl =
    normalizeString(
      holiday
        .countdown_media_url
    ) ||
    normalizeString(
      holiday.media_url
    );

  if (!mediaUrl) {
    return null;
  }

  const timezone =
    holiday.timezone ||
    DEFAULT_TIMEZONE;

  return {
    source_type:
      "HOLIDAY",

    phase:
      "COUNTDOWN",

    id:
      holiday.id,

    event:
      holiday.event,

    name:
      holiday.name,

    priority:
      holiday.priority,

    timezone,

    media_type:
      holiday
        .countdown_media_type ||
      holiday.media_type,

    media_url:
      mediaUrl,

    poster_url:
      holiday
        .countdown_poster_url ||
      holiday.poster_url,

    mobile_media_url:
      holiday
        .countdown_mobile_media_url ||
      holiday
        .mobile_media_url,

    mobile_poster_url:
      holiday
        .countdown_mobile_poster_url ||
      holiday
        .mobile_poster_url,

    alt_text:
      holiday.alt_text,

    heading:
      holiday
        .countdown_heading ||
      holiday.heading,

    description:
      holiday
        .countdown_description ||
      holiday.description,

    text_animation:
      holiday.text_animation,

    text_start_delay:
      holiday
        .text_start_delay,

    text_animation_duration:
      holiday
        .text_animation_duration,

    description_delay:
      holiday
        .description_delay,

    text_visible_duration:
      holiday
        .text_visible_duration,

    text_fade_duration:
      holiday
        .text_fade_duration,

    video_load_delay:
      holiday
        .video_load_delay,

    overlay_opacity:
      holiday
        .overlay_opacity,

    runtime_status:
      "LIVE",

    is_live:
      true,

    countdown: {
      year:
        currentParts.year +
        1,

      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,

      timezone,
    },
  };
};

/* =========================================================
   RESOLVE HOLIDAY
========================================================= */

const resolveHoliday = (
  holiday,
  now = new Date()
) => {
  if (
    !holiday ||
    !holiday.is_enabled
  ) {
    return null;
  }

  const timezone =
    holiday.timezone ||
    DEFAULT_TIMEZONE;

  const currentParts =
    getDatePartsInTimezone(
      now,
      timezone
    );

  const countdown =
    resolveNewYearCountdown(
      holiday,
      currentParts
    );

  if (countdown) {
    return countdown;
  }

  if (!holiday.media_url) {
    return null;
  }

  const window =
    findActiveHolidayWindow(
      holiday,
      currentParts
    );

  if (!window) {
    return null;
  }

  return {
    source_type:
      "HOLIDAY",

    phase:
      "HERO",

    id:
      holiday.id,

    event:
      holiday.event,

    name:
      holiday.name,

    priority:
      holiday.priority,

    timezone,

    duration_mode:
      holiday
        .duration_mode,

    media_type:
      holiday.media_type,

    media_url:
      holiday.media_url,

    poster_url:
      holiday.poster_url,

    mobile_media_url:
      holiday
        .mobile_media_url,

    mobile_poster_url:
      holiday
        .mobile_poster_url,

    alt_text:
      holiday.alt_text,

    heading:
      holiday.heading,

    description:
      holiday.description,

    text_animation:
      holiday.text_animation,

    text_start_delay:
      holiday
        .text_start_delay,

    text_animation_duration:
      holiday
        .text_animation_duration,

    description_delay:
      holiday
        .description_delay,

    text_visible_duration:
      holiday
        .text_visible_duration,

    text_fade_duration:
      holiday
        .text_fade_duration,

    video_load_delay:
      holiday
        .video_load_delay,

    overlay_opacity:
      holiday
        .overlay_opacity,

    runtime_status:
      "LIVE",

    is_live:
      true,
  };
};

/* =========================================================
   NEXT EVENT DATE
========================================================= */

const getNextEventDate = (
  event,
  timezone =
    DEFAULT_TIMEZONE,
  now = new Date()
) => {
  const current =
    getDatePartsInTimezone(
      now,
      timezone
    );

  const todayTimestamp =
    toWallClockTimestamp({
      year:
        current.year,

      month:
        current.month,

      day:
        current.day,
    });

  let eventDate =
    getHolidayDate(
      event,
      current.year
    );

  if (!eventDate) {
    return null;
  }

  const eventTimestamp =
    toWallClockTimestamp(
      eventDate
    );

  if (
    eventTimestamp <
    todayTimestamp
  ) {
    eventDate =
      getHolidayDate(
        event,
        current.year +
          1
      );
  }

  return eventDate;
};

/* =========================================================
   FORMAT HOLIDAY
========================================================= */

const formatHoliday = (
  holiday,
  now = new Date()
) => {
  const active =
    resolveHoliday(
      holiday,
      now
    );

  return {
    ...holiday,

    source_type:
      "HOLIDAY",

    is_live:
      Boolean(active),

    active_phase:
      active?.phase ||
      null,

    next_event_date:
      getNextEventDate(
        holiday.event,
        holiday.timezone ||
          DEFAULT_TIMEZONE,
        now
      ),
  };
};

/* =========================================================
   GET HOLIDAYS
========================================================= */

const getHolidays =
  async () => {
    const holidays =
      await prisma
        .home_hero_holidays
        .findMany({
          orderBy: [
            {
              id:
                "asc",
            },
          ],
        });

    const now =
      new Date();

    return holidays.map(
      (holiday) =>
        formatHoliday(
          holiday,
          now
        )
    );
  };

/* =========================================================
   GET HOLIDAY BY ID
========================================================= */

const getHolidayById =
  async (
    value
  ) => {
    const id =
      parseId(
        value,
        "holiday"
      );

    const holiday =
      await prisma
        .home_hero_holidays
        .findUnique({
          where: {
            id,
          },
        });

    if (!holiday) {
      throwError(
        "Holiday hero not found",
        404
      );
    }

    return formatHoliday(
      holiday
    );
  };

/* =========================================================
   UPDATE HOLIDAY
========================================================= */

const updateHoliday =
  async (
    value,
    body = {}
  ) => {
    const id =
      parseId(
        value,
        "holiday"
      );

    const existing =
      await prisma
        .home_hero_holidays
        .findUnique({
          where: {
            id,
          },
        });

    if (!existing) {
      throwError(
        "Holiday hero not found",
        404
      );
    }

    validateHeroOptions(
      body
    );

    validateEnum(
      body
        .countdown_media_type,
      MEDIA_TYPES,
      "countdown media type"
    );

    validateEnum(
      body.duration_mode,
      DURATION_MODES,
      "duration mode"
    );

    validateNonNegative(
      body.priority,
      "Priority"
    );

    const data =
      buildHeroUpdateData(
        body
      );

    const stringFields = [
      "name",
      "media_url",
      "heading",
      "countdown_heading",
      "countdown_description",
      "countdown_media_url",
      "countdown_poster_url",
      "countdown_mobile_media_url",
      "countdown_mobile_poster_url",
    ];

    stringFields.forEach(
      (field) => {
        if (
          body[field] !==
          undefined
        ) {
          data[field] =
            normalizeString(
              body[field]
            );
        }
      }
    );

    if (
      body.is_enabled !==
      undefined
    ) {
      data.is_enabled =
        parseBoolean(
          body.is_enabled
        );
    }

    if (
      body.enable_countdown !==
      undefined
    ) {
      data.enable_countdown =
        parseBoolean(
          body
            .enable_countdown
        );
    }

    if (
      body.priority !==
      undefined
    ) {
      data.priority =
        parseInteger(
          body.priority,
          existing.priority
        );
    }

    if (
      body.duration_mode !==
      undefined
    ) {
      data.duration_mode =
        body.duration_mode;
    }

    if (
      body
        .countdown_media_type !==
      undefined
    ) {
      data.countdown_media_type =
        body
          .countdown_media_type ||
        null;
    }

    const nullableNumericFields = [
      "custom_start_offset_hours",
      "custom_end_offset_hours",
    ];

    nullableNumericFields.forEach(
      (field) => {
        if (
          body[field] ===
          undefined
        ) {
          return;
        }

        if (
          body[field] ===
            null ||
          body[field] ===
            ""
        ) {
          data[field] =
            null;

          return;
        }

        const parsed =
          Number(body[field]);

        if (
          !Number.isFinite(
            parsed
          )
        ) {
          throwError(
            `Invalid ${field}`
          );
        }

        data[field] =
          Math.round(
            parsed
          );
      }
    );

    if (
      body.timezone !==
      undefined
    ) {
      data.timezone =
        validateTimezone(
          body.timezone
        );
    }

    /*
     * Countdown is allowed only
     * for New Year.
     */

    if (
      existing.event !==
      "NEW_YEAR"
    ) {
      data.enable_countdown =
        false;

      data.countdown_heading =
        null;

      data.countdown_description =
        null;

      data.countdown_media_type =
        null;

      data.countdown_media_url =
        null;

      data.countdown_poster_url =
        null;

      data.countdown_mobile_media_url =
        null;

      data.countdown_mobile_poster_url =
        null;
    }

    const finalDurationMode =
      data.duration_mode ??
      existing.duration_mode;

    const finalStartOffset =
      data
        .custom_start_offset_hours !==
      undefined
        ? data
            .custom_start_offset_hours
        : existing
            .custom_start_offset_hours;

    const finalEndOffset =
      data
        .custom_end_offset_hours !==
      undefined
        ? data
            .custom_end_offset_hours
        : existing
            .custom_end_offset_hours;

    if (
      finalDurationMode ===
      "CUSTOM"
    ) {
      if (
        finalStartOffset ===
          null ||
        finalStartOffset ===
          undefined ||
        finalEndOffset ===
          null ||
        finalEndOffset ===
          undefined
      ) {
        throwError(
          "Custom start and end offsets are required"
        );
      }

      if (
        finalEndOffset <=
        finalStartOffset
      ) {
        throwError(
          "Custom end offset must be greater than custom start offset"
        );
      }
    }

    const updated =
      await prisma
        .home_hero_holidays
        .update({
          where: {
            id,
          },

          data,
        });

    return formatHoliday(
      updated
    );
  };

/* =========================================================
   TOGGLE HOLIDAY
========================================================= */

const toggleHoliday =
  async (
    value,
    body = {}
  ) => {
    const id =
      parseId(
        value,
        "holiday"
      );

    const existing =
      await prisma
        .home_hero_holidays
        .findUnique({
          where: {
            id,
          },
        });

    if (!existing) {
      throwError(
        "Holiday hero not found",
        404
      );
    }

    const isEnabled =
      body.is_enabled ===
      undefined
        ? !existing.is_enabled
        : parseBoolean(
            body.is_enabled
          );

    if (
      isEnabled &&
      !existing.media_url
    ) {
      throwError(
        "Holiday hero media is required before enabling"
      );
    }

    const updated =
      await prisma
        .home_hero_holidays
        .update({
          where: {
            id,
          },

          data: {
            is_enabled:
              isEnabled,
          },
        });

    return formatHoliday(
      updated
    );
  };

/* =========================================================
   ACTIVE HOLIDAY
========================================================= */

const getActiveHoliday =
  async (
    now = new Date()
  ) => {
    const holidays =
      await prisma
        .home_hero_holidays
        .findMany({
          where: {
            is_enabled:
              true,
          },

          orderBy: [
            {
              priority:
                "desc",
            },

            {
              id:
                "asc",
            },
          ],
        });

    let selected =
      null;

    for (
      const holiday of holidays
    ) {
      const resolved =
        resolveHoliday(
          holiday,
          now
        );

      if (!resolved) {
        continue;
      }

      if (
        !selected ||
        resolved.priority >
          selected.priority
      ) {
        selected =
          resolved;
      }
    }

    return selected;
  };

/* =========================================================
   ACTIVE HERO RESOLVER
========================================================= */

const getActiveHero =
  async () => {
    const now =
      new Date();

    /*
     * Campaign and holiday can
     * be resolved in parallel.
     */

    const [
      campaign,
      holiday,
    ] =
      await Promise.all([
        getActiveCampaign(
          now
        ),

        getActiveHoliday(
          now
        ),
      ]);

    /*
     * Both live:
     * highest priority wins.
     *
     * Equal priority:
     * custom campaign wins.
     */

    if (
      campaign &&
      holiday
    ) {
      if (
        holiday.priority >
        campaign.priority
      ) {
        return holiday;
      }

      return campaign;
    }

    if (campaign) {
      return campaign;
    }

    if (holiday) {
      return holiday;
    }

    /*
     * Database fallback only
     * when no special hero exists.
     */

    return getDefaultHero();
  };

/* =========================================================
   MEDIA UPLOAD URLS
========================================================= */

/* =========================================================
   MEDIA UPLOAD URLS
========================================================= */

const createMediaUploadUrls =
  async (
    body = {}
  ) => {
    const {
      files = [],
      type = "campaign",
    } = body;

    if (
      !Array.isArray(
        files
      ) ||
      files.length === 0
    ) {
      throwError(
        "Files are required"
      );
    }

    const allowedTypes = [
      "default",
      "campaign",
      "holiday",
    ];

    if (
      !allowedTypes.includes(
        type
      )
    ) {
      throwError(
        "Invalid upload type"
      );
    }

    let folder =
      "Home Page/home hero/campaigns";

    if (
      type ===
      "default"
    ) {
      folder =
        "Home Page/home hero/default";
    }

    if (
      type ===
      "holiday"
    ) {
      folder =
        "Home Page/home hero/holidays";
    }

    const uploads =
      await Promise.all(
        files.map(
          async (
            file
          ) => {
            const fileName =
              normalizeString(
                file?.fileName
              );

            if (!fileName) {
              throwError(
                "File name is required"
              );
            }

            const result =
              await createR2UploadUrl(
                fileName,
                folder
              );



            return result;
          }
        )
      );

    return uploads;
  };

/* =========================================================
   R2 OBJECT KEY
========================================================= */

const getR2ObjectKey = (
  url
) => {
  const publicUrl =
    normalizeString(
      process.env
        .R2_PUBLIC_URL
    );

  const mediaUrl =
    normalizeString(
      url
    );

  if (
    !publicUrl ||
    !mediaUrl
  ) {
    return "";
  }

  const baseUrl =
    publicUrl.replace(
      /\/+$/,
      ""
    );

  const prefix =
    `${baseUrl}/`;

  if (
    !mediaUrl.startsWith(
      prefix
    )
  ) {
    return "";
  }

  const encodedKey =
    mediaUrl.slice(
      prefix.length
    );

  try {
    return decodeURIComponent(
      encodedKey
    );
  } catch {
    return encodedKey;
  }
};

/* =========================================================
   DELETE MEDIA
========================================================= */

const deleteMedia =
  async (
    body = {}
  ) => {
    const url =
      normalizeString(
        body.url
      );

    if (!url) {
      throwError(
        "Media URL is required"
      );
    }

    const objectKey =
      getR2ObjectKey(
        url
      );

    if (!objectKey) {
      throwError(
        "Invalid R2 media URL"
      );
    }

    const allowedPrefix =
      "Home Page/home hero/";

    if (
      !objectKey.startsWith(
        allowedPrefix
      )
    ) {
      throwError(
        "Invalid home hero media path"
      );
    }

    await deleteFileFromR2(
      objectKey
    );

    return true;
  };

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  /* Resolver */
  getActiveHero,

  /* Default */
  getDefaultHero,
  updateDefaultHero,

  /* Campaigns */
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  toggleCampaign,
  deleteCampaign,

  /* Holidays */
  getHolidays,
  getHolidayById,
  updateHoliday,
  toggleHoliday,

  /* Media */
  createMediaUploadUrls,
  deleteMedia,

  /* Helpers useful for tests */
  getHolidayDate,
  getHolidayWindow,
  resolveHoliday,
};