const ExcelJS =
  require("exceljs");

const displayRequestService =
  require(
    "../services/displayRequest.service"
  );

/* =========================================================
   CREATE DISPLAY REQUEST
========================================================= */

const createDisplayRequest =
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        company,

        display,

        concerned_person_name,
        concerned_person_phone,

        street_address,
        suite_number,
        city,
        county,
        state,
        zip_code,

        message,
      } = req.body;

      /* ===================================================
         REQUIRED FIELD VALIDATION
      =================================================== */

      if (
        !name ||
        !email ||
        !phone ||
        !company ||
        !display ||
        !street_address ||
        !city ||
        !state ||
        !zip_code
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
         CLEAN VALUES
      =================================================== */

      const requestData = {
        name:
          String(name).trim(),

        email:
          String(email)
            .trim()
            .toLowerCase(),

        phone:
          String(phone).trim(),

        company:
          String(company).trim(),

        display:
          String(display).trim(),

        concerned_person_name:
          String(
            concerned_person_name ||
              ""
          ).trim(),

        concerned_person_phone:
          String(
            concerned_person_phone ||
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
          String(city).trim(),

        county:
          String(
            county ||
              ""
          ).trim(),

        state:
          String(state).trim(),

        zip_code:
          String(
            zip_code
          ).trim(),

        message:
          String(
            message ||
              ""
          ).trim(),
      };

      /* ===================================================
         CHECK EMPTY AFTER TRIM
      =================================================== */

      if (
        !requestData.name ||
        !requestData.email ||
        !requestData.phone ||
        !requestData.company ||
        !requestData.display ||
        !requestData.street_address ||
        !requestData.city ||
        !requestData.state ||
        !requestData.zip_code
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
         EMAIL VALIDATION
      =================================================== */

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailPattern.test(
          requestData.email
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please provide a valid email address.",
          });
      }

      /* ===================================================
         CONCERNED PERSON PHONE VALIDATION
      =================================================== */

      if (
        requestData.concerned_person_phone &&
        requestData.concerned_person_phone
          .length < 7
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please provide a valid concerned person phone number.",
          });
      }

      /* ===================================================
         SAVE TO DATABASE
      =================================================== */

      const savedRequest =
        await displayRequestService.createDisplayRequest(
          requestData
        );

      /* ===================================================
         SEND EMAIL
      =================================================== */

      const emailResult =
        await displayRequestService.sendDisplayRequest(
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
            "Display request submitted successfully.",

          data: {
            id:
              savedRequest.id.toString(),

            email:
              emailResult,
          },
        });
    } catch (error) {
      console.error(
        "createDisplayRequest error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to submit display request.",
        });
    }
  };

/* =========================================================
   GET DISPLAY REQUESTS
========================================================= */

const getDisplayRequests =
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
          new Date(
            `${fromDate}T00:00:00.000Z`
          ).getTime()
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid fromDate.",
          });
      }

      if (
        toDate &&
        Number.isNaN(
          new Date(
            `${toDate}T00:00:00.000Z`
          ).getTime()
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid toDate.",
          });
      }

      if (
        fromDate &&
        toDate &&
        fromDate > toDate
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "From date cannot be after To date.",
          });
      }

      /* ===================================================
         GET REQUESTS
      =================================================== */

      const requests =
        await displayRequestService.getAllDisplayRequests(
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
         SERIALIZE BIGINT
      =================================================== */

      const data =
        requests.map(
          (request) => ({
            ...request,

            id:
              request.id.toString(),
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
        "getDisplayRequests error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Failed to fetch display requests.",
        });
    }
  };

/* =========================================================
   EXPORT DISPLAY REQUESTS TO EXCEL
========================================================= */

const exportDisplayRequests =
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
          new Date(
            `${fromDate}T00:00:00.000Z`
          ).getTime()
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid fromDate.",
          });
      }

      if (
        toDate &&
        Number.isNaN(
          new Date(
            `${toDate}T00:00:00.000Z`
          ).getTime()
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid toDate.",
          });
      }

      if (
        fromDate &&
        toDate &&
        fromDate > toDate
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "From date cannot be after To date.",
          });
      }

      /* ===================================================
         GET FILTERED DATA
      =================================================== */

      const requests =
        await displayRequestService.getAllDisplayRequests(
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
          "Display Requests"
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
            "Display",
          key:
            "display",
          width:
            30,
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
            "Concerned Person",
          key:
            "concerned_person_name",
          width:
            25,
        },

        {
          header:
            "Concerned Person Phone",
          key:
            "concerned_person_phone",
          width:
            24,
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
         ADD DATA
      =================================================== */

      requests.forEach(
        (request) => {
          worksheet.addRow({
            id:
              request.id.toString(),

            display:
              request.display,

            name:
              request.name,

            email:
              request.email,

            phone:
              request.phone,

            company:
              request.company,

            concerned_person_name:
              request.concerned_person_name ||
              "",

            concerned_person_phone:
              request.concerned_person_phone ||
              "",

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
      };

      headerRow.height =
        22;

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
          "P1",
      };

      /* ===================================================
         WRAP TEXT
      =================================================== */

      worksheet.getColumn(
        "message"
      ).alignment = {
        vertical:
          "top",

        wrapText:
          true,
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

      const fileName =
        `display-requests-${today}.xlsx`;

      /* ===================================================
         RESPONSE
      =================================================== */

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );

      await workbook.xlsx.write(
        res
      );

      res.end();

      return undefined;
    } catch (error) {
      console.error(
        "exportDisplayRequests error:",
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
              "Failed to export display requests.",
          });
      }

      return undefined;
    }
  };

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  createDisplayRequest,
  getDisplayRequests,
  exportDisplayRequests,
};