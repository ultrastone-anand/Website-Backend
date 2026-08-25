// services/ceuRequest.service.js

/* =========================================================
   HELPERS
========================================================= */

const escapeHtml = (
  value = ""
) => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const parseEmailList = (
  value = ""
) => {
  return String(value)
    .split(",")
    .map(
      (email) =>
        email.trim()
    )
    .filter(Boolean)
    .map(
      (email) => ({
        emailAddress: {
          address: email,
        },
      })
    );
};

/* =========================================================
   EMAIL TABLE ROW
========================================================= */

const tableRow = (
  label,
  value
) => {
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
        ${escapeHtml(
          value || "-"
        )}
      </td>
    </tr>
  `;
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (
  value
) => {
  if (!value) {
    return "-";
  }

  const date =
    new Date(
      `${value}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
};

/* =========================================================
   MICROSOFT GRAPH CONFIG
========================================================= */

const getGraphConfig =
  () => {
    const tenantId =
      process.env
        .MS_TENANT_ID;

    const clientId =
      process.env
        .MS_CLIENT_ID;

    const clientSecret =
      process.env
        .MS_CLIENT_SECRET;

    const senderEmail =
      process.env
        .MS_SENDER_EMAIL;

    console.log(
      "🔎 GRAPH CONFIG CHECK:",
      {
        tenantIdPresent:
          Boolean(
            tenantId
          ),

        clientIdPresent:
          Boolean(
            clientId
          ),

        clientSecretPresent:
          Boolean(
            clientSecret
          ),

        senderEmail:
          senderEmail ||
          null,
      }
    );

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

const getAccessToken =
  async () => {
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

    console.log(
      "🔐 REQUESTING MICROSOFT GRAPH TOKEN..."
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

    console.log(
      "🔐 TOKEN RESPONSE STATUS:",
      response.status
    );

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
      console.error(
        "❌ NO ACCESS TOKEN RETURNED:",
        data
      );

      throw new Error(
        "Microsoft Graph did not return an access token."
      );
    }

    console.log(
      "✅ MICROSOFT GRAPH TOKEN RECEIVED"
    );

    return data.access_token;
  };

/* =========================================================
   SEND CEU REQUEST
========================================================= */

const sendCeuRequest =
  async (data) => {
    const {
      course,
      name,
      email,
      phone,
      company,
      role,
      preferredDate,
      message,
    } = data;

    console.log(
      "========================================"
    );

    console.log(
      "📚 CEU REQUEST SERVICE STARTED"
    );

    console.log(
      "📦 RECEIVED CEU DATA:",
      {
        course,
        name,
        email,
        phone,
        company,
        role:
          role || null,

        preferredDate:
          preferredDate ||
          null,

        messagePresent:
          Boolean(
            message
          ),
      }
    );

    const {
      senderEmail,
    } = getGraphConfig();

    const formattedDate =
      formatDate(
        preferredDate
      );

    /* =====================================================
       HTML EMAIL
    ===================================================== */

    const mailHtml = `
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
                  New CEU Course Request
                </div>
              </div>

              <!-- CONTENT -->

              <div
                style="
                  padding:32px;
                "
              >

                <!-- COURSE -->

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
                    Requested Course
                  </div>

                  <div
                    style="
                      font-size:25px;
                      font-weight:700;
                      line-height:1.3;
                      color:#161412;
                    "
                  >
                    ${escapeHtml(
                      course
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

                  ${tableRow(
                    "Company / Firm",
                    company
                  )}

                  ${
                    role
                      ? tableRow(
                          "Professional Role",
                          role
                        )
                      : ""
                  }
                </table>

                <!-- SCHEDULING -->

                ${
                  preferredDate
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
                        Scheduling Preference
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
                          "Preferred Date",
                          formattedDate
                        )}
                      </table>
                    `
                    : ""
                }

                <!-- ADDITIONAL NOTES -->

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
                        Additional Notes
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
                    Reply to Requester
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
                  Submitted through the Ultra Stones CEU page.
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    /* =====================================================
       RECIPIENTS
    ===================================================== */

    const rawTo =
      process.env
        .CEU_REQUEST_EMAIL;

    const rawCc =
      process.env
        .CEU_REQUEST_CC;

    console.log(
      "📧 CEU ENV CHECK:",
      {
        sender:
          senderEmail,

        rawTo:
          rawTo ||
          null,

        rawCc:
          rawCc ||
          null,
      }
    );

    const toRecipients =
      parseEmailList(
        rawTo
      );

    const ccRecipients =
      parseEmailList(
        rawCc
      );

    console.log(
      "📧 PARSED RECIPIENTS:",
      {
        toRecipients,
        ccRecipients,
      }
    );

    if (
      toRecipients.length ===
      0
    ) {
      throw new Error(
        "No CEU request recipients configured."
      );
    }

    /* =====================================================
       TOKEN
    ===================================================== */

    const accessToken =
      await getAccessToken();

    /* =====================================================
       GRAPH PAYLOAD
    ===================================================== */

    const graphPayload = {
      message: {
        subject:
          `New CEU Request - ${course} - ${name}`,

        body: {
          contentType:
            "HTML",

          content:
            mailHtml,
        },

        toRecipients,

        ccRecipients,

        replyTo: [
          {
            emailAddress: {
              address:
                email,
            },
          },
        ],
      },

      saveToSentItems:
        true,
    };

    console.log(
      "📦 GRAPH PAYLOAD SUMMARY:",
      {
        subject:
          graphPayload
            .message
            .subject,

        sender:
          senderEmail,

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

        replyTo:
          email,

        htmlLength:
          mailHtml.length,
      }
    );

    /* =====================================================
       SEND THROUGH MICROSOFT GRAPH
    ===================================================== */

    const sendUrl =
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(
        senderEmail
      )}/sendMail`;

    console.log(
      "📡 GRAPH SEND URL:",
      sendUrl
    );

    console.log(
      "📨 SENDING CEU EMAIL THROUGH MICROSOFT GRAPH..."
    );

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
            JSON.stringify(
              graphPayload
            ),
        }
      );

    console.log(
      "📬 GRAPH RESPONSE STATUS:",
      response.status,
      response.statusText
    );

    /* =====================================================
       ERROR RESPONSE
    ===================================================== */

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
        "❌ MICROSOFT GRAPH CEU SEND ERROR:",
        errorData
      );

      console.log(
        "========================================"
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

    /* =====================================================
       SUCCESS
    ===================================================== */

    console.log(
      "✅ CEU EMAIL ACCEPTED BY MICROSOFT GRAPH"
    );

    console.log(
      "✅ EXPECTED GRAPH STATUS: 202"
    );

    console.log(
      "✅ ACTUAL GRAPH STATUS:",
      response.status
    );

    console.log(
      "✅ CHECK SENT ITEMS FOR:",
      senderEmail
    );

    console.log(
      "========================================"
    );

    return {
      success: true,

      status:
        response.status,

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

      message:
        "CEU request email accepted by Microsoft Graph.",
    };
  };

module.exports = {
  sendCeuRequest,
};