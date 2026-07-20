const ExcelJS = require("exceljs");

const prisma = require("../config/prisma");

// ======================================================
// CONFIGURATION
// ======================================================

const REQUIRED_HEADERS = [
  "Product ID",
  "Category",
  "Product",
  "Long Description",
  "Short Description",
];

const MAX_IMPORT_ROWS = 10000;

// ======================================================
// HELPERS
// ======================================================

const logBulkDesc = (label, value = "") => {
  console.log(`[Bulk Description] ${label}`, value);
};

const createServiceError = (
  message,
  statusCode = 400
) => {
  const error = new Error(message);
  error.statusCode = statusCode;

  return error;
};

const normalizeText = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
};

const normalizeForComparison = (value) =>
  normalizeText(value)
    .replace(/\s+/g, " ")
    .toLowerCase();

const sanitizeFileName = (value) =>
  normalizeText(value)
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const toBigIntId = (value) => {
  try {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return null;
    }

    return BigInt(String(value).trim());
  } catch {
    return null;
  }
};

const getCellValue = (cell) => {
  if (!cell) {
    return "";
  }

  const value = cell.value;

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  if (
    typeof value === "object" &&
    Array.isArray(value.richText)
  ) {
    return value.richText
      .map((item) => item.text || "")
      .join("");
  }

  if (
    typeof value === "object" &&
    value.text
  ) {
    return value.text;
  }

  if (
    typeof value === "object" &&
    value.result !== undefined
  ) {
    return value.result;
  }

  return value;
};

// ======================================================
// DATABASE HELPERS
// ======================================================

const findCategoryById = async (
  categoryId,
  prismaClient = prisma
) => {
  const parsedCategoryId = Number(categoryId);

  logBulkDesc(
    "Finding category ID:",
    parsedCategoryId
  );

  const category =
    await prismaClient.stone_categories.findUnique({
      where: {
        id: parsedCategoryId,
      },
    });

  logBulkDesc(
    "Category query result:",
    category
  );

  if (!category) {
    throw createServiceError(
      "Selected category was not found.",
      404
    );
  }

  return category;
};

const findProductsByCategory = async (
  categoryId,
  prismaClient = prisma
) => {
  const parsedCategoryId = Number(categoryId);

  logBulkDesc(
    "Searching products for category:",
    parsedCategoryId
  );

  const products =
    await prismaClient.stone_products.findMany({
      where: {
        category_id: parsedCategoryId,
      },

      select: {
        id: true,
        name: true,
        category_id: true,

        // These are your actual description fields.
        long_description: true,
        small_description: true,
      },

      orderBy: [
        {
          name: "asc",
        },
        {
          id: "asc",
        },
      ],
    });

  logBulkDesc(
    "Products found:",
    products.length
  );

  logBulkDesc(
    "First product:",
    products[0]
      ? {
          ...products[0],
          id: products[0].id.toString(),
        }
      : null
  );

  return products;
};

// ======================================================
// EXCEL STYLING
// ======================================================

const styleDescriptionWorksheet = (
  worksheet
) => {
  worksheet.views = [
    {
      state: "frozen",
      ySplit: 1,
    },
  ];

  worksheet.autoFilter = {
    from: "A1",
    to: "E1",
  };

  worksheet.getColumn("A").width = 18;
  worksheet.getColumn("B").width = 24;
  worksheet.getColumn("C").width = 42;
  worksheet.getColumn("D").width = 90;
  worksheet.getColumn("E").width = 60;

  const headerRow = worksheet.getRow(1);

  headerRow.height = 30;

  headerRow.font = {
    bold: true,
    color: {
      argb: "FFFFFFFF",
    },
  };

  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "FF1F2937",
    },
  };

  headerRow.alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  worksheet.eachRow(
    { includeEmpty: true },
    (row, rowNumber) => {
      if (rowNumber === 1) {
        return;
      }

      row.height = 70;

      row.getCell(1).alignment = {
        vertical: "top",
        horizontal: "center",
      };

      row.getCell(2).alignment = {
        vertical: "top",
      };

      row.getCell(3).alignment = {
        vertical: "top",
      };

      row.getCell(4).alignment = {
        vertical: "top",
        wrapText: true,
      };

      row.getCell(5).alignment = {
        vertical: "top",
        wrapText: true,
      };
    }
  );
};

// ======================================================
// GENERATE TEMPLATE
// ======================================================

const generateTemplate = async (
  categoryId
) => {
  logBulkDesc(
    "Starting template generation:",
    categoryId
  );

  const category =
    await findCategoryById(categoryId);

  const products =
    await findProductsByCategory(categoryId);

  if (!products.length) {
    throw createServiceError(
      `No products were found under the "${category.name}" category.`,
      404
    );
  }

  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Ultra Stones CMS";
  workbook.lastModifiedBy =
    "Ultra Stones CMS";
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet(
    "Product Descriptions"
  );

  worksheet.columns = [
    {
      header: "Product ID",
      key: "product_id",
    },
    {
      header: "Category",
      key: "category",
    },
    {
      header: "Product",
      key: "product",
    },
    {
      header: "Long Description",
      key: "long_description",
    },
    {
      header: "Short Description",
      key: "short_description",
    },
  ];

  products.forEach((product, index) => {
    const rowData = {
      // Keep BigInt IDs as text in Excel.
      product_id: product.id.toString(),

      category: category.name,

      product: product.name || "",

      long_description:
        product.long_description || "",

      // Your database short description field is
      // small_description.
      short_description:
        product.small_description || "",
    };

    worksheet.addRow(rowData);

    if (index < 3) {
      logBulkDesc(
        `Adding row ${index + 2}:`,
        rowData
      );
    }
  });

  styleDescriptionWorksheet(worksheet);

  const instructions =
    workbook.addWorksheet("Instructions");

  instructions.getColumn("A").width = 120;

  instructions.addRows([
    [
      "Ultra Stones – Bulk Product Description Template",
    ],
    [""],
    [`Category: ${category.name}`],
    [`Category ID: ${category.id}`],
    [`Total Products: ${products.length}`],
    [""],
    ["Instructions:"],
    [
      "1. Do not change Product ID, Category or Product.",
    ],
    [
      "2. Only edit Long Description and Short Description.",
    ],
    [
      "3. Existing descriptions are already included.",
    ],
    [
      "4. Upload this same .xlsx file back into the CMS.",
    ],
    [
      "5. Changed descriptions will be updated.",
    ],
    [
      "6. Unchanged descriptions will be skipped.",
    ],
    [
      "7. Blank description cells will clear that description.",
    ],
    [
      "8. No new products will be created.",
    ],
  ]);

  instructions.getRow(1).font = {
    bold: true,
    size: 16,
  };

  instructions.getRow(3).font = {
    bold: true,
  };

  instructions.getRow(4).font = {
    bold: true,
  };

  instructions.getRow(5).font = {
    bold: true,
  };

  instructions.eachRow((row) => {
    row.alignment = {
      vertical: "top",
      wrapText: true,
    };
  });

  logBulkDesc(
    "Description worksheet rows:",
    worksheet.rowCount
  );

  let generatedBuffer;

  try {
    generatedBuffer =
      await workbook.xlsx.writeBuffer();
  } catch (error) {
    console.error(
      "[Bulk Description] Excel generation failed:",
      error
    );

    throw createServiceError(
      `Excel generation failed: ${error.message}`,
      500
    );
  }

  const buffer = Buffer.from(
    generatedBuffer
  );

  const signature = buffer
    .subarray(0, 4)
    .toString("hex");

  logBulkDesc(
    "Generated Excel buffer:",
    {
      size: buffer.length,
      signature,
    }
  );

  if (!buffer.length) {
    throw createServiceError(
      "Excel generation returned an empty file.",
      500
    );
  }

  if (signature !== "504b0304") {
    throw createServiceError(
      `Invalid generated XLSX signature: ${signature}`,
      500
    );
  }

  const safeCategoryName =
    sanitizeFileName(category.name) ||
    `Category-${categoryId}`;

  return {
    buffer,
    fileName:
      `${safeCategoryName}-Product-Descriptions.xlsx`,
    totalProducts: products.length,
  };
};

// ======================================================
// READ AND VALIDATE WORKBOOK STRUCTURE
// ======================================================

const readAndValidateWorkbook = async (
  fileBuffer
) => {
  const workbook = new ExcelJS.Workbook();

  try {
    await workbook.xlsx.load(fileBuffer);
  } catch (error) {
    console.error(
      "[Bulk Description] Workbook read error:",
      error
    );

    throw createServiceError(
      "The uploaded file is not a valid .xlsx workbook."
    );
  }

  const worksheet =
    workbook.getWorksheet(
      "Product Descriptions"
    ) || workbook.worksheets[0];

  if (!worksheet) {
    throw createServiceError(
      "The workbook does not contain a worksheet."
    );
  }

  if (worksheet.rowCount < 1) {
    throw createServiceError(
      "The uploaded worksheet is empty."
    );
  }

  const headerRow = worksheet.getRow(1);

  const actualHeaders =
    REQUIRED_HEADERS.map(
      (_, columnIndex) =>
        normalizeText(
          getCellValue(
            headerRow.getCell(
              columnIndex + 1
            )
          )
        )
    );

  const headersAreValid =
    REQUIRED_HEADERS.every(
      (requiredHeader, index) =>
        actualHeaders[index] ===
        requiredHeader
    );

  if (!headersAreValid) {
    throw createServiceError(
      `Invalid Excel format. Required columns are: ${REQUIRED_HEADERS.join(
        ", "
      )}.`
    );
  }

  if (
    worksheet.rowCount - 1 >
    MAX_IMPORT_ROWS
  ) {
    throw createServiceError(
      `The uploaded file exceeds ${MAX_IMPORT_ROWS} product rows.`
    );
  }

  return {
    workbook,
    worksheet,
  };
};

// ======================================================
// PARSE WORKBOOK ROWS
// ======================================================

const parseWorksheetRows = (
  worksheet
) => {
  const rows = [];

  worksheet.eachRow(
    { includeEmpty: false },
    (row, rowNumber) => {
      if (rowNumber === 1) {
        return;
      }

      const productIdValue =
        getCellValue(row.getCell(1));

      const categoryValue =
        getCellValue(row.getCell(2));

      const productValue =
        getCellValue(row.getCell(3));

      const longDescriptionValue =
        getCellValue(row.getCell(4));

      const shortDescriptionValue =
        getCellValue(row.getCell(5));

      const allCellsAreEmpty = [
        productIdValue,
        categoryValue,
        productValue,
        longDescriptionValue,
        shortDescriptionValue,
      ].every(
        (value) =>
          normalizeText(value) === ""
      );

      if (allCellsAreEmpty) {
        return;
      }

      const normalizedProductId =
        normalizeText(productIdValue);

      rows.push({
        row_number: rowNumber,

        // Keep this as a string in API responses.
        product_id: normalizedProductId,

        product_id_bigint:
          toBigIntId(normalizedProductId),

        category_name:
          normalizeText(categoryValue),

        product_name:
          normalizeText(productValue),

        long_description:
          normalizeText(
            longDescriptionValue
          ),

        short_description:
          normalizeText(
            shortDescriptionValue
          ),
      });
    }
  );

  return rows;
};

// ======================================================
// VALIDATE EXCEL
// ======================================================

const validateExcel = async ({
  categoryId,
  fileBuffer,
  originalFileName,
}) => {
  const category =
    await findCategoryById(categoryId);

  const { worksheet } =
    await readAndValidateWorkbook(
      fileBuffer
    );

  const uploadedRows =
    parseWorksheetRows(worksheet);

  if (!uploadedRows.length) {
    throw createServiceError(
      "The workbook does not contain any product rows."
    );
  }

  const validProductIds =
    uploadedRows
      .map(
        (row) =>
          row.product_id_bigint
      )
      .filter(
        (productId) =>
          productId !== null
      );

  const seenProductIds = new Set();
  const duplicateProductIds = new Set();

  validProductIds.forEach(
    (productId) => {
      const key = productId.toString();

      if (seenProductIds.has(key)) {
        duplicateProductIds.add(key);
      }

      seenProductIds.add(key);
    }
  );

  const uniqueProductIds = [
    ...new Map(
      validProductIds.map((id) => [
        id.toString(),
        id,
      ])
    ).values(),
  ];

  const databaseProducts =
    uniqueProductIds.length
      ? await prisma.stone_products.findMany({
          where: {
            id: {
              in: uniqueProductIds,
            },
          },

          select: {
            id: true,
            name: true,
            category_id: true,
            long_description: true,
            small_description: true,
          },
        })
      : [];

  const productMap = new Map(
    databaseProducts.map((product) => [
      product.id.toString(),
      product,
    ])
  );

  const rows = uploadedRows.map(
    (uploadedRow) => {
      const errors = [];

      if (
        !uploadedRow.product_id_bigint
      ) {
        errors.push(
          "Product ID is missing or invalid."
        );
      }

      if (
        uploadedRow.product_id &&
        duplicateProductIds.has(
          uploadedRow.product_id
        )
      ) {
        errors.push(
          "Duplicate Product ID found in the Excel file."
        );
      }

      if (!uploadedRow.category_name) {
        errors.push(
          "Category name is missing."
        );
      }

      if (!uploadedRow.product_name) {
        errors.push(
          "Product name is missing."
        );
      }

      const product =
        uploadedRow.product_id_bigint
          ? productMap.get(
              uploadedRow.product_id_bigint.toString()
            )
          : null;

      if (
        uploadedRow.product_id_bigint &&
        !product
      ) {
        errors.push(
          "Product does not exist."
        );
      }

      if (
        normalizeForComparison(
          uploadedRow.category_name
        ) !==
        normalizeForComparison(category.name)
      ) {
        errors.push(
          "Excel category does not match the selected category."
        );
      }

      if (
        product &&
        Number(product.category_id) !==
          Number(categoryId)
      ) {
        errors.push(
          "Product does not belong to the selected category."
        );
      }

      if (
        product &&
        normalizeForComparison(
          uploadedRow.product_name
        ) !==
          normalizeForComparison(
            product.name
          )
      ) {
        errors.push(
          "Product name was changed or does not match the database."
        );
      }

      const currentLongDescription =
        product
          ? normalizeText(
              product.long_description
            )
          : "";

      const currentShortDescription =
        product
          ? normalizeText(
              product.small_description
            )
          : "";

      const longDescriptionChanged =
        currentLongDescription !==
        uploadedRow.long_description;

      const shortDescriptionChanged =
        currentShortDescription !==
        uploadedRow.short_description;

      let status = "invalid";

      if (errors.length === 0) {
        status =
          longDescriptionChanged ||
          shortDescriptionChanged
            ? "changed"
            : "unchanged";
      }

      return {
        row_number:
          uploadedRow.row_number,

        product_id:
          uploadedRow.product_id,

        category_name:
          uploadedRow.category_name,

        product_name:
          uploadedRow.product_name,

        long_description:
          uploadedRow.long_description,

        short_description:
          uploadedRow.short_description,

        current_long_description:
          currentLongDescription,

        current_short_description:
          currentShortDescription,

        long_description_changed:
          longDescriptionChanged,

        short_description_changed:
          shortDescriptionChanged,

        status,
        errors,
      };
    }
  );

  const summary = rows.reduce(
    (result, row) => {
      result.total += 1;

      if (row.status === "changed") {
        result.changed += 1;
      } else if (
        row.status === "unchanged"
      ) {
        result.unchanged += 1;
      } else {
        result.invalid += 1;
      }

      if (
        !row.long_description &&
        !row.short_description
      ) {
        result.both_descriptions_empty += 1;
      }

      return result;
    },
    {
      total: 0,
      changed: 0,
      unchanged: 0,
      invalid: 0,
      both_descriptions_empty: 0,
    }
  );

  return {
    file_name: originalFileName,

    category: {
      id: category.id,
      name: category.name,
      slug: category.slug,
    },

    summary,
    rows,
  };
};

// ======================================================
// VALIDATE UPDATE REQUEST ROW
// ======================================================

const validateUpdatePayloadRow = (
  row,
  index
) => {
  const productId =
    toBigIntId(row.product_id);

  if (!productId) {
    return {
      valid: false,

      error: {
        row_index: index,
        product_id:
          row.product_id || null,

        message:
          "A valid product_id is required.",
      },
    };
  }

  return {
    valid: true,

    value: {
      product_id: productId,

      long_description:
        normalizeText(
          row.long_description
        ),

      short_description:
        normalizeText(
          row.short_description
        ),
    },
  };
};

// ======================================================
// BULK UPDATE
// ======================================================

const bulkUpdateDescriptions = async ({
  categoryId,
  rows,
}) => {
  if (rows.length > MAX_IMPORT_ROWS) {
    throw createServiceError(
      `A maximum of ${MAX_IMPORT_ROWS} products can be updated in one request.`
    );
  }

  const payloadErrors = [];
  const validRows = [];

  rows.forEach((row, index) => {
    const validation =
      validateUpdatePayloadRow(
        row,
        index
      );

    if (!validation.valid) {
      payloadErrors.push(
        validation.error
      );

      return;
    }

    validRows.push(
      validation.value
    );
  });

  const seenIds = new Set();
  const duplicateIds = new Set();

  validRows.forEach((row) => {
    const key =
      row.product_id.toString();

    if (seenIds.has(key)) {
      duplicateIds.add(key);
    }

    seenIds.add(key);
  });

  if (duplicateIds.size > 0) {
    throw createServiceError(
      `Duplicate Product IDs found: ${[
        ...duplicateIds,
      ].join(", ")}`
    );
  }

  if (!validRows.length) {
    return {
      requested: rows.length,
      valid_received: 0,
      updated: 0,
      unchanged: 0,
      failed: payloadErrors.length,
      errors: payloadErrors,
    };
  }

  return prisma.$transaction(
    async (tx) => {
      await findCategoryById(
        categoryId,
        tx
      );

      const productIds =
        validRows.map(
          (row) => row.product_id
        );

      const products =
        await tx.stone_products.findMany({
          where: {
            id: {
              in: productIds,
            },
          },

          select: {
            id: true,
            name: true,
            category_id: true,
            long_description: true,
            small_description: true,
          },
        });

      const productMap = new Map(
        products.map((product) => [
          product.id.toString(),
          product,
        ])
      );

      const errors = [
        ...payloadErrors,
      ];

      const updateRecords = [];

      let unchanged = 0;

      validRows.forEach((row) => {
        const product =
          productMap.get(
            row.product_id.toString()
          );

        if (!product) {
          errors.push({
            product_id:
              row.product_id.toString(),

            message:
              "Product does not exist.",
          });

          return;
        }

        if (
          Number(product.category_id) !==
          Number(categoryId)
        ) {
          errors.push({
            product_id:
              row.product_id.toString(),

            product_name:
              product.name,

            message:
              "Product does not belong to the selected category.",
          });

          return;
        }

        const currentLongDescription =
          normalizeText(
            product.long_description
          );

        const currentShortDescription =
          normalizeText(
            product.small_description
          );

        const hasChanged =
          currentLongDescription !==
            row.long_description ||
          currentShortDescription !==
            row.short_description;

        if (!hasChanged) {
          unchanged += 1;
          return;
        }

        updateRecords.push({
          id: row.product_id,

          long_description:
            row.long_description || null,

          // Excel "Short Description" maps to
          // database small_description.
          small_description:
            row.short_description || null,
        });
      });

      for (const record of updateRecords) {
        await tx.stone_products.update({
          where: {
            id: record.id,
          },

          data: {
            long_description:
              record.long_description,

            small_description:
              record.small_description,
          },
        });
      }

      return {
        requested: rows.length,
        valid_received:
          validRows.length,
        updated:
          updateRecords.length,
        unchanged,
        failed: errors.length,
        errors,
      };
    }
  );
};

// ======================================================

module.exports = {
  generateTemplate,
  validateExcel,
  bulkUpdateDescriptions,
};