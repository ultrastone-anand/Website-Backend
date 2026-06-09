const prisma = require("../config/prisma");

const sanitizeJson = (obj) =>
  JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

const getActivities = async () => {
  const activities = await prisma.activity_logs.findMany({
    orderBy: {
      created_at: "desc",
    },
  });

  return sanitizeJson(activities);
};

module.exports = {
  getActivities,
};