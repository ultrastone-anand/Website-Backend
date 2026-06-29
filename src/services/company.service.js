const prisma = require("../config/prisma");
const auditService = require("./audit.service");

// ================== GET ALL SHOWROOMS ==================

const getCompany = async () => {

  return await prisma.showrooms.findMany({

    orderBy: [
      {
        display_order: "asc"
      },
      {
        created_at: "desc"
      }
    ]

  });

};

// ================== GET SHOWROOM BY ID ==================

const getCompanyById = async (id) => {

  const showroom =
    await prisma.showrooms.findUnique({

      where: {
        id: Number(id)
      }

    });

  if (!showroom) {

    throw new Error(
      "Showroom not found"
    );

  }

  return showroom;

};

// ================== CREATE SHOWROOM ==================

const createCompany = async (
  data,
  audit = {}
) => {

  const existingSlug =
    await prisma.showrooms.findUnique({

      where: {
        slug: data.slug
      }

    });

  if (existingSlug) {

    throw new Error(
      "Slug already exists"
    );

  }

  return await auditService.track({

    audit,

    action: "CREATE",

    resourceType: "SHOWROOM",

    moduleName:
      "Showroom Management",

    operation: () =>
      prisma.showrooms.create({

        data: {

          name:
            data.name,

          slug:
            data.slug,

          address:
            data.address,

          city:
            data.city,

          state:
            data.state,

          zip_code:
            data.zip_code,

          country:
            data.country,

          primary_phone:
            data.primary_phone,

          secondary_phone:
            data.secondary_phone,

          company_phone:
            data.company_phone,

          email:
            data.email,

          latitude:
            data.latitude,

          longitude:
            data.longitude,

          google_maps_url:
            data.google_maps_url,

          short_description:
            data.short_description,

          long_description:
            data.long_description,

          business_hours_mon_fri:
            data.business_hours_mon_fri,

          business_hours_saturday:
            data.business_hours_saturday,

          business_hours_sunday:
            data.business_hours_sunday,

          image_url:
            data.image_url,

          banner_image_url:
            data.banner_image_url,

          meta_title:
            data.meta_title,

          meta_description:
            data.meta_description,

          is_active:
            data.is_active ?? true,

          is_featured:
            data.is_featured ?? false,

          display_order:
            data.display_order ?? 0

        }

      })

  });

};

// ================== UPDATE SHOWROOM ==================

const updateCompany = async (
  id,
  data,
  audit = {}
) => {

  const existingShowroom =
    await prisma.showrooms.findUnique({

      where: {
        id: Number(id)
      }

    });

  if (!existingShowroom) {

    throw new Error(
      "Showroom not found"
    );

  }

  if (
    data.slug &&
    data.slug !== existingShowroom.slug
  ) {

    const slugExists =
      await prisma.showrooms.findUnique({

        where: {
          slug: data.slug
        }

      });

    if (slugExists) {

      throw new Error(
        "Slug already exists"
      );

    }

  }

  return await auditService.track({

    audit,

    action: "UPDATE",

    resourceType: "SHOWROOM",

    resourceId:
      existingShowroom.id,

    moduleName:
      "Showroom Management",

    oldValues:
      existingShowroom,

    operation: () =>
      prisma.showrooms.update({

        where: {
          id: Number(id)
        },

        data: {

          name:
            data.name,

          slug:
            data.slug,

          address:
            data.address,

          city:
            data.city,

          state:
            data.state,

          zip_code:
            data.zip_code,

          country:
            data.country,

          primary_phone:
            data.primary_phone,

          secondary_phone:
            data.secondary_phone,

          company_phone:
            data.company_phone,

          email:
            data.email,

          latitude:
            data.latitude,

          longitude:
            data.longitude,

          google_maps_url:
            data.google_maps_url,

          short_description:
            data.short_description,

          long_description:
            data.long_description,

          business_hours_mon_fri:
            data.business_hours_mon_fri,

          business_hours_saturday:
            data.business_hours_saturday,

          business_hours_sunday:
            data.business_hours_sunday,

          image_url:
            data.image_url,

          banner_image_url:
            data.banner_image_url,

          meta_title:
            data.meta_title,

          meta_description:
            data.meta_description,

          is_active:
            data.is_active,

          is_featured:
            data.is_featured,

          display_order:
            data.display_order,

          updated_at:
            new Date()

        }

      })

  });

};

// ================== DELETE SHOWROOM ==================

const deleteCompany = async (
  id,
  audit = {}
) => {

  const existingShowroom =
    await prisma.showrooms.findUnique({

      where: {
        id: Number(id)
      }

    });

  if (!existingShowroom) {

    throw new Error(
      "Showroom not found"
    );

  }

  return await auditService.track({

    audit,

    action: "DELETE",

    resourceType: "SHOWROOM",

    resourceId:
      existingShowroom.id,

    moduleName:
      "Showroom Management",

    oldValues:
      existingShowroom,

    operation: () =>
      prisma.showrooms.delete({

        where: {
          id: Number(id)
        }

      })

  });

};

// ================== GET ALL SOCIAL MEDIA ==================

const getAllSocialMedia = async () => {

  return await prisma.social_media_links.findMany({

    orderBy: [
      {
        display_order: "asc",
      },
      {
        created_at: "desc",
      },
    ],

  });

};

// ================== GET SOCIAL MEDIA BY ID ==================

const getSocialMedia = async (id) => {

  const socialMedia =
    await prisma.social_media_links.findUnique({

      where: {
        id: Number(id),
      },

    });

  if (!socialMedia) {

    throw new Error(
      "Social media record not found"
    );

  }

  return socialMedia;

};

// ================== CREATE SOCIAL MEDIA ==================

const createSocialMedia = async (
  data,
  audit = {}
) => {

 const existingPlatform =
  await prisma.social_media_links.findFirst({
    where: {
      platform: data.platform,
    },
  });
  
  if (existingPlatform) {

    throw new Error(
      "Platform already exists"
    );

  }

  return await auditService.track({

    audit,

    action: "CREATE",

    resourceType: "SOCIAL_MEDIA",

    moduleName:
      "Social Media Management",

    operation: () =>
      prisma.social_media_links.create({

        data: {

          platform:
            data.platform,

          url:
            data.url,

          display_order:
            data.display_order ?? 0,

          is_active:
            data.is_active ?? true,

        },

      }),

  });

};

// ================== UPDATE SOCIAL MEDIA ==================

const updateSocialMedia = async (
  id,
  data,
  audit = {}
) => {

  const existingSocialMedia =
    await prisma.social_media_links.findUnique({

      where: {
        id: Number(id),
      },

    });

  if (!existingSocialMedia) {

    throw new Error(
      "Social media record not found"
    );

  }

  if (
    data.platform &&
    data.platform !== existingSocialMedia.platform
  ) {

    const platformExists =
      await prisma.social_media_links.findUnique({

        where: {
          platform: data.platform,
        },

      });

    if (platformExists) {

      throw new Error(
        "Platform already exists"
      );

    }

  }

  return await auditService.track({

    audit,

    action: "UPDATE",

    resourceType: "SOCIAL_MEDIA",

    resourceId:
      existingSocialMedia.id,

    moduleName:
      "Social Media Management",

    oldValues:
      existingSocialMedia,

    operation: () =>
      prisma.social_media_links.update({

        where: {
          id: Number(id),
        },

        data: {

          platform:
            data.platform,

          url:
            data.url,

          display_order:
            data.display_order,

          is_active:
            data.is_active,

          updated_at:
            new Date(),

        },

      }),

  });

};

// ================== DELETE SOCIAL MEDIA ==================

const deleteSocialMedia = async (
  id,
  audit = {}
) => {

  const existingSocialMedia =
    await prisma.social_media_links.findUnique({

      where: {
        id: Number(id),
      },

    });

  if (!existingSocialMedia) {

    throw new Error(
      "Social media record not found"
    );

  }

  return await auditService.track({

    audit,

    action: "DELETE",

    resourceType: "SOCIAL_MEDIA",

    resourceId:
      existingSocialMedia.id,

    moduleName:
      "Social Media Management",

    oldValues:
      existingSocialMedia,

    operation: () =>
      prisma.social_media_links.delete({

        where: {
          id: Number(id),
        },

      }),

  });

};


module.exports = {
  // Showrooms
  getCompany,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,

  // Social Media
  getAllSocialMedia,
  getSocialMedia,
  createSocialMedia,
  updateSocialMedia,
  deleteSocialMedia,
};