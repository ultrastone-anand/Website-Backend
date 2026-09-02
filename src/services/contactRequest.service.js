// services/contactRequest.service.js

/* =========================================================
   HELPERS
========================================================= */

const escapeHtml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const parseEmailList = (value = "") => {
  return String(value)
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean)
    .map((email) => ({
      emailAddress: {
        address: email,
      },
    }));
};

/* =========================================================
   EMAIL TABLE ROW
========================================================= */

const tableRow = (label, value) => {
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
        "
      >
        ${escapeHtml(value || "-")}
      </td>
    </tr>
  `;
};

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
   GET MICROSOFT ACCESS TOKEN
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
        method: "POST",

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
      "❌ MICROSOFT TOKEN ERROR:",
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
   SEND GRAPH EMAIL
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

  const graphPayload = {
    message,

    saveToSentItems:
      true,
  };

  const response =
    await fetch(
      sendUrl,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            graphPayload
          ),
      }
    );

  if (!response.ok) {
    let errorData;

    try {
      errorData =
        await response.json();
    } catch {
      try {
        errorData = {
          message:
            await response.text(),
        };
      } catch {
        errorData = {
          message:
            "Unknown Microsoft Graph error.",
        };
      }
    }

    console.error(
      "❌ MICROSOFT GRAPH SEND ERROR:",
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
   INTERNAL EMAIL TEMPLATE
========================================================= */

const buildInternalEmail = ({
  name,
  subject,
  email,
  phone,
  message,
}) => {
  return `
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

            <!-- HEADER -->

            <div
              style="
                background:#161412;
                color:#ffffff;
                padding:30px 32px;
                border-top:4px solid #c91f26;
              "
            >
              <div
                style="
                  font-size:11px;
                  letter-spacing:3px;
                  text-transform:uppercase;
                  color:#bbbbbb;
                  margin-bottom:8px;
                "
              >
                ULTRA STONES
              </div>

              <div
                style="
                  font-size:28px;
                  line-height:1.2;
                  font-weight:700;
                "
              >
                New Contact Enquiry
              </div>
            </div>

            <!-- CONTENT -->

            <div
              style="
                padding:32px;
              "
            >

              <!-- SUBJECT -->

              <div
                style="
                  margin-bottom:32px;
                  padding-bottom:24px;
                  border-bottom:1px solid #eeeeee;
                "
              >
                <div
                  style="
                    font-size:11px;
                    font-weight:700;
                    text-transform:uppercase;
                    letter-spacing:1.2px;
                    color:#777777;
                    margin-bottom:10px;
                  "
                >
                  Subject
                </div>

                <div
                  style="
                    font-size:24px;
                    font-weight:700;
                    line-height:1.3;
                    color:#161412;
                  "
                >
                  ${escapeHtml(
                    subject
                  )}
                </div>
              </div>

              <!-- CONTACT INFORMATION -->

              <div
                style="
                  font-size:12px;
                  font-weight:700;
                  text-transform:uppercase;
                  letter-spacing:1.2px;
                  margin-bottom:12px;
                "
              >
                Contact Information
              </div>

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  border-collapse:collapse;
                  margin-bottom:32px;
                "
              >
                ${tableRow(
                  "Name",
                  name
                )}

                ${tableRow(
                  "Email",
                  email
                )}

                ${tableRow(
                  "Phone",
                  phone
                )}
              </table>

              <!-- MESSAGE -->

              ${
                message
                  ? `
                    <div
                      style="
                        font-size:12px;
                        font-weight:700;
                        text-transform:uppercase;
                        letter-spacing:1.2px;
                        margin-bottom:12px;
                      "
                    >
                      Message
                    </div>

                    <div
                      style="
                        background:#f7f7f7;
                        border-left:3px solid #c91f26;
                        padding:18px 20px;
                        margin-bottom:32px;
                        font-size:14px;
                        line-height:1.7;
                        color:#444444;
                        white-space:pre-wrap;
                      "
                    >
                      ${escapeHtml(
                        message
                      )}
                    </div>
                  `
                  : ""
              }

              <!-- ACTION -->

              <div
                style="
                  padding-top:4px;
                  margin-bottom:30px;
                "
              >
                <a
                  href="mailto:${escapeHtml(
                    email
                  )}"
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
                  "
                >
                  Reply to Customer
                </a>
              </div>

              <!-- FOOTER -->

              <div
                style="
                  border-top:1px solid #eeeeee;
                  padding-top:20px;
                  color:#999999;
                  font-size:11px;
                  line-height:1.6;
                "
              >
                Submitted through the Ultra Stones contact page.
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

/* =========================================================
   CUSTOMER CONFIRMATION TEMPLATE
========================================================= */

const buildCustomerEmail = ({
  name,
  subject,
  message,
}) => {
  return `
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
              max-width:650px;
              margin:0 auto;
              background:#ffffff;
              border:1px solid #e4e4e4;
            "
          >

            <!-- HEADER -->

            <div
              style="
                background:#161412;
                color:#ffffff;
                padding:30px 32px;
                border-top:4px solid #c91f26;
              "
            >
              <div
                style="
                  font-size:11px;
                  letter-spacing:3px;
                  text-transform:uppercase;
                  color:#bbbbbb;
                  margin-bottom:8px;
                "
              >
                ULTRA STONES
              </div>

              <div
                style="
                  font-size:27px;
                  line-height:1.25;
                  font-weight:700;
                "
              >
                We've Received Your Message
              </div>
            </div>

            <!-- CONTENT -->

            <div
              style="
                padding:34px 32px;
              "
            >
              <div
                style="
                  font-size:16px;
                  line-height:1.7;
                  margin-bottom:20px;
                "
              >
                Hi ${escapeHtml(
                  name
                )},
              </div>

              <div
                style="
                  font-size:15px;
                  line-height:1.8;
                  color:#444444;
                  margin-bottom:26px;
                "
              >
                Thank you for contacting Ultra Stones.
                We've received your enquiry and a member
                of our team will review your message.
              </div>

              <!-- ENQUIRY SUMMARY -->

              <div
                style="
                  font-size:12px;
                  font-weight:700;
                  text-transform:uppercase;
                  letter-spacing:1.2px;
                  margin-bottom:12px;
                "
              >
                Your Enquiry
              </div>

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  border-collapse:collapse;
                  margin-bottom:28px;
                "
              >
                ${tableRow(
                  "Subject",
                  subject
                )}
              </table>

              ${
                message
                  ? `
                    <div
                      style="
                        font-size:12px;
                        font-weight:700;
                        text-transform:uppercase;
                        letter-spacing:1.2px;
                        margin-bottom:12px;
                      "
                    >
                      Your Message
                    </div>

                    <div
                      style="
                        background:#f7f7f7;
                        border-left:3px solid #c91f26;
                        padding:18px 20px;
                        margin-bottom:28px;
                        font-size:14px;
                        line-height:1.7;
                        color:#444444;
                        white-space:pre-wrap;
                      "
                    >
                      ${escapeHtml(
                        message
                      )}
                    </div>
                  `
                  : ""
              }

              <!-- NEXT STEP -->

              <div
                style="
                  font-size:15px;
                  line-height:1.8;
                  color:#444444;
                  margin-bottom:28px;
                "
              >
                If additional information is needed, a
                member of our team will reach out using
                the contact information you provided.
              </div>

              <div
                style="
                  font-size:15px;
                  line-height:1.8;
                  color:#444444;
                  margin-bottom:32px;
                "
              >
                We appreciate you reaching out to Ultra Stones
                and look forward to assisting you.
              </div>

              <!-- SIGNATURE -->

              <div
                style="
                  font-size:14px;
                  line-height:1.7;
                  color:#222222;
                  margin-bottom:30px;
                "
              >
                Best regards,
                <br />

                <strong>
                  Ultra Stones
                </strong>
              </div>

              <!-- FOOTER -->

              <div
                style="
                  border-top:1px solid #eeeeee;
                  padding-top:20px;
                  color:#999999;
                  font-size:11px;
                  line-height:1.6;
                "
              >
                This confirmation was sent because a contact
                enquiry was submitted through the Ultra Stones
                website.
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

/* =========================================================
   SEND CONTACT REQUEST
========================================================= */

const sendContactRequest = async (data) => {
  const {
    name,
    subject,
    email,
    phone,
    message,
  } = data;

  const {
    senderEmail,
  } = getGraphConfig();

  /* =====================================================
     RECIPIENTS
  ===================================================== */

  const toRecipients =
    parseEmailList(
      process.env
        .CONTACT_REQUEST_EMAIL
    );

  const ccRecipients =
    parseEmailList(
      process.env
        .CONTACT_REQUEST_CC
    );

  if (
    toRecipients.length ===
    0
  ) {
    throw new Error(
      "No contact request recipients configured."
    );
  }

  /* =====================================================
     TOKEN

     Same Microsoft token is reused for both emails.
  ===================================================== */

  const accessToken =
    await getAccessToken();

  /* =====================================================
     INTERNAL EMAIL
  ===================================================== */

  const internalMailHtml =
    buildInternalEmail({
      name,
      subject,
      email,
      phone,
      message,
    });

  const internalMessage = {
    subject:
      `New Contact Enquiry - ${subject} - ${name}`,

    body: {
      contentType:
        "HTML",

      content:
        internalMailHtml,
    },

    toRecipients,

    ...(ccRecipients.length > 0
      ? {
          ccRecipients,
        }
      : {}),

    /*
     * Outlook Reply will target
     * the customer directly.
     */
    replyTo: [
      {
        emailAddress: {
          address:
            email,
        },
      },
    ],
  };

  /*
   * Internal contact notification is critical.
   * If this fails, the request should fail.
   */

  const internalResult =
    await sendGraphEmail({
      accessToken,
      senderEmail,

      message:
        internalMessage,
    });

  /* =====================================================
     CUSTOMER CONFIRMATION
  ===================================================== */

  let customerConfirmationSent =
    false;

  let customerConfirmationStatus =
    null;

  try {
    const customerMailHtml =
      buildCustomerEmail({
        name,
        subject,
        message,
      });

    const customerMessage = {
      subject:
        `We've Received Your Enquiry - Ultra Stones`,

      body: {
        contentType:
          "HTML",

        content:
          customerMailHtml,
      },

      toRecipients: [
        {
          emailAddress: {
            address:
              email,
          },
        },
      ],
    };

    const customerResult =
      await sendGraphEmail({
        accessToken,
        senderEmail,

        message:
          customerMessage,
      });

    customerConfirmationSent =
      true;

    customerConfirmationStatus =
      customerResult.status;
  } catch (error) {
    /*
     * Do NOT fail the whole contact request
     * after Ultra Stones already received it.
     */

    console.error(
      "❌ CUSTOMER CONTACT CONFIRMATION EMAIL FAILED:",
      {
        customerEmail:
          email,

        subject,

        error:
          error.message,
      }
    );
  }

  /* =====================================================
     SUCCESS
  ===================================================== */

  return {
    success: true,

    sender:
      senderEmail,

    recipients: {
      to:
        toRecipients.map(
          (item) =>
            item.emailAddress
              .address
        ),

      cc:
        ccRecipients.map(
          (item) =>
            item.emailAddress
              .address
        ),
    },

    internalEmail: {
      sent: true,

      status:
        internalResult.status,
    },

    customerConfirmation: {
      sent:
        customerConfirmationSent,

      status:
        customerConfirmationStatus,
    },

    message:
      customerConfirmationSent
        ? "Contact enquiry sent to the Ultra Stones team and confirmation sent to customer."
        : "Contact enquiry sent to the Ultra Stones team, but customer confirmation could not be sent.",
  };
};

module.exports = {
  sendContactRequest,
};