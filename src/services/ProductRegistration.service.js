const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");

const prisma = require("../config/prisma");
const auditService = require("./audit.service");

const {
  uploadToR2,
  deleteFileFromR2,
} = require("../utils/uploadToR2");

/* =========================================================
   CONSTANTS
========================================================= */

const PROJECT_TYPES = [
  "Residential",
  "Commercial",
];

const INSTALLATION_TYPES = [
  "Kitchen Countertop",
  "Bathroom Vanity",
  "Wall Cladding",
  "Flooring",
  "Other",
];

const ALLOWED_INVOICE_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
];

const ALLOWED_IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];

const MAX_INVOICE_SIZE = 15 * 1024 * 1024;

const MAX_PHOTO_SIZE = 10 * 1024 * 1024;

const MAX_PHOTOS = 10;

/* =========================================================
   GENERAL HELPERS
========================================================= */

const createError = (
  message,
  statusCode = 400
) => {
  const error = new Error(message);

  error.statusCode = statusCode;

  return error;
};

const serialize = (data) =>
  JSON.parse(
    JSON.stringify(
      data,
      (_, value) =>
        typeof value === "bigint"
          ? value.toString()
          : value
    )
  );

const normalizeText = (value) => {
  if (
    value === undefined ||
    value === null
  ) {
    return null;
  }

  return String(value).trim() || null;
};

const requiredText = (
  value,
  label
) => {
  const text = normalizeText(value);

  if (!text) {
    throw createError(
      `${label} is required`
    );
  }

  return text;
};

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );

const parseBoolean = (
  value,
  label
) => {
  if (
    value === true ||
    value === "true"
  ) {
    return true;
  }

  if (
    value === false ||
    value === "false"
  ) {
    return false;
  }

  throw createError(
    `${label} must be true or false`
  );
};

const parseDate = (
  value,
  label,
  required = false
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    if (required) {
      throw createError(
        `${label} is required`
      );
    }

    return null;
  }

  const text = String(value);

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(text)
  ) {
    throw createError(
      `${label} must use YYYY-MM-DD format`
    );
  }

  const date = new Date(
    `${text}T00:00:00.000Z`
  );

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !==
      text
  ) {
    throw createError(
      `Invalid ${label}`
    );
  }

  return date;
};

const getTodayUTC = () => {
  const now = new Date();

  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    )
  );
};

const validatePurchaseDate = (
  date
) => {
  if (date > getTodayUTC()) {
    throw createError(
      "Purchase date cannot be in the future"
    );
  }

  return date;
};

const validateInstallationDate = (
  installationDate,
  purchaseDate
) => {
  if (
    installationDate > getTodayUTC()
  ) {
    throw createError(
      "Installation date cannot be in the future"
    );
  }

  if (
    installationDate < purchaseDate
  ) {
    throw createError(
      "Installation date cannot be earlier than the purchase date"
    );
  }

  return installationDate;
};

const validateTentativeDate = (
  date
) => {
  if (date < getTodayUTC()) {
    throw createError(
      "Tentative installation date cannot be in the past"
    );
  }

  return date;
};

const validateOption = (
  value,
  options,
  label
) => {
  if (!options.includes(value)) {
    throw createError(
      `Invalid ${label}`
    );
  }

  return value;
};

const getPagination = (
  page,
  limit
) => {
  const safePage = Math.max(
    Math.floor(Number(page) || 1),
    1
  );

  const safeLimit = Math.min(
    Math.max(
      Math.floor(Number(limit) || 20),
      1
    ),
    100
  );

  return {
    page: safePage,

    limit: safeLimit,

    skip:
      (safePage - 1) * safeLimit,
  };
};

const validateRegistrationId = (
  id
) => {
  const value = String(
    id || ""
  );

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value
    )
  ) {
    throw createError(
      "Invalid registration ID"
    );
  }

  return value;
};

const validateFile = (
  file,
  extensions,
  maxSize,
  label
) => {
  if (!file) {
    throw createError(
      `${label} is required`
    );
  }

  const extension = path
    .extname(
      file.originalname || ""
    )
    .toLowerCase();

  if (
    !extensions.includes(
      extension
    )
  ) {
    throw createError(
      `Invalid ${label} file type`
    );
  }

  if (
    file.size > maxSize
  ) {
    throw createError(
      `${label} exceeds the allowed file size`
    );
  }
};

/* =========================================================
   FILE CLEANUP
========================================================= */

const cleanupLocalFiles = async (
  files
) => {
  const allFiles = Object.values(
    files || {}
  ).flat();

  await Promise.allSettled(
    allFiles
      .filter(
        (file) => file?.path
      )
      .map(
        (file) =>
          fs.unlink(file.path)
      )
  );
};

const cleanupR2Files = async (
  keys
) => {
  await Promise.allSettled(
    keys
      .filter(Boolean)
      .map(async (key) => {
        try {
          await deleteFileFromR2(
            key
          );
        } catch (error) {
          console.error(
            "R2 cleanup failed:",
            key,
            error
          );
        }
      })
  );
};

/* =========================================================
   EMAIL HELPERS
========================================================= */

const escapeHtml = (
  value = ""
) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const parseEmailList = (
  value = ""
) =>
  String(value || "")
    .split(",")
    .map(
      (email) =>
        email.trim()
    )
    .filter(Boolean)
    .map((email) => ({
      emailAddress: {
        address: email,
      },
    }));

const formatDate = (
  value
) => {
  if (!value) {
    return "-";
  }

  const date = new Date(
    value
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return date
    .toISOString()
    .slice(0, 10);
};

/* =========================================================
   EMAIL LOGO
========================================================= */

const getLogoAttachment = () => {
  const logoPath = path.join(
    __dirname,
    "../assets/ultrastones.png"
  );

  if (
    !fsSync.existsSync(
      logoPath
    )
  ) {
    console.warn(
      "Product registration email logo not found:",
      logoPath
    );

    return null;
  }

  return {
    "@odata.type":
      "#microsoft.graph.fileAttachment",

    name:
      "ultrastones.png",

    contentType:
      "image/png",

    contentBytes:
      fsSync
        .readFileSync(
          logoPath
        )
        .toString(
          "base64"
        ),

    isInline: true,

    contentId:
      "ultrastones-logo",
  };
};

const getEmailAttachments = () => {
  const logo =
    getLogoAttachment();

  return logo
    ? [logo]
    : [];
};

const getEmailLogo = () => {
  const logoPath = path.join(
    __dirname,
    "../assets/ultrastones.png"
  );

  if (
    !fsSync.existsSync(
      logoPath
    )
  ) {
    return `
      <div
        style="
          font-size:22px;
          font-weight:700;
          letter-spacing:1px;
          color:#ffffff;
          margin-bottom:20px;
        "
      >
        ULTRA STONES
      </div>
    `;
  }

  return `
    <img
      src="cid:ultrastones-logo"
      alt="Ultra Stones"
      width="170"
      style="
        display:block;
        width:170px;
        max-width:170px;
        height:auto;
        border:0;
        margin-bottom:20px;
      "
    />
  `;
};

/* =========================================================
   EMAIL TABLE COMPONENTS
========================================================= */

const tableRow = (
  label,
  value
) => `
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
        line-height:1.5;
        vertical-align:top;
        word-break:break-word;
      "
    >
      ${escapeHtml(
        value ?? "-"
      )}
    </td>
  </tr>
`;

const sectionHeading = (
  title
) => `
  <div
    style="
      font-size:12px;
      font-weight:700;
      text-transform:uppercase;
      letter-spacing:1.2px;
      margin-bottom:12px;
      margin-top:30px;
    "
  >
    ${escapeHtml(title)}
  </div>
`;

const emailTable = (
  rows
) => `
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
      border-collapse:collapse;
      margin-bottom:25px;
    "
  >
    ${rows}
  </table>
`;

const emailButton = (
  label,
  url
) => {
  if (!url) {
    return "";
  }

  return `
    <a
      href="${escapeHtml(url)}"
      target="_blank"
      rel="noopener noreferrer"
      style="
        display:inline-block;
        background:#161412;
        color:#ffffff;
        text-decoration:none;
        padding:13px 22px;
        font-size:11px;
        font-weight:700;
        text-transform:uppercase;
        letter-spacing:1px;
        margin:8px 8px 8px 0;
      "
    >
      ${escapeHtml(label)}
    </a>
  `;
};

/* =========================================================
   EMAIL LAYOUT
========================================================= */

const emailLayout = ({
  title,
  content,
  footer,
}) => `
  <!doctype html>

  <html>
    <body
      style="
        margin:0;
        padding:0;
        background:#f4f4f4;
        font-family:Arial, Helvetica, sans-serif;
        color:#161412;
      "
    >
      <div
        style="
          width:100%;
          padding:30px 15px;
          box-sizing:border-box;
        "
      >
        <div
          style="
            max-width:700px;
            margin:0 auto;
            background:#ffffff;
            border:1px solid #e4e4e4;
          "
        >
          <div
            style="
              background:#161412;
              color:#ffffff;
              padding:30px 32px;
            "
          >
            ${getEmailLogo()}

            <div
              style="
                font-size:27px;
                line-height:1.25;
                font-weight:700;
              "
            >
              ${escapeHtml(title)}
            </div>
          </div>

          <div
            style="
              padding:34px 32px;
            "
          >
            ${content}

            <div
              style="
                border-top:1px solid #eeeeee;
                padding-top:20px;
                margin-top:30px;
                color:#999999;
                font-size:11px;
                line-height:1.6;
              "
            >
              ${escapeHtml(footer)}
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
`;

/* =========================================================
   MICROSOFT GRAPH CONFIG
========================================================= */

const getGraphConfig = () => {
  const tenantId =
    process.env.MS_TENANT_ID;

  const clientId =
    process.env.MS_CLIENT_ID;

  const clientSecret =
    process.env.MS_CLIENT_SECRET;

  const senderEmail =
    process.env.MS_SENDER_EMAIL;

  if (
    !tenantId ||
    !clientId ||
    !clientSecret ||
    !senderEmail
  ) {
    throw new Error(
      "Microsoft Graph email configuration is incomplete."
    );
  }

  return {
    tenantId,
    clientId,
    clientSecret,
    senderEmail,
  };
};

/* =========================================================
   MICROSOFT GRAPH ACCESS TOKEN
========================================================= */

const getAccessToken = async () => {
  const {
    tenantId,
    clientId,
    clientSecret,
  } = getGraphConfig();

  const tokenUrl =
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const body =
    new URLSearchParams();

  body.append(
    "client_id",
    clientId
  );

  body.append(
    "client_secret",
    clientSecret
  );

  body.append(
    "scope",
    "https://graph.microsoft.com/.default"
  );

  body.append(
    "grant_type",
    "client_credentials"
  );

  const response =
    await fetch(
      tokenUrl,
      {
        method:
          "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body:
          body.toString(),
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    console.error(
      "MICROSOFT TOKEN ERROR:",
      data
    );

    throw new Error(
      data.error_description ||
        "Failed to get Microsoft access token."
    );
  }

  if (
    !data.access_token
  ) {
    throw new Error(
      "Microsoft Graph did not return an access token."
    );
  }

  return data.access_token;
};

/* =========================================================
   SEND MICROSOFT GRAPH EMAIL
========================================================= */

const sendGraphEmail = async ({
  accessToken,
  senderEmail,
  message,
}) => {
  const sendUrl =
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(
      senderEmail
    )}/sendMail`;

  const response =
    await fetch(
      sendUrl,
      {
        method:
          "POST",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            message,

            saveToSentItems:
              true,
          }),
      }
    );

  if (!response.ok) {
    let errorData;

    try {
      errorData =
        await response.json();
    } catch {
      errorData = {
        message:
          "Unknown Microsoft Graph error.",
      };
    }

    console.error(
      "MICROSOFT GRAPH SEND ERROR:",
      errorData
    );

    throw new Error(
      errorData
        ?.error
        ?.message ||
        errorData
          ?.message ||
        `Microsoft Graph mail failed with status ${response.status}`
    );
  }

  return {
    success: true,

    status:
      response.status,
  };
};

/* =========================================================
   INTERNAL REGISTRATION EMAIL TEMPLATE
========================================================= */

const buildInternalEmail = (
  registration
) => {
  const installed =
    registration.is_installed;

  const installationPhotos =
    Array.isArray(
      registration.installation_photos
    )
      ? registration.installation_photos
      : [];

  const content = `
    <div
      style="
        font-size:15px;
        line-height:1.8;
        color:#444444;
        margin-bottom:25px;
      "
    >
      A new product registration has been submitted
      through the Ultra Stones website.
    </div>

    <div
      style="
        background:#f7f7f7;
        border-left:3px solid #c91f26;
        padding:20px;
        margin-bottom:28px;
      "
    >
      <div
        style="
          font-size:11px;
          font-weight:700;
          text-transform:uppercase;
          letter-spacing:1px;
          color:#777777;
          margin-bottom:8px;
        "
      >
        Registration Number
      </div>

      <div
        style="
          font-size:26px;
          font-weight:700;
          color:#161412;
        "
      >
        ${escapeHtml(
          registration.registration_number
        )}
      </div>
    </div>

    ${sectionHeading(
      "Product Information"
    )}

    ${emailTable(`
      ${tableRow(
        "Product",
        registration.product_name
      )}

      ${tableRow(
        "Category",
        registration.product_category
      )}

      ${tableRow(
        "Invoice / Order No.",
        registration.invoice_order_number
      )}

      ${tableRow(
        "Purchase Date",
        formatDate(
          registration.purchase_date
        )
      )}
    `)}

    ${sectionHeading(
      "Customer Information"
    )}

    ${emailTable(`
      ${tableRow(
        "Full Name",
        registration.full_name
      )}

      ${tableRow(
        "Email",
        registration.email
      )}

      ${tableRow(
        "Phone",
        registration.phone
      )}
    `)}

    ${sectionHeading(
      "Project Information"
    )}

    ${emailTable(`
      ${tableRow(
        "Project Type",
        registration.project_type
      )}

      ${tableRow(
        "Installation Type",
        registration.installation_type ===
          "Other"
          ? registration.installation_type_other
          : registration.installation_type
      )}

      ${tableRow(
        "Installed",
        installed
          ? "Yes"
          : "No"
      )}

      ${
        installed
          ? `
            ${tableRow(
              "Installation Date",
              formatDate(
                registration.installation_date
              )
            )}

            ${tableRow(
              "Installation Address",
              registration.installation_address
            )}

            ${tableRow(
              "Fabricator / Installer",
              registration.fabricator_installer_name
            )}

            ${tableRow(
              "Installer Contact",
              registration.fabricator_installer_contact
            )}

            ${tableRow(
              "Installation Photos",
              `${installationPhotos.length} uploaded`
            )}
          `
          : `
            ${tableRow(
              "Tentative Installation",
              formatDate(
                registration.tentative_installation_date
              )
            )}
          `
      }
    `)}

    ${sectionHeading(
      "Uploaded Documents"
    )}

    <div
      style="
        margin-bottom:25px;
      "
    >
      ${emailButton(
        "View Purchase Invoice",
        registration.purchase_invoice
      )}

      ${
        installed
          ? installationPhotos
              .map(
                (photo, index) =>
                  emailButton(
                    `Installation Photo ${
                      index + 1
                    }`,
                    photo.url
                  )
              )
              .join("")
          : ""
      }
    </div>

    <div
      style="
        margin-top:25px;
      "
    >
      ${emailButton(
        "Reply to Customer",
        `mailto:${registration.email}`
      )}
    </div>
  `;

  return emailLayout({
    title:
      "New Product Registration",

    content,

    footer:
      "Submitted through the Ultra Stones website.",
  });
};

/* =========================================================
   CUSTOMER REGISTRATION EMAIL TEMPLATE
========================================================= */

const buildCustomerEmail = (
  registration
) => {
  const firstName =
    registration.full_name
      ?.trim()
      .split(/\s+/)[0] ||
    "Customer";

  const content = `
    <div
      style="
        font-size:16px;
        line-height:1.7;
        margin-bottom:20px;
      "
    >
      Hi ${escapeHtml(
        firstName
      )},
    </div>

    <div
      style="
        font-size:15px;
        line-height:1.8;
        color:#444444;
        margin-bottom:25px;
      "
    >
      Thank you for registering your Ultra Stones
      product.

      We have successfully received your registration.
      Our team will contact you if any additional
      information is required.
    </div>

    <div
      style="
        background:#f7f7f7;
        border-left:3px solid #c91f26;
        padding:20px;
        margin-bottom:28px;
      "
    >
      <div
        style="
          font-size:11px;
          font-weight:700;
          text-transform:uppercase;
          letter-spacing:1px;
          color:#777777;
          margin-bottom:8px;
        "
      >
        Your Registration Number
      </div>

      <div
        style="
          font-size:26px;
          font-weight:700;
          color:#161412;
        "
      >
        ${escapeHtml(
          registration.registration_number
        )}
      </div>
    </div>

    ${sectionHeading(
      "Registration Summary"
    )}

    ${emailTable(`
      ${tableRow(
        "Product",
        registration.product_name
      )}

      ${tableRow(
        "Category",
        registration.product_category
      )}

      ${tableRow(
        "Invoice / Order No.",
        registration.invoice_order_number
      )}

      ${tableRow(
        "Purchase Date",
        formatDate(
          registration.purchase_date
        )
      )}

      ${tableRow(
        "Project Type",
        registration.project_type
      )}

      ${tableRow(
        "Installation Type",
        registration.installation_type ===
          "Other"
          ? registration.installation_type_other
          : registration.installation_type
      )}

      ${tableRow(
        "Installation Status",
        registration.is_installed
          ? "Installed"
          : "Not Installed"
      )}
    `)}

    <div
      style="
        font-size:15px;
        line-height:1.8;
        color:#444444;
        margin-top:25px;
      "
    >
      Please keep your registration number
      for future reference.
    </div>

    <div
      style="
        font-size:15px;
        line-height:1.8;
        color:#444444;
        margin-top:20px;
      "
    >
      We appreciate your trust in Ultra Stones.
    </div>

    <div
      style="
        font-size:14px;
        line-height:1.7;
        margin-top:30px;
      "
    >
      Best regards,
      <br />

      <strong>
        Ultra Stones
      </strong>
    </div>
  `;

  return emailLayout({
    title:
      "Product Registration Received",

    content,

    footer:
      "This confirmation was sent because a product registration was submitted through the Ultra Stones website.",
  });
};

/* =========================================================
   SEND REGISTRATION EMAILS
========================================================= */

const sendRegistrationEmails = async (
  registration
) => {
  const {
    senderEmail,
  } = getGraphConfig();

  const toRecipients =
    parseEmailList(
      process.env
        .PRODUCT_REGISTRATION_EMAIL
    );

  const ccRecipients =
    parseEmailList(
      process.env
        .PRODUCT_REGISTRATION_CC
    );

  const accessToken =
    await getAccessToken();

  const results = {
    internalSent: false,

    customerSent: false,
  };

  /* =====================================================
     INTERNAL NOTIFICATION
  ===================================================== */

  if (
    toRecipients.length > 0
  ) {
    try {
      const internalMessage = {
        subject:
          `New Product Registration - ${registration.registration_number} - ${registration.product_name}`,

        body: {
          contentType:
            "HTML",

          content:
            buildInternalEmail(
              registration
            ),
        },

        attachments:
          getEmailAttachments(),

        toRecipients,

        ...(ccRecipients.length > 0
          ? {
              ccRecipients,
            }
          : {}),

        replyTo: [
          {
            emailAddress: {
              address:
                registration.email,
            },
          },
        ],
      };

      await sendGraphEmail({
        accessToken,

        senderEmail,

        message:
          internalMessage,
      });

      results.internalSent =
        true;

      console.log(
        "Product registration internal email sent:",
        registration.registration_number
      );
    } catch (error) {
      console.error(
        "PRODUCT REGISTRATION INTERNAL EMAIL FAILED:",
        error.message
      );
    }
  } else {
    console.warn(
      "PRODUCT_REGISTRATION_EMAIL is not configured. Internal notification skipped."
    );
  }

  /* =====================================================
     CUSTOMER CONFIRMATION
  ===================================================== */

  try {
    const customerMessage = {
      subject:
        `Your Ultra Stones Product Registration - ${registration.registration_number}`,

      body: {
        contentType:
          "HTML",

        content:
          buildCustomerEmail(
            registration
          ),
      },

      attachments:
        getEmailAttachments(),

      toRecipients: [
        {
          emailAddress: {
            address:
              registration.email,
          },
        },
      ],
    };

    await sendGraphEmail({
      accessToken,

      senderEmail,

      message:
        customerMessage,
    });

    results.customerSent =
      true;

    console.log(
      "Product registration customer email sent:",
      registration.email
    );
  } catch (error) {
    console.error(
      "PRODUCT REGISTRATION CUSTOMER EMAIL FAILED:",
      error.message
    );
  }

  return results;
};

/* =========================================================
   VALIDATE REGISTRATION PAYLOAD
========================================================= */

const validateRegistrationPayload = (
  body,
  files
) => {
  /* CUSTOMER INFORMATION */

  const fullName =
    requiredText(
      body.full_name,
      "Full name"
    );

  const email =
    requiredText(
      body.email,
      "Email"
    ).toLowerCase();

  const phone =
    requiredText(
      body.phone,
      "Phone"
    );

  if (
    !validateEmail(
      email
    )
  ) {
    throw createError(
      "A valid email address is required"
    );
  }

  /* PRODUCT INFORMATION */

  const productCategory =
    requiredText(
      body.product_category,
      "Product category"
    );

  const productName =
    requiredText(
      body.product_name,
      "Product name"
    );

  const invoiceOrderNumber =
    requiredText(
      body.invoice_order_number,
      "Invoice/order number"
    );

  const purchaseDate =
    validatePurchaseDate(
      parseDate(
        body.purchase_date,
        "Purchase date",
        true
      )
    );

  /* PROJECT INFORMATION */

  const projectType =
    validateOption(
      requiredText(
        body.project_type,
        "Project type"
      ),
      PROJECT_TYPES,
      "project type"
    );

  const installationType =
    validateOption(
      requiredText(
        body.installation_type,
        "Installation type"
      ),
      INSTALLATION_TYPES,
      "installation type"
    );

  const installationTypeOther =
    installationType === "Other"
      ? requiredText(
          body.installation_type_other,
          "Other installation type"
        )
      : null;

  /* INSTALLATION INFORMATION */

  const isInstalled =
    parseBoolean(
      body.is_installed,
      "Installation status"
    );

  /* DECLARATION */

  const declarationAccepted =
    parseBoolean(
      body.declaration_accepted,
      "Declaration accepted"
    );

  if (
    !declarationAccepted
  ) {
    throw createError(
      "You must accept the declaration"
    );
  }

  /* PURCHASE INVOICE */

  const invoiceFile =
    files?.purchase_invoice?.[0];

  validateFile(
    invoiceFile,
    ALLOWED_INVOICE_EXTENSIONS,
    MAX_INVOICE_SIZE,
    "Purchase invoice"
  );

  /* INSTALLATION PHOTOS */

  const installationFiles =
    files?.installation_photos ||
    [];

  if (
    installationFiles.length >
    MAX_PHOTOS
  ) {
    throw createError(
      `Maximum ${MAX_PHOTOS} installation photos are allowed`
    );
  }

  let installationDate =
    null;

  let installationAddress =
    null;

  let tentativeInstallationDate =
    null;

  if (
    isInstalled
  ) {
    installationDate =
      validateInstallationDate(
        parseDate(
          body.installation_date,
          "Installation date",
          true
        ),
        purchaseDate
      );

    installationAddress =
      requiredText(
        body.installation_address,
        "Installation address"
      );

    if (
      installationFiles.length ===
      0
    ) {
      throw createError(
        "At least one installation photo is required"
      );
    }
  } else {
    tentativeInstallationDate =
      validateTentativeDate(
        parseDate(
          body.tentative_installation_date,
          "Tentative installation date",
          true
        )
      );

    if (
      installationFiles.length >
      0
    ) {
      throw createError(
        "Installation photos are only allowed for installed products"
      );
    }
  }

  for (
    const file of installationFiles
  ) {
    validateFile(
      file,
      ALLOWED_IMAGE_EXTENSIONS,
      MAX_PHOTO_SIZE,
      "Installation photo"
    );
  }

  return {
    full_name:
      fullName,

    email,

    phone,

    product_category:
      productCategory,

    product_name:
      productName,

    invoice_order_number:
      invoiceOrderNumber,

    purchase_date:
      purchaseDate,

    project_type:
      projectType,

    installation_type:
      installationType,

    installation_type_other:
      installationTypeOther,

    is_installed:
      isInstalled,

    installation_date:
      installationDate,

    installation_address:
      installationAddress,

    fabricator_installer_name:
      isInstalled
        ? normalizeText(
            body.fabricator_installer_name
          )
        : null,

    fabricator_installer_contact:
      isInstalled
        ? normalizeText(
            body.fabricator_installer_contact
          )
        : null,

    tentative_installation_date:
      tentativeInstallationDate,

    declaration_accepted:
      true,
  };
};

/* =========================================================
   PUBLIC SUBMIT REGISTRATION
========================================================= */

const submitRegistration = async ({
  body,
  files,
}) => {
  const uploadedKeys = [];

  let registrationSaved =
    false;

  try {
    const registrationData =
      validateRegistrationPayload(
        body,
        files
      );

    const invoiceFile =
      files.purchase_invoice[0];

    /* UPLOAD PURCHASE INVOICE */

    const uploadedInvoice =
      await uploadToR2(
        invoiceFile.path,
        "ultrastones/product-registrations/invoices"
      );

    uploadedKeys.push(
      uploadedInvoice.public_id
    );

    /* UPLOAD INSTALLATION PHOTOS */

    const uploadedPhotos =
      [];

    for (
      const file of
      files.installation_photos ||
      []
    ) {
      const uploadedPhoto =
        await uploadToR2(
          file.path,
          "ultrastones/product-registrations/installation-photos"
        );

      uploadedKeys.push(
        uploadedPhoto.public_id
      );

      uploadedPhotos.push({
        url:
          uploadedPhoto.secure_url,

        object_key:
          uploadedPhoto.public_id,

        filename:
          file.originalname,
      });
    }

    /* SAVE REGISTRATION */

    const registration =
      await prisma.product_registrations.create({
        data: {
          ...registrationData,

          purchase_invoice:
            uploadedInvoice.secure_url,

          purchase_invoice_object_key:
            uploadedInvoice.public_id,

          installation_photos:
            uploadedPhotos,
        },
      });

    registrationSaved =
      true;

    /* SEND EMAIL NOTIFICATIONS */

    try {
      await sendRegistrationEmails(
        registration
      );
    } catch (error) {
      console.error(
        "PRODUCT REGISTRATION EMAIL PROCESS FAILED:",
        error.message
      );
    }

    /* PUBLIC RESPONSE */

    return {
      id:
        registration.id,

      registration_number:
        registration.registration_number,

      created_at:
        registration.created_at,
    };
  } catch (error) {
    if (
      !registrationSaved
    ) {
      await cleanupR2Files(
        uploadedKeys
      );
    }

    throw error;
  } finally {
    await cleanupLocalFiles(
      files
    );
  }
};

/* =========================================================
   CMS GET REGISTRATIONS
========================================================= */

const getRegistrations = async ({
  page = 1,
  limit = 20,
  search,
  productCategory,
  projectType,
  isInstalled,
} = {}) => {
  const pagination =
    getPagination(
      page,
      limit
    );

  const where = {};

  /* PRODUCT CATEGORY */

  if (
    productCategory
  ) {
    where.product_category =
      requiredText(
        productCategory,
        "Product category"
      );
  }

  /* PROJECT TYPE */

  if (
    projectType
  ) {
    where.project_type =
      validateOption(
        projectType,
        PROJECT_TYPES,
        "project type"
      );
  }

  /* INSTALLATION STATUS */

  if (
    isInstalled !== undefined &&
    isInstalled !== null &&
    isInstalled !== ""
  ) {
    where.is_installed =
      parseBoolean(
        isInstalled,
        "Installation status"
      );
  }

  /* SEARCH */

  if (
    search?.trim()
  ) {
    const value =
      search.trim();

    where.OR = [
      {
        registration_number: {
          contains:
            value,

          mode:
            "insensitive",
        },
      },
      {
        full_name: {
          contains:
            value,

          mode:
            "insensitive",
        },
      },
      {
        email: {
          contains:
            value,

          mode:
            "insensitive",
        },
      },
      {
        phone: {
          contains:
            value,

          mode:
            "insensitive",
        },
      },
      {
        product_name: {
          contains:
            value,

          mode:
            "insensitive",
        },
      },
      {
        invoice_order_number: {
          contains:
            value,

          mode:
            "insensitive",
        },
      },
    ];
  }

  /* DATABASE QUERY */

  const [
    registrations,
    total,
  ] =
    await prisma.$transaction([
      prisma.product_registrations.findMany({
        where,

        skip:
          pagination.skip,

        take:
          pagination.limit,

        orderBy: {
          created_at:
            "desc",
        },
      }),

      prisma.product_registrations.count({
        where,
      }),
    ]);

  return serialize({
    registrations,

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

/* =========================================================
   CMS REGISTRATION STATISTICS
========================================================= */

const getRegistrationStats =
  async () => {
    const [
      total,
      installed,
      notInstalled,
    ] =
      await Promise.all([
        prisma.product_registrations.count(),

        prisma.product_registrations.count({
          where: {
            is_installed:
              true,
          },
        }),

        prisma.product_registrations.count({
          where: {
            is_installed:
              false,
          },
        }),
      ]);

    return {
      total,

      installed,

      notInstalled,
    };
  };

/* =========================================================
   CMS GET REGISTRATION BY ID
========================================================= */

const getRegistrationById =
  async (
    registrationId
  ) => {
    const id =
      validateRegistrationId(
        registrationId
      );

    const registration =
      await prisma.product_registrations.findUnique({
        where: {
          id,
        },
      });

    if (
      !registration
    ) {
      throw createError(
        "Registration not found",
        404
      );
    }

    return serialize(
      registration
    );
  };

/* =========================================================
   CMS UPDATE REGISTRATION
========================================================= */

const updateRegistration = async (
  registrationId,
  body,
  audit = {}
) => {
  const id =
    validateRegistrationId(
      registrationId
    );

  const existingRegistration =
    await prisma.product_registrations.findUnique({
      where: {
        id,
      },
    });

  if (
    !existingRegistration
  ) {
    throw createError(
      "Registration not found",
      404
    );
  }

  const updateData = {};

  /* TEXT FIELDS */

  const textFields = [
    "full_name",
    "email",
    "phone",
    "product_name",
    "invoice_order_number",
    "installation_address",
    "fabricator_installer_name",
    "fabricator_installer_contact",
    "installation_type_other",
  ];

  for (
    const field of textFields
  ) {
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        field
      )
    ) {
      updateData[field] =
        normalizeText(
          body[field]
        );
    }
  }

  /* REQUIRED FIELDS */

  const requiredFields = [
    "full_name",
    "email",
    "phone",
    "product_name",
    "invoice_order_number",
  ];

  for (
    const field of requiredFields
  ) {
    if (
      field in updateData &&
      !updateData[field]
    ) {
      throw createError(
        `${field} cannot be empty`
      );
    }
  }

  /* EMAIL VALIDATION */

  if (
    "email" in updateData
  ) {
    updateData.email =
      updateData.email.toLowerCase();

    if (
      !validateEmail(
        updateData.email
      )
    ) {
      throw createError(
        "A valid email address is required"
      );
    }
  }

  /* ENUM FIELDS */

  const enumFields = {
    project_type:
      PROJECT_TYPES,

    installation_type:
      INSTALLATION_TYPES,
  };

  for (
    const [
      field,
      options,
    ] of Object.entries(
      enumFields
    )
  ) {
    if (
      field in body
    ) {
      updateData[field] =
        validateOption(
          body[field],
          options,
          field
        );
    }
  }

  /* PRODUCT CATEGORY */

  if (
    "product_category" in body
  ) {
    updateData.product_category =
      requiredText(
        body.product_category,
        "Product category"
      );
  }

  /* DATE FIELDS */

  const dateFields = [
    "purchase_date",
    "installation_date",
    "tentative_installation_date",
  ];

  for (
    const field of dateFields
  ) {
    if (
      field in body
    ) {
      updateData[field] =
        parseDate(
          body[field],
          field,
          field ===
            "purchase_date"
        );
    }
  }

  /* INSTALLATION STATUS */

  if (
    "is_installed" in body
  ) {
    updateData.is_installed =
      parseBoolean(
        body.is_installed,
        "Installation status"
      );
  }

  /* FINAL VALIDATION */

  const finalData = {
    ...existingRegistration,
    ...updateData,
  };

  if (
    finalData.installation_type ===
      "Other" &&
    !finalData.installation_type_other
  ) {
    throw createError(
      "Other installation type is required"
    );
  }

  validatePurchaseDate(
    finalData.purchase_date
  );

  if (
    finalData.is_installed
  ) {
    if (
      !finalData.installation_date ||
      !finalData.installation_address ||
      !Array.isArray(
        finalData.installation_photos
      ) ||
      finalData.installation_photos
        .length === 0
    ) {
      throw createError(
        "Installed products require installation date, address and photos"
      );
    }

    validateInstallationDate(
      finalData.installation_date,
      finalData.purchase_date
    );
  } else {
    if (
      !finalData.tentative_installation_date
    ) {
      throw createError(
        "Tentative installation date is required"
      );
    }

    validateTentativeDate(
      finalData.tentative_installation_date
    );
  }

  if (
    Object.keys(
      updateData
    ).length === 0
  ) {
    throw createError(
      "No valid fields provided for update"
    );
  }

  /* AUDIT TRACKING */

  return auditService.track({
    audit,

    action:
      "UPDATE",

    resourceType:
      "PRODUCT_REGISTRATION",

    resourceId:
      existingRegistration.id,

    moduleName:
      "Product Registration",

    oldValues:
      serialize(
        existingRegistration
      ),

    operation:
      async () => {
        const registration =
          await prisma.product_registrations.update({
            where: {
              id,
            },

            data:
              updateData,
          });

        return serialize(
          registration
        );
      },
  });
};

/* =========================================================
   CMS DELETE REGISTRATION
========================================================= */

const deleteRegistration = async (
  registrationId,
  audit = {}
) => {
  const id =
    validateRegistrationId(
      registrationId
    );

  const existingRegistration =
    await prisma.product_registrations.findUnique({
      where: {
        id,
      },
    });

  if (
    !existingRegistration
  ) {
    throw createError(
      "Registration not found",
      404
    );
  }

  return auditService.track({
    audit,

    action:
      "DELETE",

    resourceType:
      "PRODUCT_REGISTRATION",

    resourceId:
      existingRegistration.id,

    moduleName:
      "Product Registration",

    oldValues:
      serialize(
        existingRegistration
      ),

    operation:
      async () => {
        const deletedRegistration =
          await prisma.product_registrations.delete({
            where: {
              id,
            },
          });

        /* INSTALLATION PHOTO KEYS */

        const photoKeys =
          Array.isArray(
            existingRegistration.installation_photos
          )
            ? existingRegistration
                .installation_photos
                .map(
                  (photo) =>
                    photo?.object_key
                )
                .filter(Boolean)
            : [];

        /* PURCHASE INVOICE KEY */

        const invoiceKey =
          existingRegistration
            .purchase_invoice_object_key;

        /* CLEANUP R2 FILES */

        await cleanupR2Files([
          invoiceKey,

          ...photoKeys,
        ]);

        return serialize(
          deletedRegistration
        );
      },
  });
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  submitRegistration,

  getRegistrations,

  getRegistrationStats,

  getRegistrationById,

  updateRegistration,

  deleteRegistration,
};