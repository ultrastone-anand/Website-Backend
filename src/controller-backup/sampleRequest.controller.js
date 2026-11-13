const sampleRequestService =
  require(
    "../services/sampleRequest.service"
  );

const ExcelJS =
  require("exceljs");

/* =========================================================
   DATE FILTER VALIDATION
========================================================= */

const validateDateFilters = (
  fromDate,
  toDate
) => {
  if (
    fromDate &&
    Number.isNaN(
      Date.parse(
        `${fromDate}T00:00:00.000Z`
      )
    )
  ) {
    return "Invalid from date.";
  }

  if (
    toDate &&
    Number.isNaN(
      Date.parse(
        `${toDate}T00:00:00.000Z`
      )
    )
  ) {
    return "Invalid to date.";
  }

  if (
    fromDate &&
    toDate &&
    new Date(
      `${fromDate}T00:00:00.000Z`
    ) >
      new Date(
        `${toDate}T23:59:59.999Z`
      )
  ) {
    return "From date cannot be after to date.";
  }

  return null;
};

/* =========================================================
   CREATE SAMPLE REQUEST
========================================================= */

const createSampleRequest =
  async (req, res) => {
    try {
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
      } = req.body;

      /* ===================================================
         REQUIRED FIELDS
      =================================================== */

      if (
        !product_id ||
        !product_name ||
        !category_name ||
        !first_name ||
        !last_name ||
        !street_address ||
        !city ||
        !state ||
        !zip_code ||
        !email ||
        !phone ||
        !quantity
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please provide all required fields.",
          });
      }

      /* ===================================================
         QUANTITY VALIDATION
      =================================================== */

      const safeQuantity =
        Number(quantity);

      if (
        !Number.isInteger(
          safeQuantity
        ) ||
        safeQuantity < 1 ||
        safeQuantity > 20
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid sample quantity.",
          });
      }

      /* ===================================================
         PRODUCT ID VALIDATION
      =================================================== */

      let safeProductId;

      try {
        safeProductId =
          BigInt(
            product_id
          );
      } catch {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid product ID.",
          });
      }

      if (
        safeProductId <= 0n
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid product ID.",
          });
      }

      /* ===================================================
         CLEAN DATA
      =================================================== */

      const requestData = {
        product_id:
          safeProductId,

        product_name:
          String(
            product_name
          ).trim(),

        category_name:
          String(
            category_name
          ).trim(),

        first_name:
          String(
            first_name
          ).trim(),

        last_name:
          String(
            last_name
          ).trim(),

        company_name:
          String(
            company_name ||
              ""
          ).trim(),

        street_address:
          String(
            street_address
          ).trim(),

        suite_number:
          String(
            suite_number ||
              ""
          ).trim(),

        city:
          String(
            city
          ).trim(),

        county:
          String(
            county ||
              ""
          ).trim(),

        state:
          String(
            state
          ).trim(),

        zip_code:
          String(
            zip_code
          ).trim(),

        email:
          String(
            email
          )
            .trim()
            .toLowerCase(),

        phone:
          String(
            phone
          ).trim(),

        finish:
          String(
            finish ||
              ""
          ).trim(),

        quantity:
          safeQuantity,

        remarks:
          String(
            remarks ||
              ""
          ).trim(),
      };

      /* ===================================================
         SAVE TO DATABASE
      =================================================== */

      const savedRequest =
        await sampleRequestService.createSampleRequest(
          requestData
        );

      /* ===================================================
         SEND EXISTING EMAILS
      =================================================== */

      const emailResult =
        await sampleRequestService.sendSampleRequest(
          requestData
        );

      /* ===================================================
         SUCCESS
      =================================================== */

      return res
        .status(201)
        .json({
          success: true,

          message:
            "Sample request submitted successfully.",

          data: {
            id:
              savedRequest.id.toString(),

            email:
              emailResult,
          },
        });
    } catch (error) {
      console.error(
        "createSampleRequest error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to submit sample request.",
        });
    }
  };

/* =========================================================
   GET SAMPLE REQUESTS
========================================================= */

const getSampleRequests =
  async (req, res) => {
    try {
      const {
        fromDate,
        toDate,
      } = req.query;

      /* ===================================================
         VALIDATE DATE RANGE
      =================================================== */

      const validationError =
        validateDateFilters(
          fromDate,
          toDate
        );

      if (validationError) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              validationError,
          });
      }

      /* ===================================================
         GET REQUESTS
      =================================================== */

      const requests =
        await sampleRequestService.getAllSampleRequests(
          {
            fromDate:
              fromDate ||
              null,

            toDate:
              toDate ||
              null,
          }
        );

      /* ===================================================
         SERIALIZE RESPONSE

         BigInt cannot be returned directly as JSON.
      =================================================== */

      const data =
        requests.map(
          (request) => ({
            id:
              request.id.toString(),

            product_id:
              request.product_id.toString(),

            product_name:
              request.product_name,

            category_name:
              request.category_name,

            first_name:
              request.first_name,

            last_name:
              request.last_name,

            company_name:
              request.company_name ||
              null,

            street_address:
              request.street_address,

            suite_number:
              request.suite_number ||
              null,

            city:
              request.city,

            county:
              request.county ||
              null,

            state:
              request.state,

            zip_code:
              request.zip_code,

            email:
              request.email,

            phone:
              request.phone,

            finish:
              request.finish ||
              null,

            quantity:
              request.quantity,

            remarks:
              request.remarks ||
              null,

            status:
              request.status,

            internal_notes:
              request.internal_notes ||
              null,

            created_at:
              request.created_at,

            updated_at:
              request.updated_at,
          })
        );

      /* ===================================================
         SUCCESS
      =================================================== */

      return res
        .status(200)
        .json({
          success: true,

          count:
            data.length,

          data,
        });
    } catch (error) {
      console.error(
        "getSampleRequests error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to fetch sample requests.",
        });
    }
  };

/* =========================================================
   EXPORT SAMPLE REQUESTS TO EXCEL
========================================================= */

const exportSampleRequests =
  async (req, res) => {
    try {
      const {
        fromDate,
        toDate,
      } = req.query;

      /* ===================================================
         VALIDATE DATE RANGE
      =================================================== */

      const validationError =
        validateDateFilters(
          fromDate,
          toDate
        );

      if (validationError) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              validationError,
          });
      }

      /* ===================================================
         GET REQUESTS
      =================================================== */

      const requests =
        await sampleRequestService.getAllSampleRequests(
          {
            fromDate:
              fromDate ||
              null,

            toDate:
              toDate ||
              null,
          }
        );

      /* ===================================================
         CREATE WORKBOOK
      =================================================== */

      const workbook =
        new ExcelJS.Workbook();

      workbook.creator =
        "Ultra Stones";

      workbook.created =
        new Date();

      const worksheet =
        workbook.addWorksheet(
          "Sample Requests"
        );

      /* ===================================================
         COLUMNS
      =================================================== */

      worksheet.columns = [
        {
          header:
            "Request ID",
          key:
            "id",
          width:
            14,
        },

        {
          header:
            "Product ID",
          key:
            "product_id",
          width:
            14,
        },

        {
          header:
            "Product Name",
          key:
            "product_name",
          width:
            30,
        },

        {
          header:
            "Category",
          key:
            "category_name",
          width:
            24,
        },

        {
          header:
            "First Name",
          key:
            "first_name",
          width:
            20,
        },

        {
          header:
            "Last Name",
          key:
            "last_name",
          width:
            20,
        },

        {
          header:
            "Company",
          key:
            "company_name",
          width:
            30,
        },

        {
          header:
            "Email",
          key:
            "email",
          width:
            32,
        },

        {
          header:
            "Phone",
          key:
            "phone",
          width:
            20,
        },

        {
          header:
            "Street Address",
          key:
            "street_address",
          width:
            35,
        },

        {
          header:
            "Suite Number",
          key:
            "suite_number",
          width:
            18,
        },

        {
          header:
            "City",
          key:
            "city",
          width:
            20,
        },

        {
          header:
            "County",
          key:
            "county",
          width:
            20,
        },

        {
          header:
            "State",
          key:
            "state",
          width:
            18,
        },

        {
          header:
            "ZIP Code",
          key:
            "zip_code",
          width:
            15,
        },

        {
          header:
            "Finish",
          key:
            "finish",
          width:
            20,
        },

        {
          header:
            "Quantity",
          key:
            "quantity",
          width:
            12,
        },

        {
          header:
            "Remarks",
          key:
            "remarks",
          width:
            45,
        },

        {
          header:
            "Status",
          key:
            "status",
          width:
            16,
        },

        {
          header:
            "Internal Notes",
          key:
            "internal_notes",
          width:
            40,
        },

        {
          header:
            "Submitted At",
          key:
            "created_at",
          width:
            24,
        },
      ];

      /* ===================================================
         DATA
      =================================================== */

      requests.forEach(
        (request) => {
          worksheet.addRow({
            id:
              request.id.toString(),

            product_id:
              request.product_id.toString(),

            product_name:
              request.product_name,

            category_name:
              request.category_name,

            first_name:
              request.first_name,

            last_name:
              request.last_name,

            company_name:
              request.company_name ||
              "",

            email:
              request.email,

            phone:
              request.phone,

            street_address:
              request.street_address,

            suite_number:
              request.suite_number ||
              "",

            city:
              request.city,

            county:
              request.county ||
              "",

            state:
              request.state,

            zip_code:
              request.zip_code,

            finish:
              request.finish ||
              "",

            quantity:
              request.quantity,

            remarks:
              request.remarks ||
              "",

            status:
              request.status ||
              "",

            internal_notes:
              request.internal_notes ||
              "",

            created_at:
              request.created_at,
          });
        }
      );

      /* ===================================================
         HEADER STYLE
      =================================================== */

      const headerRow =
        worksheet.getRow(1);

      headerRow.font = {
        bold: true,

        color: {
          argb:
            "FFFFFFFF",
        },
      };

      headerRow.fill = {
        type:
          "pattern",

        pattern:
          "solid",

        fgColor: {
          argb:
            "FF161412",
        },
      };

      headerRow.alignment = {
        vertical:
          "middle",
      };

      headerRow.height =
        24;

      /* ===================================================
         ROW ALIGNMENT
      =================================================== */

      worksheet.eachRow(
        (
          row,
          rowNumber
        ) => {
          if (
            rowNumber >
            1
          ) {
            row.alignment = {
              vertical:
                "top",

              wrapText:
                true,
            };
          }
        }
      );

      /* ===================================================
         DATE FORMAT
      =================================================== */

      worksheet.getColumn(
        "created_at"
      ).numFmt =
        "mm/dd/yyyy hh:mm AM/PM";

      /* ===================================================
         FREEZE HEADER
      =================================================== */

      worksheet.views = [
        {
          state:
            "frozen",

          ySplit:
            1,
        },
      ];

      /* ===================================================
         AUTO FILTER
      =================================================== */

      worksheet.autoFilter = {
        from:
          "A1",

        to:
          "U1",
      };

      /* ===================================================
         FILE NAME
      =================================================== */

      const today =
        new Date()
          .toISOString()
          .slice(
            0,
            10
          );

      let fileName =
        `sample-requests-${today}.xlsx`;

      if (
        fromDate &&
        toDate
      ) {
        fileName =
          `sample-requests-${fromDate}-to-${toDate}.xlsx`;
      } else if (
        fromDate
      ) {
        fileName =
          `sample-requests-from-${fromDate}.xlsx`;
      } else if (
        toDate
      ) {
        fileName =
          `sample-requests-to-${toDate}.xlsx`;
      }

      /* ===================================================
         RESPONSE HEADERS
      =================================================== */

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );

      /* ===================================================
         SEND EXCEL
      =================================================== */

      await workbook.xlsx.write(
        res
      );

      res.end();

      return undefined;
    } catch (error) {
      console.error(
        "exportSampleRequests error:",
        error
      );

      if (
        !res.headersSent
      ) {
        return res
          .status(500)
          .json({
            success: false,

            message:
              "Failed to export sample requests.",
          });
      }

      return undefined;
    }
  };

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  createSampleRequest,
  getSampleRequests,
  exportSampleRequests,
};