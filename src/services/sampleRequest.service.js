// services/sampleRequest.service.js

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
          value ?? "-"
        )}
      </td>
    </tr>
  `;
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
        "❌ MICROSOFT TOKEN ERROR:",
        data
      );

      throw new Error(
        data.error_description ||
          "Failed to get Microsoft access token."
      );
    }

    return data.access_token;
  };

/* =========================================================
   SEND SAMPLE REQUEST
========================================================= */

const sendSampleRequest =
  async (data) => {
    const {
      product_id,
      product_name,
      category_name,

      first_name,
      last_name,
      company_name,

      street_address,
      suite_number,
      city,
      county,
      state,
      zip_code,

      email,
      phone,

      finish,
      quantity,
      remarks,
    } = data;

    const {
      senderEmail,
    } = getGraphConfig();

    const fullName =
      `${first_name} ${last_name}`.trim();

    const formattedAddress = [
      street_address,

      suite_number
        ? suite_number
        : null,

      county
        ? `${city}, ${county}`
        : city,

      `${state} ${zip_code}`,
    ]
      .filter(Boolean)
      .join(", ");

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
                  New Sample Request
                </div>
              </div>

              <!-- CONTENT -->

              <div
                style="
                  padding:32px;
                "
              >

                <!-- PRODUCT INTRO -->

                <div
                  style="
                    margin-bottom:32px;
                    padding-bottom:24px;
                    border-bottom:1px solid #eeeeee;
                  "
                >
                  <div
                    style="
                      font-size:24px;
                      font-weight:700;
                      line-height:1.25;
                      margin-bottom:6px;
                    "
                  >
                    ${escapeHtml(
                      product_name
                    )}
                  </div>

                  <div
                    style="
                      font-size:13px;
                      color:#777777;
                      text-transform:uppercase;
                      letter-spacing:1px;
                    "
                  >
                    ${escapeHtml(
                      category_name
                    )}
                  </div>
                </div>

                <!-- SAMPLE DETAILS -->

                <div
                  style="
                    font-size:12px;
                    font-weight:700;
                    text-transform:uppercase;
                    letter-spacing:1.2px;
                    margin-bottom:12px;
                  "
                >
                  Sample Details
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
                    "Material",
                    product_name
                  )}

                  ${tableRow(
                    "Category",
                    category_name
                  )}

                  ${
                    finish
                      ? tableRow(
                          "Finish",
                          finish
                        )
                      : ""
                  }

                  ${tableRow(
                    "Quantity",
                    `${quantity} ${
                      Number(
                        quantity
                      ) === 1
                        ? "Sample"
                        : "Samples"
                    }`
                  )}
                </table>

                <!-- CUSTOMER INFORMATION -->

                <div
                  style="
                    font-size:12px;
                    font-weight:700;
                    text-transform:uppercase;
                    letter-spacing:1.2px;
                    margin-bottom:12px;
                  "
                >
                  Customer Information
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
                    fullName
                  )}

                  ${
                    company_name
                      ? tableRow(
                          "Company",
                          company_name
                        )
                      : ""
                  }

                  ${tableRow(
                    "Email",
                    email
                  )}

                  ${tableRow(
                    "Phone",
                    phone
                  )}
                </table>

                <!-- SHIPPING ADDRESS -->

                <div
                  style="
                    font-size:12px;
                    font-weight:700;
                    text-transform:uppercase;
                    letter-spacing:1.2px;
                    margin-bottom:12px;
                  "
                >
                  Shipping Address
                </div>

                <div
                  style="
                    background:#f7f7f7;
                    border:1px solid #e2e2e2;
                    padding:20px;
                    margin-bottom:32px;
                    font-size:14px;
                    line-height:1.8;
                    color:#242424;
                  "
                >
                  <div>
                    ${escapeHtml(
                      street_address
                    )}
                  </div>

                  ${
                    suite_number
                      ? `
                        <div>
                          ${escapeHtml(
                            suite_number
                          )}
                        </div>
                      `
                      : ""
                  }

                  <div>
                    ${escapeHtml(
                      city
                    )}${
                      county
                        ? `, ${escapeHtml(
                            county
                          )}`
                        : ""
                    }
                  </div>

                  <div>
                    ${escapeHtml(
                      state
                    )} ${escapeHtml(
                      zip_code
                    )}
                  </div>
                </div>

                <!-- OPTIONAL FULL ADDRESS -->

                <div
                  style="
                    font-size:11px;
                    color:#888888;
                    margin-top:-20px;
                    margin-bottom:32px;
                    line-height:1.6;
                  "
                >
                  ${escapeHtml(
                    formattedAddress
                  )}
                </div>

                <!-- REMARKS -->

                ${
                  remarks
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
                        Remarks
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
                          remarks
                        )}
                      </div>
                    `
                    : ""
                }

                <!-- CONTACT ACTION -->

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
                  Submitted through the Ultra Stones website.
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    /* =====================================================
       TOKEN
    ===================================================== */


    const accessToken =
      await getAccessToken();


    /* =====================================================
       RECIPIENTS
    ===================================================== */

    const toRecipients =
      parseEmailList(
        process.env
          .SAMPLE_REQUEST_EMAIL
      );

    const ccRecipients =
      parseEmailList(
        process.env
          .SAMPLE_REQUEST_CC
      );

    if (
      toRecipients.length ===
      0
    ) {
      throw new Error(
        "No sample request recipients configured."
      );
    }

    /* =====================================================
       GRAPH MESSAGE
    ===================================================== */

    const graphPayload = {
      message: {
        subject:
          `New Sample Request - ${product_name} - ${fullName}`,

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

    /* =====================================================
       SEND THROUGH GRAPH
    ===================================================== */

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
            JSON.stringify(
              graphPayload
            ),
        }
      );

    /*
     * Microsoft Graph normally returns
     * 202 Accepted when sendMail succeeds.
     */

    if (!response.ok) {
      let errorData;

      try {
        errorData =
          await response.json();
      } catch {
        errorData = {
          message:
            await response.text(),
        };
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

      sender:
        senderEmail,

      message:
        "Email accepted by Microsoft Graph.",
    };
  };

module.exports = {
  sendSampleRequest,
};