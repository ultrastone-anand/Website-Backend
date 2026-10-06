const ceuRequestService =
  require(
    "../services/ceuRequest.service"
  );

const ExcelJS =
  require("exceljs");

/* =========================================================
   CREATE CEU REQUEST
========================================================= */

const createCeuRequest =
  async (req, res) => {
    try {
      const {
        course,
        name,
        email,
        phone,
        company,
        role,
        preferredDate,
        message,
      } = req.body;

      /* ===================================================
         REQUIRED FIELDS
      =================================================== */

      if (
        !course ||
        !name ||
        !email ||
        !phone ||
        !company
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
         CLEAN DATA
      =================================================== */

      const requestData = {
        course:
          String(
            course
          ).trim(),

        name:
          String(
            name
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

        company:
          String(
            company
          ).trim(),

        role:
          String(
            role || ""
          ).trim(),

        preferredDate:
          String(
            preferredDate || ""
          ).trim(),

        message:
          String(
            message || ""
          ).trim(),
      };

      /* ===================================================
         SAVE TO DATABASE
      =================================================== */

      const savedRequest =
        await ceuRequestService.createCeuRequest(
          requestData
        );

      /* ===================================================
         SEND EMAILS
      =================================================== */

      const emailResult =
        await ceuRequestService.sendCeuRequest(
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
            "CEU course request submitted successfully.",

          data: {
            id:
              savedRequest.id.toString(),

            email:
              emailResult,
          },
        });
    } catch (error) {
      console.error(
        "createCeuRequest error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to submit CEU course request.",
        });
    }
  };

/* =========================================================
   GET CEU REQUESTS
========================================================= */

const getCeuRequests =
  async (req, res) => {
    try {
      const {
        fromDate,
        toDate,
      } = req.query;

      /* ===================================================
         VALIDATE DATE RANGE
      =================================================== */

      if (
        fromDate &&
        Number.isNaN(
          Date.parse(
            `${fromDate}T00:00:00.000Z`
          )
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid from date.",
          });
      }

      if (
        toDate &&
        Number.isNaN(
          Date.parse(
            `${toDate}T00:00:00.000Z`
          )
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid to date.",
          });
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
        return res
          .status(400)
          .json({
            success: false,

            message:
              "From date cannot be after to date.",
          });
      }

      /* ===================================================
         GET REQUESTS
      =================================================== */

      const requests =
        await ceuRequestService.getAllCeuRequests(
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
      =================================================== */

      const data =
        requests.map(
          (request) => ({
            id:
              request.id.toString(),

            course:
              request.course,

            name:
              request.name,

            email:
              request.email,

            phone:
              request.phone,

            company:
              request.company,

            role:
              request.role ||
              null,

            preferred_date:
              request.preferred_date ||
              null,

            message:
              request.message ||
              null,

            created_at:
              request.created_at,
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
        "getCeuRequests error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to fetch CEU requests.",
        });
    }
  };

/* =========================================================
   EXPORT CEU REQUESTS TO EXCEL
========================================================= */

const exportCeuRequests =
  async (req, res) => {
    try {
      const {
        fromDate,
        toDate,
      } = req.query;

      /* ===================================================
         VALIDATE DATE RANGE
      =================================================== */

      if (
        fromDate &&
        Number.isNaN(
          Date.parse(
            `${fromDate}T00:00:00.000Z`
          )
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid from date.",
          });
      }

      if (
        toDate &&
        Number.isNaN(
          Date.parse(
            `${toDate}T00:00:00.000Z`
          )
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid to date.",
          });
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
        return res
          .status(400)
          .json({
            success: false,

            message:
              "From date cannot be after to date.",
          });
      }

      /* ===================================================
         GET REQUESTS
      =================================================== */

      const requests =
        await ceuRequestService.getAllCeuRequests(
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
          "CEU Requests"
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
            "Course",
          key:
            "course",
          width:
            35,
        },

        {
          header:
            "Name",
          key:
            "name",
          width:
            25,
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
            "Company",
          key:
            "company",
          width:
            30,
        },

        {
          header:
            "Role",
          key:
            "role",
          width:
            25,
        },

        {
          header:
            "Preferred Date",
          key:
            "preferred_date",
          width:
            20,
        },

        {
          header:
            "Message",
          key:
            "message",
          width:
            50,
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

            course:
              request.course,

            name:
              request.name,

            email:
              request.email,

            phone:
              request.phone,

            company:
              request.company,

            role:
              request.role ||
              "",

            preferred_date:
              request.preferred_date ||
              "",

            message:
              request.message ||
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
        "preferred_date"
      ).numFmt =
        "mm/dd/yyyy";

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
          "J1",
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
        `ceu-requests-${today}.xlsx`;

      if (
        fromDate &&
        toDate
      ) {
        fileName =
          `ceu-requests-${fromDate}-to-${toDate}.xlsx`;
      } else if (
        fromDate
      ) {
        fileName =
          `ceu-requests-from-${fromDate}.xlsx`;
      } else if (
        toDate
      ) {
        fileName =
          `ceu-requests-to-${toDate}.xlsx`;
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
        "exportCeuRequests error:",
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
              "Failed to export CEU requests.",
          });
      }

      return undefined;
    }
  };

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  createCeuRequest,
  exportCeuRequests,
  getCeuRequests,
};