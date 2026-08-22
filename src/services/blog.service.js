const prisma = require("../config/prisma");
const auditService = require("./audit.service");

const deleteFileFromR2 = require("../utils/uploadToR2");
const { createR2UploadUrl } = require("../utils/r2Presigned");
// ========================================================
// CONSTANTS
// ========================================================

const BLOG_STATUSES = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED"
];

const BLOG_MEDIA_TYPES = [
  "COVER",
  "CONTENT"
];

// ========================================================
// HELPERS
// ========================================================

const generateSlug = (value = "") => {

  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

};

// ========================================================

const getUniqueSlug = async (
  title,
  excludePostId = null
) => {

  const baseSlug =
    generateSlug(title) ||
    `blog-${Date.now()}`;

  let slug = baseSlug;
  let counter = 1;

  while (true) {

    const where = {
      slug
    };

    if (excludePostId) {

      where.id = {
        not: BigInt(excludePostId)
      };

    }

    const existing =
      await prisma.blog_posts.findFirst({
        where,
        select: {
          id: true
        }
      });

    if (!existing) {
      return slug;
    }

    slug =
      `${baseSlug}-${counter}`;

    counter += 1;

  }

};

// ========================================================

const normalizeTags = (tags) => {

  if (!Array.isArray(tags)) {
    return [];
  }

  const normalized = tags
    .map((tag) => {

      if (typeof tag === "string") {
        return tag.trim();
      }

      if (
        tag &&
        typeof tag === "object"
      ) {

        return String(
          tag.name || ""
        ).trim();

      }

      return "";

    })
    .filter(Boolean);

  return [
    ...new Set(normalized)
  ];

};

// ========================================================

const validateStatus = (status) => {

  if (
    status &&
    !BLOG_STATUSES.includes(status)
  ) {

    throw new Error(
      "Invalid blog status"
    );

  }

};

// ========================================================

const validateMediaItem = (
  media,
  mediaType
) => {

  if (
    !media ||
    typeof media !== "object"
  ) {

    if (mediaType === "COVER") {
      throw new Error(
        "Invalid cover media"
      );
    }

    throw new Error(
      "Invalid content media"
    );

  }

  const url =
    media.url ||
    media.secure_url;

  const objectKey =
    media.objectKey ||
    media.object_key ||
    media.public_id;

  if (
    !url ||
    !objectKey
  ) {

    if (mediaType === "COVER") {

      throw new Error(
        "Invalid cover media"
      );

    }

    throw new Error(
      "Invalid content media"
    );

  }

  return {

    media_type:
      mediaType,

    url,

    object_key:
      objectKey,

    filename:
      media.filename || null,

    mime_type:
      media.mimeType ||
      media.mime_type ||
      media.contentType ||
      null,

    alt_text:
      media.altText ||
      media.alt_text ||
      null,

    caption:
      media.caption ||
      null,

    width:
      media.width
        ? Number(media.width)
        : null,

    height:
      media.height
        ? Number(media.height)
        : null,

    size_bytes:
      media.sizeBytes ||
      media.size_bytes
        ? BigInt(
            media.sizeBytes ||
            media.size_bytes
          )
        : null,

    sort_order:
      Number(
        media.sortOrder ??
        media.sort_order ??
        0
      )

  };

};

// ========================================================

const serializeBigInt = (value) => {

  if (value === null) {
    return null;
  }

  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "bigint") {

    const converted =
      Number(value);

    if (
      Number.isSafeInteger(converted)
    ) {

      return converted;

    }

    return value.toString();

  }

  if (Array.isArray(value)) {

    return value.map(
      serializeBigInt
    );

  }

  if (
    typeof value === "object" &&
    !(value instanceof Date)
  ) {

    return Object.fromEntries(

      Object.entries(value)
        .map(([key, item]) => [

          key,

          serializeBigInt(item)

        ])

    );

  }

  return value;

};

// ========================================================

const getAuthorId = (user = {}) => {

  if (user.id) {
    return BigInt(user.id);
  }

  return null;

};

// ========================================================

const buildBlogResponse = async (
  post
) => {

  if (!post) {
    return null;
  }

  const postId =
    BigInt(post.id);

  const [
    media,
    postTags
  ] = await Promise.all([

    prisma.blog_media.findMany({

      where: {
        post_id: postId
      },

      orderBy: [
        {
          media_type: "asc"
        },
        {
          sort_order: "asc"
        }
      ]

    }),

    prisma.blog_post_tags.findMany({

      where: {
        post_id: postId
      },

      select: {

        tag_id: true

      }

    })

  ]);

  const tagIds =
    postTags.map(
      (item) => item.tag_id
    );

  let tags = [];

  if (tagIds.length) {

    tags =
      await prisma.blog_tags.findMany({

        where: {

          id: {
            in: tagIds
          }

        },

        orderBy: {
          name: "asc"
        }

      });

  }

  const cover =
    media.find(
      (item) =>
        item.media_type ===
        "COVER"
    ) || null;

  const contentMedia =
    media.filter(
      (item) =>
        item.media_type ===
        "CONTENT"
    );

  return serializeBigInt({

    ...post,

    cover,

    content_media:
      contentMedia,

    tags

  });

};

// ========================================================
// GET ALL BLOGS
// ========================================================

const getBlogs = async (
  filters = {}
) => {

  const page =
    Math.max(
      Number(filters.page) || 1,
      1
    );

  const limit =
    Math.min(
      Math.max(
        Number(filters.limit) || 20,
        1
      ),
      100
    );

  const skip =
    (page - 1) * limit;

  const where = {

    deleted_at: null

  };

  if (filters.status) {

    const status =
      String(
        filters.status
      ).toUpperCase();

    validateStatus(status);

    where.status =
      status;

  }

  if (filters.search) {

    const search =
      String(
        filters.search
      ).trim();

    if (search) {

      where.OR = [

        {
          title: {
            contains: search,
            mode: "insensitive"
          }
        },

        {
          description: {
            contains: search,
            mode: "insensitive"
          }
        },

        {
          slug: {
            contains: search,
            mode: "insensitive"
          }
        }

      ];

    }

  }

  if (filters.tag) {

    const tagValue =
      String(
        filters.tag
      ).trim();

    const matchingTag =
      await prisma.blog_tags.findFirst({

        where: {

          OR: [

            {
              slug: tagValue
            },

            {
              name: {
                equals: tagValue,
                mode: "insensitive"
              }
            }

          ]

        },

        select: {
          id: true
        }

      });

    if (!matchingTag) {

      return {

        data: [],

        pagination: {

          page,

          limit,

          total: 0,

          totalPages: 0

        }

      };

    }

    const mappings =
      await prisma.blog_post_tags.findMany({

        where: {
          tag_id:
            matchingTag.id
        },

        select: {
          post_id: true
        }

      });

    where.id = {

      in:
        mappings.map(
          (item) =>
            item.post_id
        )

    };

  }

  const [
    posts,
    total
  ] = await Promise.all([

    prisma.blog_posts.findMany({

      where,

      skip,

      take:
        limit,

      orderBy: [
        {
          published_at: "desc"
        },
        {
          created_at: "desc"
        }
      ]

    }),

    prisma.blog_posts.count({
      where
    })

  ]);

  const data =
    await Promise.all(

      posts.map(
        (post) =>
          buildBlogResponse(post)
      )

    );

  return {

    data,

    pagination: {

      page,

      limit,

      total,

      totalPages:
        Math.ceil(
          total / limit
        )

    }

  };

};

// ========================================================
// GET BLOG BY ID
// ========================================================

const getBlogById = async (
  blogId
) => {

  const value =
    String(
      blogId || ""
    ).trim();

  if (!value) {

    throw new Error(
      "Blog post not found"
    );

  }

  const isNumeric =
    /^\d+$/.test(value);

  const post =
    await prisma.blog_posts.findFirst({

      where: {

        deleted_at:
          null,

        ...(isNumeric
          ? {
              id:
                BigInt(value)
            }
          : {
              slug:
                value
            })

      }

    });

  if (!post) {

    throw new Error(
      "Blog post not found"
    );

  }

  return buildBlogResponse(
    post
  );

};

// ========================================================
// CREATE TAG RECORDS
// ========================================================

const createTagMappings = async (
  transaction,
  postId,
  tagNames
) => {

  const normalizedTags =
    normalizeTags(tagNames);

  for (
    const tagName
    of normalizedTags
  ) {

    const slug =
      generateSlug(tagName);

    if (!slug) {
      continue;
    }

    const tag =
      await transaction.blog_tags.upsert({

        where: {
          slug
        },

        update: {
          name:
            tagName
        },

        create: {

          name:
            tagName,

          slug

        }

      });

    await transaction.blog_post_tags.create({

      data: {

        post_id:
          postId,

        tag_id:
          tag.id

      }

    });

  }

};

// ========================================================
// CREATE BLOG
// ========================================================

const createBlog = async (
  data,
  user = {},
  audit = {}
) => {

  if (
    !data.title ||
    !String(data.title).trim()
  ) {

    throw new Error(
      "Blog title is required"
    );

  }

  if (
    !data.content ||
    !String(data.content).trim()
  ) {

    throw new Error(
      "Blog content is required"
    );

  }

  let status =
    data.status;

  if (!status) {

    status =
      data.published
        ? "PUBLISHED"
        : "DRAFT";

  }

  status =
    String(status).toUpperCase();

  validateStatus(status);

  const slug =
    await getUniqueSlug(
      data.slug ||
      data.title
    );

  let coverMedia = null;

  if (data.coverMedia) {

    coverMedia =
      validateMediaItem(
        data.coverMedia,
        "COVER"
      );

  }

  const contentMedia =
    Array.isArray(
      data.contentMedia
    )
      ? data.contentMedia.map(
          (media, index) => {

            const normalized =
              validateMediaItem(
                media,
                "CONTENT"
              );

            normalized.sort_order =
              Number(
                media.sortOrder ??
                media.sort_order ??
                index
              );

            return normalized;

          }
        )
      : [];

  const authorId =
    getAuthorId(user);

  const publishedAt =
    status === "PUBLISHED"
      ? new Date()
      : null;

  return auditService.track({

    audit,

    action:
      "CREATE",

    resourceType:
      "BLOG",

    moduleName:
      "Blog Management",

    operation: async () => {

      const createdPost =
        await prisma.$transaction(
          async (transaction) => {

            const post =
              await transaction.blog_posts.create({

                data: {

                  title:
                    String(
                      data.title
                    ).trim(),

                  slug,

                  description:
                    data.description
                      ? String(
                          data.description
                        ).trim()
                      : null,

                  content:
                    data.content,

                  status,

                  meta_title:
                    data.metaTitle ||
                    data.meta_title ||
                    null,

                  meta_description:
                    data.metaDescription ||
                    data.meta_description ||
                    null,

                  meta_keywords:
                    data.metaKeywords ||
                    data.meta_keywords ||
                    null,

                  author_id:
                    authorId,

                  published_at:
                    publishedAt

                }

              });

            if (coverMedia) {

              await transaction.blog_media.create({

                data: {

                  post_id:
                    post.id,

                  ...coverMedia

                }

              });

            }

            if (
              contentMedia.length
            ) {

              await transaction.blog_media.createMany({

                data:
                  contentMedia.map(
                    (media) => ({

                      post_id:
                        post.id,

                      ...media

                    })
                  )

              });

            }

            await createTagMappings(

              transaction,

              post.id,

              data.tags || []

            );

            return post;

          }
        );

      return buildBlogResponse(
        createdPost
      );

    }

  });

};

// ========================================================
// UPDATE BLOG
// ========================================================

const updateBlog = async (
  blogId,
  data,
  user = {},
  audit = {}
) => {

  const postId =
    BigInt(blogId);

  const existingPost =
    await prisma.blog_posts.findFirst({

      where: {

        id:
          postId,

        deleted_at:
          null

      }

    });

  if (!existingPost) {

    throw new Error(
      "Blog post not found"
    );

  }

  if (
    data.title !== undefined &&
    !String(data.title).trim()
  ) {

    throw new Error(
      "Blog title is required"
    );

  }

  if (
    data.content !== undefined &&
    !String(data.content).trim()
  ) {

    throw new Error(
      "Blog content is required"
    );

  }

  let status =
    data.status;

  if (
    status === undefined &&
    data.published !== undefined
  ) {

    status =
      data.published
        ? "PUBLISHED"
        : "DRAFT";

  }

  if (status !== undefined) {

    status =
      String(status).toUpperCase();

    validateStatus(status);

  }

  let slug =
    existingPost.slug;

  if (
    data.slug !== undefined ||
    data.title !== undefined
  ) {

    slug =
      await getUniqueSlug(

        data.slug ||
        data.title ||
        existingPost.title,

        postId

      );

  }

  const oldMedia =
    await prisma.blog_media.findMany({

      where: {
        post_id:
          postId
      }

    });

  const oldObjectKeysToDelete =
    [];

  let coverMedia = null;

  if (
    data.coverMedia !== undefined &&
    data.coverMedia !== null
  ) {

    coverMedia =
      validateMediaItem(
        data.coverMedia,
        "COVER"
      );

  }

  const hasContentMediaUpdate =
    data.contentMedia !== undefined;

  let contentMedia = [];

  if (hasContentMediaUpdate) {

    if (
      !Array.isArray(
        data.contentMedia
      )
    ) {

      throw new Error(
        "Invalid content media"
      );

    }

    contentMedia =
      data.contentMedia.map(
        (media, index) => {

          const normalized =
            validateMediaItem(
              media,
              "CONTENT"
            );

          normalized.sort_order =
            Number(
              media.sortOrder ??
              media.sort_order ??
              index
            );

          return normalized;

        }
      );

  }

  const updateData = {

    updated_at:
      new Date()

  };

  if (data.title !== undefined) {

    updateData.title =
      String(
        data.title
      ).trim();

  }

  if (data.description !== undefined) {

    updateData.description =
      data.description
        ? String(
            data.description
          ).trim()
        : null;

  }

  if (data.content !== undefined) {

    updateData.content =
      data.content;

  }

  if (slug !== existingPost.slug) {

    updateData.slug =
      slug;

  }

  if (status !== undefined) {

    updateData.status =
      status;

    if (
      status === "PUBLISHED" &&
      !existingPost.published_at
    ) {

      updateData.published_at =
        new Date();

    }

    if (
      status !== "PUBLISHED"
    ) {

      updateData.published_at =
        null;

    }

  }

  if (
    data.metaTitle !== undefined ||
    data.meta_title !== undefined
  ) {

    updateData.meta_title =
      data.metaTitle ||
      data.meta_title ||
      null;

  }

  if (
    data.metaDescription !== undefined ||
    data.meta_description !== undefined
  ) {

    updateData.meta_description =
      data.metaDescription ||
      data.meta_description ||
      null;

  }

  if (
    data.metaKeywords !== undefined ||
    data.meta_keywords !== undefined
  ) {

    updateData.meta_keywords =
      data.metaKeywords ||
      data.meta_keywords ||
      null;

  }

  return auditService.track({

    audit,

    action:
      "UPDATE",

    resourceType:
      "BLOG",

    resourceId:
      serializeBigInt(
        existingPost.id
      ),

    moduleName:
      "Blog Management",

    oldValues:
      serializeBigInt(
        existingPost
      ),

    operation: async () => {

      const updatedPost =
        await prisma.$transaction(
          async (transaction) => {

            const post =
              await transaction.blog_posts.update({

                where: {
                  id:
                    postId
                },

                data:
                  updateData

              });

            if (
              data.coverMedia !== undefined
            ) {

              const existingCover =
                oldMedia.find(
                  (media) =>
                    media.media_type ===
                    "COVER"
                );

              if (existingCover) {

                await transaction.blog_media.delete({

                  where: {
                    id:
                      existingCover.id
                  }

                });

                if (
                  existingCover.object_key &&
                  (
                    !coverMedia ||
                    existingCover.object_key !==
                    coverMedia.object_key
                  )
                ) {

                  oldObjectKeysToDelete.push(
                    existingCover.object_key
                  );

                }

              }

              if (coverMedia) {

                await transaction.blog_media.create({

                  data: {

                    post_id:
                      postId,

                    ...coverMedia

                  }

                });

              }

            }

            if (hasContentMediaUpdate) {

              const existingContentMedia =
                oldMedia.filter(
                  (media) =>
                    media.media_type ===
                    "CONTENT"
                );

              const newObjectKeys =
                new Set(

                  contentMedia.map(
                    (media) =>
                      media.object_key
                  )

                );

              existingContentMedia
                .filter(
                  (media) =>
                    !newObjectKeys.has(
                      media.object_key
                    )
                )
                .forEach(
                  (media) => {

                    oldObjectKeysToDelete.push(
                      media.object_key
                    );

                  }
                );

              await transaction.blog_media.deleteMany({

                where: {

                  post_id:
                    postId,

                  media_type:
                    "CONTENT"

                }

              });

              if (
                contentMedia.length
              ) {

                await transaction.blog_media.createMany({

                  data:
                    contentMedia.map(
                      (media) => ({

                        post_id:
                          postId,

                        ...media

                      })
                    )

                });

              }

            }

            if (
              data.tags !== undefined
            ) {

              await transaction.blog_post_tags.deleteMany({

                where: {
                  post_id:
                    postId
                }

              });

              await createTagMappings(

                transaction,

                postId,

                data.tags

              );

            }

            return post;

          }
        );

      for (
        const objectKey
        of oldObjectKeysToDelete
      ) {

        await deleteFileFromR2(
          objectKey
        ).catch(
          (error) => {

            console.error(
              "Failed to delete replaced blog media:",
              error.message
            );

          }
        );

      }

      return buildBlogResponse(
        updatedPost
      );

    }

  });

};

// ========================================================
// DELETE BLOG
// Soft delete
// ========================================================

const deleteBlog = async (
  blogId,
  user = {},
  audit = {}
) => {

  const postId =
    BigInt(blogId);

  const existingPost =
    await prisma.blog_posts.findFirst({

      where: {

        id:
          postId,

        deleted_at:
          null

      }

    });

  if (!existingPost) {

    throw new Error(
      "Blog post not found"
    );

  }

  return auditService.track({

    audit,

    action:
      "DELETE",

    resourceType:
      "BLOG",

    resourceId:
      serializeBigInt(
        existingPost.id
      ),

    moduleName:
      "Blog Management",

    oldValues:
      serializeBigInt(
        existingPost
      ),

    operation: () =>
      prisma.blog_posts.update({

        where: {
          id:
            postId
        },

        data: {

          deleted_at:
            new Date(),

          status:
            "ARCHIVED",

          updated_at:
            new Date()

        }

      })

  });

};

// ========================================================
// PUBLISH BLOG
// ========================================================

const publishBlog = async (
  blogId,
  user = {},
  audit = {}
) => {

  const postId =
    BigInt(blogId);

  const existingPost =
    await prisma.blog_posts.findFirst({

      where: {

        id:
          postId,

        deleted_at:
          null

      }

    });

  if (!existingPost) {

    throw new Error(
      "Blog post not found"
    );

  }

  return auditService.track({

    audit,

    action:
      "PUBLISH",

    resourceType:
      "BLOG",

    resourceId:
      serializeBigInt(
        existingPost.id
      ),

    moduleName:
      "Blog Management",

    oldValues:
      serializeBigInt(
        existingPost
      ),

    operation: async () => {

      const post =
        await prisma.blog_posts.update({

          where: {
            id:
              postId
          },

          data: {

            status:
              "PUBLISHED",

            published_at:
              existingPost.published_at ||
              new Date(),

            updated_at:
              new Date()

          }

        });

      return buildBlogResponse(
        post
      );

    }

  });

};

// ========================================================
// MOVE BLOG TO DRAFT
// ========================================================

const draftBlog = async (
  blogId,
  user = {},
  audit = {}
) => {

  const postId =
    BigInt(blogId);

  const existingPost =
    await prisma.blog_posts.findFirst({

      where: {

        id:
          postId,

        deleted_at:
          null

      }

    });

  if (!existingPost) {

    throw new Error(
      "Blog post not found"
    );

  }

  return auditService.track({

    audit,

    action:
      "UPDATE",

    resourceType:
      "BLOG",

    resourceId:
      serializeBigInt(
        existingPost.id
      ),

    moduleName:
      "Blog Management",

    oldValues:
      serializeBigInt(
        existingPost
      ),

    operation: async () => {

      const post =
        await prisma.blog_posts.update({

          where: {
            id:
              postId
          },

          data: {

            status:
              "DRAFT",

            published_at:
              null,

            updated_at:
              new Date()

          }

        });

      return buildBlogResponse(
        post
      );

    }

  });

};

// ========================================================
// ARCHIVE BLOG
// ========================================================

const archiveBlog = async (
  blogId,
  user = {},
  audit = {}
) => {

  const postId =
    BigInt(blogId);

  const existingPost =
    await prisma.blog_posts.findFirst({

      where: {

        id:
          postId,

        deleted_at:
          null

      }

    });

  if (!existingPost) {

    throw new Error(
      "Blog post not found"
    );

  }

  return auditService.track({

    audit,

    action:
      "UPDATE",

    resourceType:
      "BLOG",

    resourceId:
      serializeBigInt(
        existingPost.id
      ),

    moduleName:
      "Blog Management",

    oldValues:
      serializeBigInt(
        existingPost
      ),

    operation: async () => {

      const post =
        await prisma.blog_posts.update({

          where: {
            id:
              postId
          },

          data: {

            status:
              "ARCHIVED",

            updated_at:
              new Date()

          }

        });

      return buildBlogResponse(
        post
      );

    }

  });

};

// ========================================================
// GET TAGS
// ========================================================

const getTags = async () => {

  const tags =
    await prisma.blog_tags.findMany({

      orderBy: {
        name:
          "asc"
      }

    });

  return serializeBigInt(
    tags
  );

};

// ========================================================
// CREATE TAG
// ========================================================

const createTag = async (
  data,
  user = {},
  audit = {}
) => {

  if (
    !data.name ||
    !String(data.name).trim()
  ) {

    throw new Error(
      "Tag name is required"
    );

  }

  const name =
    String(
      data.name
    ).trim();

  const slug =
    generateSlug(
      data.slug ||
      name
    );

  return auditService.track({

    audit,

    action:
      "CREATE",

    resourceType:
      "BLOG_TAG",

    moduleName:
      "Blog Management",

    operation: async () => {

      const tag =
        await prisma.blog_tags.create({

          data: {

            name,

            slug

          }

        });

      return serializeBigInt(
        tag
      );

    }

  });

};

// ========================================================
// GENERATE R2 PRESIGNED UPLOAD URL
// ========================================================

const generateUploadUrl = async (
  data,
  user = {}
) => {

  const filename =
    data.filename ||
    data.fileName;

  if (
    !filename ||
    !String(filename).trim()
  ) {

    throw new Error(
      "Filename is required"
    );

  }

  const mediaType =
    String(
      data.mediaType ||
      data.media_type ||
      "CONTENT"
    ).toUpperCase();

  if (
    !BLOG_MEDIA_TYPES.includes(
      mediaType
    )
  ) {

    throw new Error(
      "Invalid media type"
    );

  }

  let folder =
    "blog/content";

  if (
    mediaType ===
    "COVER"
  ) {

    folder =
      "blog/covers";

  }

  if (data.folder) {

    const safeFolder =
      String(
        data.folder
      )
        .replace(/\.\./g, "")
        .replace(/^\/+|\/+$/g, "");

    if (safeFolder) {

      folder =
        `blog/${safeFolder}`;

    }

  }

  const upload =
    await createR2UploadUrl(

      filename,

      folder

    );

  return {

    uploadUrl:
      upload.uploadUrl,

    publicUrl:
      upload.secure_url,

    objectKey:
      upload.public_id,

    secure_url:
      upload.secure_url,

    public_id:
      upload.public_id,

    contentType:
      upload.contentType,

    mediaType

  };

};

// ========================================================
// EXPORTS
// ========================================================

module.exports = {

  getBlogs,

  getBlogById,

  createBlog,

  updateBlog,

  deleteBlog,

  publishBlog,

  draftBlog,

  archiveBlog,

  getTags,

  createTag,

  generateUploadUrl

};