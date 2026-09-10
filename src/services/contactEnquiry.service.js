const prisma = require(
  "../config/prisma"
);

/* =========================================================
   CREATE ENQUIRY
========================================================= */

const createEnquiry = async (
  data
) => {
  const requestType =
    String(
      data.requestType ||
        data.request_type ||
        "ENQUIRY"
    )
      .trim()
      .toUpperCase();

  return prisma.contact_enquiries.create({
    data: {
      name:
        data.name,

      subject:
        data.subject || null,

      email:
        data.email,

      phone:
        data.phone || null,

      message:
        data.message || null,

      request_type:
        requestType,

      preferred_date:
        requestType ===
          "APPOINTMENT" &&
        data.preferredDate
          ? new Date(
              `${data.preferredDate}T00:00:00.000Z`
            )
          : null,

      preferred_time:
        requestType ===
          "APPOINTMENT"
          ? data.preferredTime ||
            null
          : null,
    },
  });
};

/* =========================================================
   GET ALL ENQUIRIES
========================================================= */

const getAllEnquiries = async () => {
  return prisma.contact_enquiries.findMany({
    orderBy: {
      created_at:
        "desc",
    },
  });
};

/* =========================================================
   UPDATE STATUS
========================================================= */

const updateStatus = async (
  id,
  data
) => {
  const enquiry =
    await prisma.contact_enquiries.findUnique({
      where: {
        id:
          BigInt(id),
      },
    });

  if (!enquiry) {
    throw new Error(
      "Enquiry not found"
    );
  }

  return prisma.contact_enquiries.update({
    where: {
      id:
        BigInt(id),
    },

    data: {
      status:
        data.status,

      updated_at:
        new Date(),
    },
  });
};

module.exports = {
  createEnquiry,
  getAllEnquiries,
  updateStatus,
};