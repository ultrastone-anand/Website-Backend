const prisma = require("../config/prisma");

// ================== GET ALL LOOKUPS ==================

const getLookups = async () => {

  return await prisma.sys_lookup.findMany({

    where: {
      is_active: true
    },

    include: {

      sys_lookup_details: {

        where: {
          is_active: true
        },

        orderBy: {
          display_order: "asc"
        }

      }

    },

    orderBy: {
      display_order: "asc"
    }

  });

};

// ================== GET LOOKUP BY ID ==================

const getLookupById = async (
  id
) => {

  const lookup =
    await prisma.sys_lookup.findUnique({

      where: {
        id: Number(id)
      },

      include: {

        sys_lookup_details: {

          where: {
            is_active: true
          },

          orderBy: {
            display_order: "asc"
          }

        }

      }

    });

  if (!lookup) {

    throw new Error(
      "Lookup not found"
    );

  }

  return lookup;

};

// ================== GET LOOKUP BY CODE ==================

const getLookupByCode = async (
  code
) => {

  const lookup =
    await prisma.sys_lookup.findFirst({

      where: {

        lookup_code:
          code.toUpperCase(),

        is_active: true

      },

      include: {

        sys_lookup_details: {

          where: {
            is_active: true
          },

          orderBy: {
            display_order: "asc"
          }

        }

      }

    });

  if (!lookup) {

    throw new Error(
      "Lookup not found"
    );

  }

  return lookup;

};

// ================== CREATE LOOKUP ==================

const createLookup = async (
  data
) => {

  const existing =
    await prisma.sys_lookup.findFirst({

      where: {

        lookup_code:
          data.lookup_code

      }

    });

  if (existing) {

    throw new Error(
      "Lookup code already exists"
    );

  }

  return await prisma.sys_lookup.create({

    data: {

      lookup_code:
        data.lookup_code.toUpperCase(),

      lookup_name:
        data.lookup_name,

      description:
        data.description,

      display_order:
        data.display_order || 1,

      is_active:
        data.is_active ?? true

    }

  });

};

// ================== UPDATE LOOKUP ==================

const updateLookup = async (
  id,
  data
) => {

  const lookup =
    await prisma.sys_lookup.findUnique({

      where: {
        id: Number(id)
      }

    });

  if (!lookup) {

    throw new Error(
      "Lookup not found"
    );

  }

  return await prisma.sys_lookup.update({

    where: {
      id: Number(id)
    },

    data: {

      lookup_name:
        data.lookup_name,

      description:
        data.description,

      display_order:
        data.display_order,

      is_active:
        data.is_active,

      updated_at:
        new Date()

    }

  });

};

// ================== DELETE LOOKUP ==================
// SOFT DELETE

const deleteLookup = async (
  id
) => {

  const lookup =
    await prisma.sys_lookup.findUnique({

      where: {
        id: Number(id)
      }

    });

  if (!lookup) {

    throw new Error(
      "Lookup not found"
    );

  }

  return await prisma.sys_lookup.update({

    where: {
      id: Number(id)
    },

    data: {

      is_active: false,

      updated_at:
        new Date()

    }

  });

};

// ================== GET DETAILS ==================

const getLookupDetails = async (
  lookupId
) => {

  return await prisma.sys_lookup_details.findMany({

    where: {

      lookup_id:
        Number(lookupId),

      is_active: true

    },

    orderBy: {
      display_order: "asc"
    }

  });

};

// ================== CREATE DETAIL ==================

const createLookupDetail = async (
  lookupId,
  data
) => {

  const lookup =
    await prisma.sys_lookup.findUnique({

      where: {
        id: Number(lookupId)
      }

    });

  if (!lookup) {

    throw new Error(
      "Lookup not found"
    );

  }

  return await prisma.sys_lookup_details.create({

    data: {

      lookup_id:
        Number(lookupId),

      value_code:
        data.value_code,

      value_name:
        data.value_name,

      description:
        data.description,

      display_order:
        data.display_order || 1,

      is_active:
        data.is_active ?? true

    }

  });

};

// ================== UPDATE DETAIL ==================

const updateLookupDetail = async (
  id,
  data
) => {

  const detail =
    await prisma.sys_lookup_details.findUnique({

      where: {
        id: Number(id)
      }

    });

  if (!detail) {

    throw new Error(
      "Lookup detail not found"
    );

  }

  return await prisma.sys_lookup_details.update({

    where: {
      id: Number(id)
    },

    data: {

      value_code:
        data.value_code,

      value_name:
        data.value_name,

      description:
        data.description,

      display_order:
        data.display_order,

      is_active:
        data.is_active,

      updated_at:
        new Date()

    }

  });

};

// ================== DELETE DETAIL ==================
// SOFT DELETE

const deleteLookupDetail = async (
  id
) => {

  const detail =
    await prisma.sys_lookup_details.findUnique({

      where: {
        id: Number(id)
      }

    });

  if (!detail) {

    throw new Error(
      "Lookup detail not found"
    );

  }

  return await prisma.sys_lookup_details.update({

    where: {
      id: Number(id)
    },

    data: {

      is_active: false,

      updated_at:
        new Date()

    }

  });

};

module.exports = {

  getLookups,

  getLookupById,

  getLookupByCode,

  createLookup,

  updateLookup,

  deleteLookup,

  getLookupDetails,

  createLookupDetail,

  updateLookupDetail,

  deleteLookupDetail

};