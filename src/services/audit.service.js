const prisma = require("../config/prisma");

/* =========================================================
   JSON SANITIZER
========================================================= */

const sanitizeJson = (obj) => {
  if (
    obj === null ||
    obj === undefined
  ) {
    return null;
  }

  return JSON.parse(
    JSON.stringify(
      obj,
      (_, value) =>
        typeof value === "bigint"
          ? value.toString()
          : value
    )
  );
};

/* =========================================================
   NORMALIZE FOR COMPARISON
========================================================= */

const normalizeValue = (value) => {
  /*
   * Treat undefined as null because undefined disappears
   * from JSON anyway and should not create an audit change.
   */

  if (
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (value === null) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map(
      normalizeValue
    );
  }

  if (
    typeof value === "object"
  ) {
    return Object.keys(value)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] =
            normalizeValue(
              value[key]
            );

          return acc;
        },
        {}
      );
  }

  return value;
};

/* =========================================================
   VALUE COMPARISON
========================================================= */

const areEqual = (
  oldValue,
  newValue
) => {
  return (
    JSON.stringify(
      normalizeValue(
        oldValue
      )
    ) ===
    JSON.stringify(
      normalizeValue(
        newValue
      )
    )
  );
};

/* =========================================================
   GET CHANGED FIELDS
========================================================= */

const getChangedFields = (
  oldValues = {},
  newValues = {}
) => {
  const changes = {};

  const safeOld =
    oldValues &&
    typeof oldValues === "object"
      ? oldValues
      : {};

  const safeNew =
    newValues &&
    typeof newValues === "object"
      ? newValues
      : {};

  const keys =
    new Set([
      ...Object.keys(
        safeOld
      ),

      ...Object.keys(
        safeNew
      ),
    ]);

  for (const key of keys) {
    const oldValue =
      safeOld[key];

    const newValue =
      safeNew[key];

    if (
      !areEqual(
        oldValue,
        newValue
      )
    ) {
      changes[key] = {
        old:
          oldValue ??
          null,

        new:
          newValue ??
          null,
      };
    }
  }

  return changes;
};

/* =========================================================
   AUDIT TRACKER
========================================================= */

const track = async ({
  audit = {},

  action,

  resourceType,

  resourceId,

  moduleName,

  oldValues = null,

  operation,
}) => {
  /* -------------------------------------------------------
     SANITIZE OLD SNAPSHOT BEFORE OPERATION
  ------------------------------------------------------- */

  const sanitizedOldValues =
    sanitizeJson(
      oldValues
    );

  /* -------------------------------------------------------
     RUN OPERATION
  ------------------------------------------------------- */

  const result =
    await operation();

  /* -------------------------------------------------------
     SANITIZE RESULT
  ------------------------------------------------------- */

  const sanitizedResult =
    sanitizeJson(
      result
    );

  /* -------------------------------------------------------
     RESOURCE ID
  ------------------------------------------------------- */

  const finalResourceId =
    resourceId ||
    sanitizedResult?.id ||
    null;

  /* -------------------------------------------------------
     CHANGED FIELDS
  ------------------------------------------------------- */

  let changedFields =
    null;

  if (
    sanitizedOldValues !==
      null &&
    sanitizedResult !==
      null &&
    typeof sanitizedOldValues ===
      "object" &&
    typeof sanitizedResult ===
      "object" &&
    !Array.isArray(
      sanitizedOldValues
    ) &&
    !Array.isArray(
      sanitizedResult
    )
  ) {
    const detected =
      getChangedFields(
        sanitizedOldValues,
        sanitizedResult
      );

    /*
     * Don't store an empty object as changed_fields.
     */
    changedFields =
      Object.keys(
        detected
      ).length > 0
        ? detected
        : null;
  }

  /* -------------------------------------------------------
     SAVE ACTIVITY
  ------------------------------------------------------- */

  await prisma.activity_logs.create({
    data: {
      user_id:
        audit.userId ||
        null,

      created_by_name:
        audit.userName ||
        null,

      action,

      resource_type:
        resourceType,

      resource_id:
        finalResourceId !==
          null &&
        finalResourceId !==
          undefined
          ? BigInt(
              finalResourceId
            )
          : null,

      old_values:
        sanitizedOldValues,

      new_values:
        sanitizedResult,

      changed_fields:
        changedFields,

      module_name:
        moduleName,

      ip_address:
        audit.ipAddress ||
        null,

      user_agent:
        audit.userAgent ||
        null,

      request_id:
        audit.requestId ||
        null,
    },
  });

  return result;
};

module.exports = {
  track,
  getChangedFields,
};