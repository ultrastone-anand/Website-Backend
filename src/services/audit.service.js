const prisma = require("../config/prisma");

// ================== SANITIZE JSON ==================

const sanitizeJson = (obj) => {

  if (!obj) {
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

// ================== GET CHANGED FIELDS ==================

const getChangedFields = (
  oldValues = {},
  newValues = {}
) => {

  const changes = {};

  const keys = new Set([

    ...Object.keys(
      oldValues || {}
    ),

    ...Object.keys(
      newValues || {}
    )

  ]);

  for (const key of keys) {

    if (

      JSON.stringify(
        oldValues?.[key]
      ) !==

      JSON.stringify(
        newValues?.[key]
      )

    ) {

      changes[key] = {

        old:
          oldValues?.[key],

        new:
          newValues?.[key]

      };

    }

  }

  return changes;

};

// ================== AUDIT TRACKER ==================

const track = async ({

  audit = {},

  action,

  resourceType,

  resourceId,

  moduleName,

  oldValues = null,

  operation

}) => {

  // Execute actual DB operation

  const result =
    await operation();

  // Auto-pick ID for CREATE operations

  const finalResourceId =

    resourceId ||

    result?.id ||

    null;

  // Detect changed fields

  const changedFields =
    oldValues
      ? getChangedFields(
          oldValues,
          result
        )
      : null;


  // Save audit record

  await prisma.activity_logs.create({

    data: {

      user_id:
        audit.userId || null,

      created_by_name:
        audit.userName || null,

      action,

      resource_type:
        resourceType,

      resource_id:
        finalResourceId
          ? BigInt(
              finalResourceId
            )
          : null,

      old_values:
        sanitizeJson(
          oldValues
        ),

      new_values:
        sanitizeJson(
          result
        ),

      changed_fields:
        sanitizeJson(
          changedFields
        ),

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
        null

    }

  });

  return result;

};

module.exports = {
  track
};