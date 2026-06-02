// services/activityLog.service.js

const prisma = require("../config/prisma");

const serialize = (obj) =>
  JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint"
        ? value.toString()
        : value
    )
  );

const getChanges = (oldData, newData) => {

  const changes = {};

  const keys = new Set([
    ...Object.keys(oldData || {}),
    ...Object.keys(newData || {}),
  ]);

  for (const key of keys) {

    if (
      JSON.stringify(oldData?.[key]) !==
      JSON.stringify(newData?.[key])
    ) {

      changes[key] = {
        old: oldData?.[key] ?? null,
        new: newData?.[key] ?? null,
      };

    }

  }

  return changes;

};

const createActivityLog = async ({
  userId,
  userName,
  action,
  moduleName,
  resourceType,
  resourceId,
  description,
  oldValues,
  newValues,
  ipAddress,
  userAgent,
}) => {

  await prisma.activity_logs.create({

    data: {

      user_id: userId,

      created_by_name: userName,

      action,

      module_name: moduleName,

      resource_type: resourceType,

      resource_id: Number(resourceId),

      description,

      old_values: serialize(oldValues),

      new_values: serialize(newValues),

      changed_fields: getChanges(
        serialize(oldValues || {}),
        serialize(newValues || {})
      ),

      ip_address: ipAddress,

      user_agent: userAgent,

    },

  });

};

module.exports = {
  createActivityLog,
};