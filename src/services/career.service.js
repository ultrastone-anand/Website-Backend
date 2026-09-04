// services/career.service.js

const prisma =
  require('../config/prisma');

const auditService =
  require('./audit.service');

const {
  uploadToR2,
  deleteFileFromR2,
} = require('../utils/uploadToR2');

// ======================================================
// CONSTANTS
// ======================================================

const JOB_STATUSES = [
  'DRAFT',
  'PUBLISHED',
  'CLOSED',
  'ARCHIVED',
];

const EMPLOYMENT_TYPES = [
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
  'INTERNSHIP',
  'TEMPORARY',
];

const WORK_MODES = [
  'ONSITE',
  'REMOTE',
  'HYBRID',
];

const APPLICATION_STATUSES = [
  'NEW',
  'REVIEWING',
  'SHORTLISTED',
  'INTERVIEW',
  'SELECTED',
  'REJECTED',
  'WITHDRAWN',
];

const APPLICATION_TYPES = [
  'JOB_APPLICATION',
  'GENERAL_RESUME',
];

const EXPERIENCE_LEVELS = [
  'ZERO_TO_TWO',
  'THREE_TO_FIVE',
  'FIVE_PLUS',
];

// ======================================================
// HELPERS
// ======================================================

const serialize = (
  data
) =>
  JSON.parse(
    JSON.stringify(
      data,
      (_, value) =>
        typeof value ===
        'bigint'
          ? value.toString()
          : value
    )
  );

const parseArray = (
  value
) => {
  if (
    Array.isArray(value)
  ) {
    return value
      .map((item) =>
        String(item).trim()
      )
      .filter(Boolean);
  }

  if (!value) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(value);

    if (
      !Array.isArray(parsed)
    ) {
      return [];
    }

    return parsed
      .map((item) =>
        String(item).trim()
      )
      .filter(Boolean);
  } catch {
    return [];
  }
};

const toBoolean = (
  value,
  fallback = false
) => {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return fallback;
  }

  return (
    value === true ||
    value === 'true'
  );
};

const normalizeText = (
  value
) => {
  if (
    value === undefined
  ) {
    return undefined;
  }

  const normalized =
    String(value).trim();

  return (
    normalized ||
    null
  );
};

const parseOptionalDate = (
  value
) => {
  if (
    value === undefined
  ) {
    return undefined;
  }

  if (
    value === null ||
    value === ''
  ) {
    return null;
  }

  const parsedDate =
    new Date(value);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return null;
  }

  return parsedDate;
};

const parsePositiveInteger = (
  value,
  fallback = 1
) => {
  const parsedValue =
    Number(value);

  if (
    !Number.isInteger(
      parsedValue
    ) ||
    parsedValue < 1
  ) {
    return fallback;
  }

  return parsedValue;
};

const validateEmail = (
  email
) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );

const parseBigIntId = (
  value,
  errorMessage
) => {
  try {
    const parsed =
      BigInt(value);

    if (
      parsed <= 0n
    ) {
      throw new Error();
    }

    return parsed;
  } catch {
    throw new Error(
      errorMessage
    );
  }
};

const escapeHtml = (
  value = ''
) =>
  String(value)
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    )
    .replace(
      /"/g,
      '&quot;'
    )
    .replace(
      /'/g,
      '&#039;'
    );

const parseEmailList = (
  value = ''
) =>
  String(value)
    .split(',')
    .map((email) =>
      email.trim()
    )
    .filter(Boolean)
    .map((email) => ({
      emailAddress: {
        address:
          email,
      },
    }));

const formatApplicationType = (
  value
) => {
  if (
    value ===
    'GENERAL_RESUME'
  ) {
    return 'General Resume';
  }

  return 'Job Application';
};

const formatExperienceLevel = (
  value
) => {
  const labels = {
    ZERO_TO_TWO:
      '0–2 Years',

    THREE_TO_FIVE:
      '3–5 Years',

    FIVE_PLUS:
      '5+ Years',
  };

  return (
    labels[value] ||
    value ||
    'Not Provided'
  );
};

const tableRow = (
  label,
  value
) => {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return '';
  }

  return `
    <tr>
      <td
        style="
          width:190px;
          padding:13px 15px;
          background:#f6f6f6;
          border:1px solid #e2e2e2;
          font-size:11px;
          font-weight:700;
          text-transform:uppercase;
          letter-spacing:.5px;
          color:#555555;
          vertical-align:top;
        "
      >
        ${escapeHtml(label)}
      </td>

      <td
        style="
          padding:13px 15px;
          border:1px solid #e2e2e2;
          font-size:14px;
          color:#222222;
          line-height:1.6;
          vertical-align:top;
        "
      >
        ${escapeHtml(value)}
      </td>
    </tr>
  `;
};

// ======================================================
// MICROSOFT GRAPH EMAIL
// ======================================================

const getMicrosoftGraphAccessToken =
  async () => {
    const tenantId =
      process.env
        .MS_TENANT_ID;

    const clientId =
      process.env
        .MS_CLIENT_ID;

    const clientSecret =
      process.env
        .MS_CLIENT_SECRET;

    if (
      !tenantId ||
      !clientId ||
      !clientSecret
    ) {
      throw new Error(
        'Microsoft Graph email configuration is missing'
      );
    }

    const tokenUrl =
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

    const params =
      new URLSearchParams();

    params.append(
      'client_id',
      clientId
    );

    params.append(
      'client_secret',
      clientSecret
    );

    params.append(
      'scope',
      'https://graph.microsoft.com/.default'
    );

    params.append(
      'grant_type',
      'client_credentials'
    );

    const response =
      await fetch(
        tokenUrl,
        {
          method:
            'POST',

          headers: {
            'Content-Type':
              'application/x-www-form-urlencoded',
          },

          body:
            params.toString(),
        }
      );

    if (
      !response.ok
    ) {
      const errorText =
        await response.text();

      throw new Error(
        `Failed to get Microsoft Graph access token: ${errorText}`
      );
    }

    const data =
      await response.json();

    if (
      !data.access_token
    ) {
      throw new Error(
        'Microsoft Graph access token was not returned'
      );
    }

    return data.access_token;
  };

const sendMicrosoftGraphEmail =
  async ({
    accessToken,
    toRecipients,
    subject,
    html,
    replyTo,
  }) => {
    const senderEmail =
      process.env
        .MS_SENDER_EMAIL;

    if (!senderEmail) {
      throw new Error(
        'MS_SENDER_EMAIL is not configured'
      );
    }

    const recipients =
      parseEmailList(
        toRecipients
      );

    if (
      recipients.length ===
      0
    ) {
      throw new Error(
        'Career application email recipient is not configured'
      );
    }

    const message = {
      subject,

      body: {
        contentType:
          'HTML',

        content:
          html,
      },

      toRecipients:
        recipients,
    };

    if (
      replyTo &&
      validateEmail(
        replyTo
      )
    ) {
      message.replyTo = [
        {
          emailAddress: {
            address:
              replyTo,
          },
        },
      ];
    }

    const response =
      await fetch(
        `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(
          senderEmail
        )}/sendMail`,
        {
          method:
            'POST',

          headers: {
            Authorization:
              `Bearer ${accessToken}`,

            'Content-Type':
              'application/json',
          },

          body:
            JSON.stringify({
              message,

              saveToSentItems:
                true,
            }),
        }
      );

    if (
      !response.ok
    ) {
      const errorText =
        await response.text();

      throw new Error(
        `Microsoft Graph email failed: ${errorText}`
      );
    }

    return {
      success:
        true,

      status:
        response.status,
    };
  };

// ======================================================
// CAREER APPLICATION EMAIL
// ======================================================

const buildCareerApplicationEmail =
  ({
    application,
    job,
  }) => {
    const fullName =
      `${application.first_name || ''} ${
        application.last_name || ''
      }`.trim();

    const isGeneralResume =
      application.application_type ===
      'GENERAL_RESUME';

    const jobTitle =
      job?.title ||
      'General Resume Submission';

    const subject =
      isGeneralResume
        ? `New General Resume Submission — ${fullName}`
        : `New Job Application — ${jobTitle} — ${fullName}`;

    const resumeButton =
      application.resume_url
        ? `
          <a
            href="${escapeHtml(
              application.resume_url
            )}"
            target="_blank"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#e42733;
              color:#ffffff;
              text-decoration:none;
              font-size:13px;
              font-weight:700;
              border-radius:3px;
              margin-right:8px;
              margin-bottom:8px;
            "
          >
            View Resume
          </a>
        `
        : '';

    const coverLetterButton =
      application
        .cover_letter_url
        ? `
          <a
            href="${escapeHtml(
              application.cover_letter_url
            )}"
            target="_blank"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#333333;
              color:#ffffff;
              text-decoration:none;
              font-size:13px;
              font-weight:700;
              border-radius:3px;
              margin-bottom:8px;
            "
          >
            View Cover Letter
          </a>
        `
        : '';

    const messageSection =
      application.message
        ? `
          <div
            style="
              margin-top:25px;
            "
          >
            <div
              style="
                font-size:12px;
                font-weight:700;
                text-transform:uppercase;
                letter-spacing:.7px;
                color:#555555;
                margin-bottom:8px;
              "
            >
              Applicant Message
            </div>

            <div
              style="
                padding:16px;
                background:#f8f8f8;
                border-left:3px solid #e42733;
                font-size:14px;
                line-height:1.7;
                color:#333333;
                white-space:pre-line;
              "
            >
              ${escapeHtml(
                application.message
              )}
            </div>
          </div>
        `
        : '';

    const html = `
      <!DOCTYPE html>

      <html>
        <head>
          <meta
            charset="UTF-8"
          />
        </head>

        <body
          style="
            margin:0;
            padding:0;
            background:#f3f3f3;
            font-family:Arial, Helvetica, sans-serif;
          "
        >
          <div
            style="
              width:100%;
              background:#f3f3f3;
              padding:35px 15px;
              box-sizing:border-box;
            "
          >
            <div
              style="
                max-width:720px;
                margin:0 auto;
                background:#ffffff;
                border:1px solid #e4e4e4;
              "
            >

              <!-- HEADER -->

              <div
                style="
                  background:#111111;
                  padding:28px 30px;
                  border-bottom:4px solid #e42733;
                "
              >
                <div
                  style="
                    font-size:11px;
                    font-weight:700;
                    color:#e42733;
                    text-transform:uppercase;
                    letter-spacing:1.5px;
                    margin-bottom:7px;
                  "
                >
                  Ultra Stones Careers
                </div>

                <div
                  style="
                    color:#ffffff;
                    font-size:25px;
                    font-weight:700;
                    line-height:1.3;
                  "
                >
                  ${
                    isGeneralResume
                      ? 'New General Resume Submission'
                      : 'New Job Application'
                  }
                </div>
              </div>

              <!-- CONTENT -->

              <div
                style="
                  padding:30px;
                "
              >

                <div
                  style="
                    font-size:15px;
                    color:#333333;
                    line-height:1.7;
                    margin-bottom:25px;
                  "
                >
                  A new career submission has been received through the
                  Ultra Stones website.
                </div>

                ${
                  !isGeneralResume
                    ? `
                      <div
                        style="
                          margin-bottom:25px;
                          padding:18px;
                          background:#fff6f6;
                          border-left:4px solid #e42733;
                        "
                      >
                        <div
                          style="
                            font-size:11px;
                            text-transform:uppercase;
                            letter-spacing:.7px;
                            font-weight:700;
                            color:#777777;
                            margin-bottom:6px;
                          "
                        >
                          Position Applied For
                        </div>

                        <div
                          style="
                            font-size:19px;
                            font-weight:700;
                            color:#111111;
                          "
                        >
                          ${escapeHtml(
                            jobTitle
                          )}
                        </div>

                        ${
                          job?.department
                            ? `
                              <div
                                style="
                                  font-size:13px;
                                  color:#666666;
                                  margin-top:5px;
                                "
                              >
                                ${escapeHtml(
                                  job.department
                                )}
                                ${
                                  job.location
                                    ? ` • ${escapeHtml(
                                        job.location
                                      )}`
                                    : ''
                                }
                              </div>
                            `
                            : ''
                        }
                      </div>
                    `
                    : ''
                }

                <div
                  style="
                    font-size:13px;
                    font-weight:700;
                    text-transform:uppercase;
                    letter-spacing:.8px;
                    color:#222222;
                    margin-bottom:10px;
                  "
                >
                  Applicant Information
                </div>

                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  style="
                    border-collapse:collapse;
                  "
                >
                  ${tableRow(
                    'Name',
                    fullName
                  )}

                  ${tableRow(
                    'Email',
                    application.email
                  )}

                  ${tableRow(
                    'Phone',
                    application.phone
                  )}

                  ${tableRow(
                    'Department',
                    application.department ||
                      job?.department
                  )}

                  ${tableRow(
                    'Application Type',
                    formatApplicationType(
                      application.application_type
                    )
                  )}

                  ${tableRow(
                    'Experience Level',
                    formatExperienceLevel(
                      application.experience_level
                    )
                  )}

                  ${tableRow(
                    'Years of Experience',
                    application.years_of_experience
                  )}
                </table>

                ${messageSection}

                <!-- DOCUMENTS -->

                <div
                  style="
                    margin-top:28px;
                    padding-top:25px;
                    border-top:1px solid #e5e5e5;
                  "
                >
                  <div
                    style="
                      font-size:13px;
                      font-weight:700;
                      text-transform:uppercase;
                      letter-spacing:.8px;
                      color:#222222;
                      margin-bottom:13px;
                    "
                  >
                    Applicant Documents
                  </div>

                  ${resumeButton}

                  ${coverLetterButton}
                </div>

                <!-- META -->

                <div
                  style="
                    margin-top:28px;
                    padding:15px;
                    background:#f8f8f8;
                    font-size:11px;
                    line-height:1.7;
                    color:#777777;
                  "
                >
                  ${
                    application
                      .resume_filename
                      ? `
                        <div>
                          <strong>
                            Resume File:
                          </strong>
                          ${escapeHtml(
                            application.resume_filename
                          )}
                        </div>
                      `
                      : ''
                  }

                  ${
                    application
                      .cover_letter_filename
                      ? `
                        <div>
                          <strong>
                            Cover Letter:
                          </strong>
                          ${escapeHtml(
                            application.cover_letter_filename
                          )}
                        </div>
                      `
                      : ''
                  }

                  ${
                    application
                      .source_page
                      ? `
                        <div>
                          <strong>
                            Source Page:
                          </strong>
                          ${escapeHtml(
                            application.source_page
                          )}
                        </div>
                      `
                      : ''
                  }

                  <div>
                    <strong>
                      Application ID:
                    </strong>
                    ${escapeHtml(
                      application.id
                    )}
                  </div>
                </div>

              </div>

              <!-- FOOTER -->

              <div
                style="
                  padding:20px 30px;
                  background:#f5f5f5;
                  border-top:1px solid #e3e3e3;
                  font-size:11px;
                  color:#777777;
                  line-height:1.6;
                  text-align:center;
                "
              >
                This is an automated notification from the
                Ultra Stones Careers website.
                <br />
                Replying to this email will reply directly to
                the applicant.
              </div>

            </div>
          </div>
        </body>
      </html>
    `;

    return {
      subject,
      html,
    };
  };

const sendCareerApplicationNotification =
  async ({
    application,
    job,
  }) => {
    const recipients =
      process.env
        .CAREER_APPLICATION_EMAIL ||
      'Admin@ultrastones.com,Hr@ultrastones.com';

    const {
      subject,
      html,
    } =
      buildCareerApplicationEmail({
        application,
        job,
      });

    const accessToken =
      await getMicrosoftGraphAccessToken();

    return sendMicrosoftGraphEmail({
      accessToken,

      toRecipients:
        recipients,

      subject,

      html,

      replyTo:
        application.email,
    });
  };

// ======================================================
// VALIDATORS
// ======================================================

const validateJobStatus = (
  status
) => {
  if (
    !JOB_STATUSES.includes(
      status
    )
  ) {
    throw new Error(
      'Invalid job status'
    );
  }
};

const validateEmploymentType = (
  employmentType
) => {
  if (
    !EMPLOYMENT_TYPES.includes(
      employmentType
    )
  ) {
    throw new Error(
      'Invalid employment type'
    );
  }
};

const validateWorkMode = (
  workMode
) => {
  if (
    !WORK_MODES.includes(
      workMode
    )
  ) {
    throw new Error(
      'Invalid work mode'
    );
  }
};

const validateApplicationStatus = (
  status
) => {
  if (
    !APPLICATION_STATUSES.includes(
      status
    )
  ) {
    throw new Error(
      'Invalid application status'
    );
  }
};

const validateApplicationType = (
  type
) => {
  if (
    !APPLICATION_TYPES.includes(
      type
    )
  ) {
    throw new Error(
      'Invalid application type'
    );
  }
};

const validateExperienceLevel = (
  level
) => {
  if (
    level &&
    !EXPERIENCE_LEVELS.includes(
      level
    )
  ) {
    throw new Error(
      'Invalid experience level'
    );
  }
};

const validateJobPayload = (
  data,
  {
    partial = false,
  } = {}
) => {
  if (
    !partial ||
    'title' in data
  ) {
    if (
      !data.title?.trim()
    ) {
      throw new Error(
        'Job title is required'
      );
    }
  }

  if (
    !partial ||
    'slug' in data
  ) {
    if (
      !data.slug?.trim()
    ) {
      throw new Error(
        'Job slug is required'
      );
    }
  }

  if (
    data.employment_type
  ) {
    validateEmploymentType(
      data.employment_type
    );
  }

  if (
    data.work_mode
  ) {
    validateWorkMode(
      data.work_mode
    );
  }

  if (
    data.status
  ) {
    validateJobStatus(
      data.status
    );
  }

  if (
    'vacancies' in data
  ) {
    const vacancies =
      Number(
        data.vacancies
      );

    if (
      !Number.isInteger(
        vacancies
      ) ||
      vacancies < 1
    ) {
      throw new Error(
        'Vacancies must be at least 1'
      );
    }
  }
};

const getPagination = (
  page,
  limit,
  maximumLimit = 100
) => {
  const safePage =
    Math.max(
      Number(page) || 1,
      1
    );

  const safeLimit =
    Math.min(
      Math.max(
        Number(limit) || 20,
        1
      ),
      maximumLimit
    );

  return {
    page:
      safePage,

    limit:
      safeLimit,

    skip:
      (safePage - 1) *
      safeLimit,
  };
};

// ======================================================
// JOB DATA HELPERS
// ======================================================

const getJobCreateData = (
  body
) => {
  validateJobPayload(
    body
  );

  const status =
    body.status ||
    'DRAFT';

  return {
    title:
      body.title.trim(),

    slug:
      body.slug.trim(),

    department:
      normalizeText(
        body.department
      ) ||
      null,

    location:
      normalizeText(
        body.location
      ) ||
      null,

    employment_type:
      body.employment_type ||
      'FULL_TIME',

    work_mode:
      body.work_mode ||
      'ONSITE',

    short_description:
      normalizeText(
        body.short_description
      ) ||
      null,

    summary:
      normalizeText(
        body.summary
      ) ||
      null,

    responsibilities:
      parseArray(
        body.responsibilities
      ),

    qualifications:
      parseArray(
        body.qualifications
      ),

    how_to_apply:
      normalizeText(
        body.how_to_apply
      ) ||
      null,

    contact_phone:
      normalizeText(
        body.contact_phone
      ) ||
      null,

    contact_email:
      normalizeText(
        body.contact_email
      ) ||
      null,

    office_hours:
      normalizeText(
        body.office_hours
      ) ||
      null,

    salary_range:
      normalizeText(
        body.salary_range
      ) ||
      null,

    experience_required:
      normalizeText(
        body.experience_required
      ) ||
      null,

    vacancies:
      parsePositiveInteger(
        body.vacancies,
        1
      ),

    education_required:
      normalizeText(
        body.education_required
      ) ||
      null,

    skills_required:
      parseArray(
        body.skills_required
      ),

    benefits:
      parseArray(
        body.benefits
      ),

    status,

    is_featured:
      toBoolean(
        body.is_featured,
        false
      ),

    display_order:
      Number.isInteger(
        Number(
          body.display_order
        )
      )
        ? Number(
            body.display_order
          )
        : 0,

    published_at:
      status ===
      'PUBLISHED'
        ? new Date()
        : null,

    closing_date:
      parseOptionalDate(
        body.closing_date
      ) ||
      null,

    meta_title:
      normalizeText(
        body.meta_title
      ) ||
      null,

    meta_description:
      normalizeText(
        body.meta_description
      ) ||
      null,

    canonical_url:
      normalizeText(
        body.canonical_url
      ) ||
      null,

    robots_index:
      toBoolean(
        body.robots_index,
        true
      ),

    robots_follow:
      toBoolean(
        body.robots_follow,
        true
      ),

    updated_at:
      new Date(),
  };
};

const getJobUpdateData = (
  body,
  existingJob
) => {
  validateJobPayload(
    body,
    {
      partial:
        true,
    }
  );

  const updateData = {
    updated_at:
      new Date(),
  };

  const textFields = [
    'title',
    'slug',
    'department',
    'location',
    'short_description',
    'summary',
    'how_to_apply',
    'contact_phone',
    'contact_email',
    'office_hours',
    'salary_range',
    'experience_required',
    'education_required',
    'meta_title',
    'meta_description',
    'canonical_url',
  ];

  textFields.forEach(
    (field) => {
      if (
        field in body
      ) {
        updateData[field] =
          normalizeText(
            body[field]
          );
      }
    }
  );

  if (
    'employment_type' in
    body
  ) {
    updateData.employment_type =
      body.employment_type;
  }

  if (
    'work_mode' in body
  ) {
    updateData.work_mode =
      body.work_mode;
  }

  if (
    'responsibilities' in
    body
  ) {
    updateData.responsibilities =
      parseArray(
        body.responsibilities
      );
  }

  if (
    'qualifications' in body
  ) {
    updateData.qualifications =
      parseArray(
        body.qualifications
      );
  }

  if (
    'skills_required' in body
  ) {
    updateData.skills_required =
      parseArray(
        body.skills_required
      );
  }

  if (
    'benefits' in body
  ) {
    updateData.benefits =
      parseArray(
        body.benefits
      );
  }

  if (
    'vacancies' in body
  ) {
    updateData.vacancies =
      Number(
        body.vacancies
      );
  }

  if (
    'is_featured' in body
  ) {
    updateData.is_featured =
      toBoolean(
        body.is_featured
      );
  }

  if (
    'display_order' in body
  ) {
    updateData.display_order =
      Number(
        body.display_order
      ) || 0;
  }

  if (
    'closing_date' in body
  ) {
    updateData.closing_date =
      parseOptionalDate(
        body.closing_date
      );
  }

  if (
    'robots_index' in body
  ) {
    updateData.robots_index =
      toBoolean(
        body.robots_index
      );
  }

  if (
    'robots_follow' in body
  ) {
    updateData.robots_follow =
      toBoolean(
        body.robots_follow
      );
  }

  if (
    'status' in body
  ) {
    updateData.status =
      body.status;

    if (
      body.status ===
        'PUBLISHED' &&
      !existingJob.published_at
    ) {
      updateData.published_at =
        new Date();
    }
  }

  return updateData;
};

// ======================================================
// PUBLIC JOB LIST
// ======================================================

const getPublishedJobs =
  async ({
    page = 1,
    limit = 20,
    search,
    department,
    location,
    employmentType,
    workMode,
  } = {}) => {
    const pagination =
      getPagination(
        page,
        limit,
        100
      );

    const where = {
      status:
        'PUBLISHED',

      AND: [
        {
          OR: [
            {
              closing_date:
                null,
            },
            {
              closing_date: {
                gte:
                  new Date(),
              },
            },
          ],
        },
      ],
    };

    if (
      department
    ) {
      where.department = {
        equals:
          department,

        mode:
          'insensitive',
      };
    }

    if (
      location
    ) {
      where.location = {
        contains:
          location,

        mode:
          'insensitive',
      };
    }

    if (
      employmentType
    ) {
      validateEmploymentType(
        employmentType
      );

      where.employment_type =
        employmentType;
    }

    if (
      workMode
    ) {
      validateWorkMode(
        workMode
      );

      where.work_mode =
        workMode;
    }

    if (
      search?.trim()
    ) {
      where.AND.push({
        OR: [
          {
            title: {
              contains:
                search.trim(),

              mode:
                'insensitive',
            },
          },
          {
            department: {
              contains:
                search.trim(),

              mode:
                'insensitive',
            },
          },
          {
            location: {
              contains:
                search.trim(),

              mode:
                'insensitive',
            },
          },
          {
            short_description: {
              contains:
                search.trim(),

              mode:
                'insensitive',
            },
          },
        ],
      });
    }

    const [
      jobs,
      total,
    ] =
      await prisma.$transaction([
        prisma.career_jobs.findMany({
          where,

          skip:
            pagination.skip,

          take:
            pagination.limit,

          orderBy: [
            {
              is_featured:
                'desc',
            },
            {
              display_order:
                'asc',
            },
            {
              published_at:
                'desc',
            },
            {
              created_at:
                'desc',
            },
          ],

          select: {
            id: true,
            title: true,
            slug: true,
            department: true,
            location: true,
            employment_type: true,
            work_mode: true,
            short_description: true,
            salary_range: true,
            experience_required: true,
            vacancies: true,
            is_featured: true,
            published_at: true,
            closing_date: true,
          },
        }),

        prisma.career_jobs.count({
          where,
        }),
      ]);

    return serialize({
      jobs,

      pagination: {
        page:
          pagination.page,

        limit:
          pagination.limit,

        total,

        totalPages:
          Math.ceil(
            total /
              pagination.limit
          ),

        hasNextPage:
          pagination.page *
            pagination.limit <
          total,

        hasPreviousPage:
          pagination.page >
          1,
      },
    });
  };

// ======================================================
// PUBLIC FILTER OPTIONS
// ======================================================

const getPublicJobFilters =
  async () => {
    const jobs =
      await prisma.career_jobs.findMany({
        where: {
          status:
            'PUBLISHED',
        },

        select: {
          department:
            true,
          location:
            true,
          employment_type:
            true,
          work_mode:
            true,
        },
      });

    const uniqueValues = (
      values
    ) =>
      [
        ...new Set(
          values.filter(
            Boolean
          )
        ),
      ].sort(
        (
          a,
          b
        ) =>
          String(
            a
          ).localeCompare(
            String(
              b
            )
          )
      );

    return {
      departments:
        uniqueValues(
          jobs.map(
            (job) =>
              job.department
          )
        ),

      locations:
        uniqueValues(
          jobs.map(
            (job) =>
              job.location
          )
        ),

      employmentTypes:
        uniqueValues(
          jobs.map(
            (job) =>
              job.employment_type
          )
        ),

      workModes:
        uniqueValues(
          jobs.map(
            (job) =>
              job.work_mode
          )
        ),
    };
  };

// ======================================================
// PUBLIC JOB DETAILS
// ======================================================

const getPublishedJobBySlug =
  async (
    slug
  ) => {
    const job =
      await prisma.career_jobs.findFirst({
        where: {
          slug,

          status:
            'PUBLISHED',

          OR: [
            {
              closing_date:
                null,
            },
            {
              closing_date: {
                gte:
                  new Date(),
              },
            },
          ],
        },
      });

    if (
      !job
    ) {
      throw new Error(
        'Job not found'
      );
    }

    return serialize(
      job
    );
  };

// ======================================================
// CMS GET JOBS
// ======================================================

const getJobs =
  async ({
    page = 1,
    limit = 20,
    search,
    status,
    department,
    location,
    employmentType,
    workMode,
  } = {}) => {
    const pagination =
      getPagination(
        page,
        limit,
        100
      );

    const where = {};

    if (
      status
    ) {
      validateJobStatus(
        status
      );

      where.status =
        status;
    }

    if (
      department
    ) {
      where.department = {
        equals:
          department,

        mode:
          'insensitive',
      };
    }

    if (
      location
    ) {
      where.location = {
        contains:
          location,

        mode:
          'insensitive',
      };
    }

    if (
      employmentType
    ) {
      validateEmploymentType(
        employmentType
      );

      where.employment_type =
        employmentType;
    }

    if (
      workMode
    ) {
      validateWorkMode(
        workMode
      );

      where.work_mode =
        workMode;
    }

    if (
      search?.trim()
    ) {
      where.OR = [
        {
          title: {
            contains:
              search.trim(),

            mode:
              'insensitive',
          },
        },
        {
          slug: {
            contains:
              search.trim(),

            mode:
              'insensitive',
          },
        },
        {
          department: {
            contains:
              search.trim(),

            mode:
              'insensitive',
          },
        },
        {
          location: {
            contains:
              search.trim(),

            mode:
              'insensitive',
          },
        },
      ];
    }

    const [
      jobs,
      total,
    ] =
      await prisma.$transaction([
        prisma.career_jobs.findMany({
          where,

          skip:
            pagination.skip,

          take:
            pagination.limit,

          orderBy: [
            {
              display_order:
                'asc',
            },
            {
              created_at:
                'desc',
            },
          ],

          include: {
            _count: {
              select: {
                career_applications:
                  true,
              },
            },
          },
        }),

        prisma.career_jobs.count({
          where,
        }),
      ]);

    return serialize({
      jobs,

      pagination: {
        page:
          pagination.page,

        limit:
          pagination.limit,

        total,

        totalPages:
          Math.ceil(
            total /
              pagination.limit
          ),

        hasNextPage:
          pagination.page *
            pagination.limit <
          total,

        hasPreviousPage:
          pagination.page >
          1,
      },
    });
  };

// ======================================================
// JOB STATS
// ======================================================

const getJobStats =
  async () => {
    const [
      total,
      draft,
      published,
      closed,
      archived,
    ] =
      await Promise.all([
        prisma.career_jobs.count(),

        prisma.career_jobs.count({
          where: {
            status:
              'DRAFT',
          },
        }),

        prisma.career_jobs.count({
          where: {
            status:
              'PUBLISHED',
          },
        }),

        prisma.career_jobs.count({
          where: {
            status:
              'CLOSED',
          },
        }),

        prisma.career_jobs.count({
          where: {
            status:
              'ARCHIVED',
          },
        }),
      ]);

    return {
      total,
      draft,
      published,
      closed,
      archived,
    };
  };

// ======================================================
// GET JOB BY ID
// ======================================================

const getJobById =
  async (
    jobId
  ) => {
    const id =
      parseBigIntId(
        jobId,
        'Invalid job ID'
      );

    const job =
      await prisma.career_jobs.findUnique({
        where: {
          id,
        },

        include: {
          _count: {
            select: {
              career_applications:
                true,
            },
          },
        },
      });

    if (
      !job
    ) {
      throw new Error(
        'Job not found'
      );
    }

    return serialize(
      job
    );
  };

// ======================================================
// CREATE JOB
// ======================================================

const createJob =
  async (
    body,
    audit = {}
  ) => {
    const createData =
      getJobCreateData(
        body
      );

    return auditService.track({
      audit,

      action:
        'CREATE',

      resourceType:
        'CAREER_JOB',

      moduleName:
        'Career Management',

      operation:
        async () => {
          const job =
            await prisma.career_jobs.create({
              data:
                createData,
            });

          return serialize(
            job
          );
        },
    });
  };

// ======================================================
// UPDATE JOB
// ======================================================

const updateJob =
  async (
    jobId,
    body,
    audit = {}
  ) => {
    const id =
      parseBigIntId(
        jobId,
        'Invalid job ID'
      );

    const existingJob =
      await prisma.career_jobs.findUnique({
        where: {
          id,
        },
      });

    if (
      !existingJob
    ) {
      throw new Error(
        'Job not found'
      );
    }

    const updateData =
      getJobUpdateData(
        body,
        existingJob
      );

    return auditService.track({
      audit,

      action:
        'UPDATE',

      resourceType:
        'CAREER_JOB',

      resourceId:
        existingJob.id,

      moduleName:
        'Career Management',

      oldValues:
        serialize(
          existingJob
        ),

      operation:
        async () => {
          const job =
            await prisma.career_jobs.update({
              where: {
                id,
              },

              data:
                updateData,
            });

          return serialize(
            job
          );
        },
    });
  };

// ======================================================
// UPDATE JOB STATUS
// ======================================================

const updateJobStatus =
  async (
    jobId,
    status,
    audit = {}
  ) => {
    validateJobStatus(
      status
    );

    const id =
      parseBigIntId(
        jobId,
        'Invalid job ID'
      );

    const existingJob =
      await prisma.career_jobs.findUnique({
        where: {
          id,
        },
      });

    if (
      !existingJob
    ) {
      throw new Error(
        'Job not found'
      );
    }

    const updateData = {
      status,

      updated_at:
        new Date(),
    };

    if (
      status ===
        'PUBLISHED' &&
      !existingJob.published_at
    ) {
      updateData.published_at =
        new Date();
    }

    return auditService.track({
      audit,

      action:
        'UPDATE',

      resourceType:
        'CAREER_JOB_STATUS',

      resourceId:
        existingJob.id,

      moduleName:
        'Career Management',

      oldValues: {
        status:
          existingJob.status,
      },

      operation:
        async () => {
          const job =
            await prisma.career_jobs.update({
              where: {
                id,
              },

              data:
                updateData,
            });

          return serialize(
            job
          );
        },
    });
  };

// ======================================================
// ARCHIVE JOB
// ======================================================

const archiveJob =
  async (
    jobId,
    audit = {}
  ) =>
    updateJobStatus(
      jobId,
      'ARCHIVED',
      audit
    );

// ======================================================
// SUBMIT APPLICATION
// ======================================================

const submitApplication =
  async ({
    body,
    files,
    requestContext = {},
  }) => {
    const firstName =
      body.first_name?.trim();

    const lastName =
      body.last_name?.trim();

    const email =
      body.email?.trim();

    if (
      !firstName
    ) {
      throw new Error(
        'First name is required'
      );
    }

    if (
      !lastName
    ) {
      throw new Error(
        'Last name is required'
      );
    }

    if (
      !email
    ) {
      throw new Error(
        'Email is required'
      );
    }

    if (
      !validateEmail(
        email
      )
    ) {
      throw new Error(
        'A valid email address is required'
      );
    }

    const resumeFile =
      files?.resume?.[0];

    if (
      !resumeFile
    ) {
      throw new Error(
        'Resume is required'
      );
    }

    const applicationType =
      body.application_type ||
      'JOB_APPLICATION';

    validateApplicationType(
      applicationType
    );

    validateExperienceLevel(
      body.experience_level
    );

    let jobId =
      null;

    let job =
      null;

    if (
      applicationType ===
      'JOB_APPLICATION'
    ) {
      if (
        !body.job_id
      ) {
        throw new Error(
          'Job is required'
        );
      }

      jobId =
        parseBigIntId(
          body.job_id,
          'Invalid job ID'
        );

      job =
        await prisma.career_jobs.findFirst({
          where: {
            id:
              jobId,

            status:
              'PUBLISHED',

            OR: [
              {
                closing_date:
                  null,
              },
              {
                closing_date: {
                  gte:
                    new Date(),
                },
              },
            ],
          },
        });

      if (
        !job
      ) {
        throw new Error(
          'Job is no longer available'
        );
      }
    }

    let uploadedResume =
      null;

    let uploadedCoverLetter =
      null;

    let application =
      null;

    try {
      uploadedResume =
        await uploadToR2(
          resumeFile.path,
          'ultrastones/careers/resumes'
        );

      const coverLetterFile =
        files
          ?.cover_letter?.[0];

      if (
        coverLetterFile
      ) {
        uploadedCoverLetter =
          await uploadToR2(
            coverLetterFile.path,
            'ultrastones/careers/cover-letters'
          );
      }

      application =
        await prisma.career_applications.create({
          data: {
            job_id:
              jobId,

            application_type:
              applicationType,

            first_name:
              firstName,

            last_name:
              lastName,

            email,

            phone:
              normalizeText(
                body.phone
              ) ||
              null,

            department:
              normalizeText(
                body.department
              ) ||
              null,

            message:
              normalizeText(
                body.message
              ) ||
              null,

            experience_level:
              body.experience_level ||
              null,

            years_of_experience:
              body.years_of_experience
                ? Number(
                    body.years_of_experience
                  )
                : null,

            resume_url:
              uploadedResume.secure_url,

            resume_object_key:
              uploadedResume.public_id,

            resume_filename:
              resumeFile.originalname ||
              null,

            resume_mime_type:
              resumeFile.mimetype ||
              null,

            resume_size_bytes:
              resumeFile.size
                ? BigInt(
                    resumeFile.size
                  )
                : null,

            cover_letter_url:
              uploadedCoverLetter
                ?.secure_url ||
              null,

            cover_letter_object_key:
              uploadedCoverLetter
                ?.public_id ||
              null,

            cover_letter_filename:
              coverLetterFile
                ?.originalname ||
              null,

            source_page:
              normalizeText(
                body.source_page
              ) ||
              null,

            ip_address:
              requestContext.ipAddress ||
              null,

            user_agent:
              requestContext.userAgent ||
              null,

            updated_at:
              new Date(),
          },
        });
    } catch (
      error
    ) {
      if (
        uploadedResume
          ?.public_id
      ) {
        await deleteFileFromR2(
          uploadedResume.public_id
        ).catch(
          (
            deleteError
          ) => {
            console.error(
              'Resume cleanup failed:',
              deleteError
            );
          }
        );
      }

      if (
        uploadedCoverLetter
          ?.public_id
      ) {
        await deleteFileFromR2(
          uploadedCoverLetter.public_id
        ).catch(
          (
            deleteError
          ) => {
            console.error(
              'Cover letter cleanup failed:',
              deleteError
            );
          }
        );
      }

      throw error;
    }

    // --------------------------------------------------
    // SEND INTERNAL EMAIL NOTIFICATION
    // --------------------------------------------------
    //
    // This runs AFTER the application has successfully
    // been stored.
    //
    // Email failure must NOT cause the application or
    // uploaded resume to be deleted.
    // --------------------------------------------------

    let notificationSent =
      false;

    try {
      await sendCareerApplicationNotification({
        application:
          serialize(
            application
          ),

        job:
          job
            ? serialize(
                job
              )
            : null,
      });

      notificationSent =
        true;
    } catch (
      emailError
    ) {
      console.error(
        'Career application notification email failed:',
        emailError
      );
    }

    return {
      ...serialize(
        application
      ),

      notification_sent:
        notificationSent,
    };
  };

// ======================================================
// GET APPLICATIONS
// ======================================================

const getApplications =
  async ({
    page = 1,
    limit = 20,
    search,
    status,
    applicationType,
    jobId,
    department,
  } = {}) => {
    const pagination =
      getPagination(
        page,
        limit,
        100
      );

    const where = {};

    if (
      status
    ) {
      validateApplicationStatus(
        status
      );

      where.status =
        status;
    }

    if (
      applicationType
    ) {
      validateApplicationType(
        applicationType
      );

      where.application_type =
        applicationType;
    }

    if (
      jobId
    ) {
      where.job_id =
        parseBigIntId(
          jobId,
          'Invalid job ID'
        );
    }

    if (
      department
    ) {
      where.department = {
        equals:
          department,

        mode:
          'insensitive',
      };
    }

    if (
      search?.trim()
    ) {
      const normalizedSearch =
        search.trim();

      where.OR = [
        {
          first_name: {
            contains:
              normalizedSearch,

            mode:
              'insensitive',
          },
        },
        {
          last_name: {
            contains:
              normalizedSearch,

            mode:
              'insensitive',
          },
        },
        {
          email: {
            contains:
              normalizedSearch,

            mode:
              'insensitive',
          },
        },
        {
          phone: {
            contains:
              normalizedSearch,

            mode:
              'insensitive',
          },
        },
        {
          career_jobs: {
            is: {
              title: {
                contains:
                  normalizedSearch,

                mode:
                  'insensitive',
              },
            },
          },
        },
      ];
    }

    const [
      applications,
      total,
    ] =
      await prisma.$transaction([
        prisma.career_applications.findMany({
          where,

          skip:
            pagination.skip,

          take:
            pagination.limit,

          orderBy: {
            created_at:
              'desc',
          },

          include: {
            career_jobs: {
              select: {
                id:
                  true,
                title:
                  true,
                slug:
                  true,
                department:
                  true,
                location:
                  true,
              },
            },

            users: {
              select: {
                id:
                  true,
                first_name:
                  true,
                last_name:
                  true,
                email:
                  true,
              },
            },
          },
        }),

        prisma.career_applications.count({
          where,
        }),
      ]);

    return serialize({
      applications,

      pagination: {
        page:
          pagination.page,

        limit:
          pagination.limit,

        total,

        totalPages:
          Math.ceil(
            total /
              pagination.limit
          ),

        hasNextPage:
          pagination.page *
            pagination.limit <
          total,

        hasPreviousPage:
          pagination.page >
          1,
      },
    });
  };

// ======================================================
// APPLICATION STATS
// ======================================================

const getApplicationStats =
  async () => {
    const [
      total,
      newCount,
      reviewing,
      shortlisted,
      interview,
      selected,
      rejected,
      withdrawn,
      jobApplications,
      generalResumes,
    ] =
      await Promise.all([
        prisma.career_applications.count(),

        prisma.career_applications.count({
          where: {
            status:
              'NEW',
          },
        }),

        prisma.career_applications.count({
          where: {
            status:
              'REVIEWING',
          },
        }),

        prisma.career_applications.count({
          where: {
            status:
              'SHORTLISTED',
          },
        }),

        prisma.career_applications.count({
          where: {
            status:
              'INTERVIEW',
          },
        }),

        prisma.career_applications.count({
          where: {
            status:
              'SELECTED',
          },
        }),

        prisma.career_applications.count({
          where: {
            status:
              'REJECTED',
          },
        }),

        prisma.career_applications.count({
          where: {
            status:
              'WITHDRAWN',
          },
        }),

        prisma.career_applications.count({
          where: {
            application_type:
              'JOB_APPLICATION',
          },
        }),

        prisma.career_applications.count({
          where: {
            application_type:
              'GENERAL_RESUME',
          },
        }),
      ]);

    return {
      total,

      new:
        newCount,

      reviewing,

      shortlisted,

      interview,

      selected,

      rejected,

      withdrawn,

      jobApplications,

      generalResumes,
    };
  };

// ======================================================
// GET APPLICATION BY ID
// ======================================================

const getApplicationById =
  async (
    applicationId
  ) => {
    const id =
      parseBigIntId(
        applicationId,
        'Invalid application ID'
      );

    const application =
      await prisma.career_applications.findUnique({
        where: {
          id,
        },

        include: {
          career_jobs:
            true,

          users: {
            select: {
              id:
                true,
              first_name:
                true,
              last_name:
                true,
              email:
                true,
            },
          },
        },
      });

    if (
      !application
    ) {
      throw new Error(
        'Application not found'
      );
    }

    return serialize(
      application
    );
  };

// ======================================================
// UPDATE APPLICATION
// ======================================================

const updateApplication =
  async (
    applicationId,
    body,
    reviewerId,
    audit = {}
  ) => {
    const id =
      parseBigIntId(
        applicationId,
        'Invalid application ID'
      );

    const existingApplication =
      await prisma.career_applications.findUnique({
        where: {
          id,
        },
      });

    if (
      !existingApplication
    ) {
      throw new Error(
        'Application not found'
      );
    }

    const updateData = {
      updated_at:
        new Date(),
    };

    const textFields = [
      'first_name',
      'last_name',
      'email',
      'phone',
      'department',
      'message',
      'internal_notes',
    ];

    textFields.forEach(
      (field) => {
        if (
          field in body
        ) {
          updateData[field] =
            normalizeText(
              body[field]
            );
        }
      }
    );

    if (
      'email' in body &&
      body.email &&
      !validateEmail(
        body.email
      )
    ) {
      throw new Error(
        'A valid email address is required'
      );
    }

    if (
      'status' in body
    ) {
      validateApplicationStatus(
        body.status
      );

      updateData.status =
        body.status;
    }

    if (
      'application_type' in
      body
    ) {
      validateApplicationType(
        body.application_type
      );

      updateData.application_type =
        body.application_type;
    }

    if (
      'experience_level' in
      body
    ) {
      validateExperienceLevel(
        body.experience_level
      );

      updateData.experience_level =
        body.experience_level ||
        null;
    }

    if (
      'years_of_experience' in
      body
    ) {
      updateData.years_of_experience =
        body.years_of_experience ===
          '' ||
        body.years_of_experience ===
          null
          ? null
          : Number(
              body.years_of_experience
            );
    }

    if (
      reviewerId
    ) {
      updateData.reviewed_by =
        Number(
          reviewerId
        );

      updateData.reviewed_at =
        new Date();
    }

    return auditService.track({
      audit,

      action:
        'UPDATE',

      resourceType:
        'CAREER_APPLICATION',

      resourceId:
        existingApplication.id,

      moduleName:
        'Career Management',

      oldValues:
        serialize(
          existingApplication
        ),

      operation:
        async () => {
          const application =
            await prisma.career_applications.update({
              where: {
                id,
              },

              data:
                updateData,
            });

          return serialize(
            application
          );
        },
    });
  };

// ======================================================
// UPDATE APPLICATION STATUS
// ======================================================

const updateApplicationStatus =
  async (
    applicationId,
    status,
    reviewerId,
    audit = {}
  ) => {
    validateApplicationStatus(
      status
    );

    return updateApplication(
      applicationId,
      {
        status,
      },
      reviewerId,
      audit
    );
  };

// ======================================================
// UPDATE APPLICATION NOTES
// ======================================================

const updateApplicationNotes =
  async (
    applicationId,
    internalNotes,
    reviewerId,
    audit = {}
  ) =>
    updateApplication(
      applicationId,
      {
        internal_notes:
          internalNotes,
      },
      reviewerId,
      audit
    );

// ======================================================
// DELETE APPLICATION
// ======================================================

const deleteApplication =
  async (
    applicationId,
    audit = {}
  ) => {
    const id =
      parseBigIntId(
        applicationId,
        'Invalid application ID'
      );

    const existingApplication =
      await prisma.career_applications.findUnique({
        where: {
          id,
        },
      });

    if (
      !existingApplication
    ) {
      throw new Error(
        'Application not found'
      );
    }

    return auditService.track({
      audit,

      action:
        'DELETE',

      resourceType:
        'CAREER_APPLICATION',

      resourceId:
        existingApplication.id,

      moduleName:
        'Career Management',

      oldValues:
        serialize(
          existingApplication
        ),

      operation:
        async () => {
          const deletedApplication =
            await prisma.career_applications.delete({
              where: {
                id,
              },
            });

          if (
            existingApplication.resume_object_key
          ) {
            await deleteFileFromR2(
              existingApplication.resume_object_key
            ).catch(
              (
                error
              ) => {
                console.error(
                  'Failed to delete resume from R2:',
                  error
                );
              }
            );
          }

          if (
            existingApplication.cover_letter_object_key
          ) {
            await deleteFileFromR2(
              existingApplication.cover_letter_object_key
            ).catch(
              (
                error
              ) => {
                console.error(
                  'Failed to delete cover letter from R2:',
                  error
                );
              }
            );
          }

          return serialize(
            deletedApplication
          );
        },
    });
  };

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getPublishedJobs,
  getPublicJobFilters,
  getPublishedJobBySlug,

  getJobs,
  getJobStats,
  getJobById,
  createJob,
  updateJob,
  updateJobStatus,
  archiveJob,

  submitApplication,
  getApplications,
  getApplicationStats,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
  updateApplicationNotes,
  deleteApplication,
};