const prisma = require('../config/prisma');

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 30;

const PRODUCT_MEDIA_PRIORITY = [
  "CLOSEUP_IMAGE",
  "SLAB_IMAGE",
  "APPLICATION_IMAGE",
  "BOOKMATCH_SLIPMATCH",
];

const normalizeLimit = (limit) => {
  const parsedLimit = Number.parseInt(limit, 10);

  if (!Number.isFinite(parsedLimit) || parsedLimit <= 0) {
    return DEFAULT_LIMIT;
  }

  return Math.min(parsedLimit, MAX_LIMIT);
};

const normalizeQuery = (query) =>
  String(query || "")
    .trim()
    .replace(/\s+/g, " ");

const getPreferredProductImage = (media = []) => {
  if (!Array.isArray(media) || media.length === 0) {
    return null;
  }

  for (const mediaType of PRODUCT_MEDIA_PRIORITY) {
    const matchingMedia = media.find(
      (item) => item.media_type === mediaType
    );

    if (matchingMedia?.media_url) {
      return matchingMedia.media_url;
    }
  }

  return media[0]?.media_url || null;
};

const calculateScore = ({
  query,
  label,
  slug,
  type,
}) => {
  const normalizedQuery = query.toLowerCase();
  const normalizedLabel = String(label || "").toLowerCase();
  const normalizedSlug = String(slug || "")
    .toLowerCase()
    .replace(/-/g, " ");

  let score = 0;

  if (normalizedLabel === normalizedQuery) {
    score += 200;
  }

  if (normalizedLabel.startsWith(normalizedQuery)) {
    score += 140;
  }

  if (normalizedLabel.includes(normalizedQuery)) {
    score += 100;
  }

  if (normalizedSlug === normalizedQuery) {
    score += 90;
  }

  if (normalizedSlug.startsWith(normalizedQuery)) {
    score += 70;
  }

  if (normalizedSlug.includes(normalizedQuery)) {
    score += 50;
  }

  if (type === "Product") {
    score += 20;
  }

  return score;
};

const searchProducts = async (query, limit) => {
  const products = await prisma.stone_products.findMany({
    where: {
      is_active: true,
      is_published: true,

      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          small_description: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          long_description: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          pattern: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          stone_group: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          origin_country: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          pantone_colour: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          color_range: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          movement_index: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          variation_level: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          stone_categories: {
            is: {
              OR: [
                {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  slug: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
        },
      ],
    },

    select: {
      id: true,
      product_id: true,
      name: true,
      slug: true,
      small_description: true,
      pattern: true,
      stone_group: true,
      origin_country: true,
      pantone_colour: true,
      color_range: true,
      movement_index: true,
      variation_level: true,
      is_featured: true,
      is_trending: true,
      is_new_arrival: true,

      stone_categories: {
        select: {
          id: true,
          name: true,
          slug: true,
          parent_id: true,
        },
      },

      media: {
        where: {
          media_type: {
            in: PRODUCT_MEDIA_PRIORITY,
          },
        },
        select: {
          id: true,
          media_type: true,
          media_url: true,
          alt_text: true,
          display_order: true,
        },
        orderBy: [
          {
            display_order: "asc",
          },
          {
            id: "asc",
          },
        ],
        take: 10,
      },
    },

    take: limit,

    orderBy: [
      {
        is_featured: "desc",
      },
      {
        is_trending: "desc",
      },
      {
        is_new_arrival: "desc",
      },
      {
        name: "asc",
      },
    ],
  });

  return products.map((product) => {
    const category = product.stone_categories;

    return {
      id: `product-${product.id.toString()}`,
      resource_id: product.id.toString(),
      resource_uuid: product.product_id,
      label: product.name,
      type: "Product",
      slug: product.slug,

      path: category?.slug
        ? `/product/${category.slug}/${product.slug}`
        : `/product/${product.slug}`,

      image: getPreferredProductImage(product.media),

      description: product.small_description,
      category_name: category?.name || null,
      category_slug: category?.slug || null,

      metadata: {
        pattern: product.pattern,
        stone_group: product.stone_group,
        origin_country: product.origin_country,
        pantone_colour: product.pantone_colour,
        color_range: product.color_range,
        movement_index: product.movement_index,
        variation_level: product.variation_level,
        is_featured: product.is_featured,
        is_trending: product.is_trending,
        is_new_arrival: product.is_new_arrival,
      },

      score: calculateScore({
        query,
        label: product.name,
        slug: product.slug,
        type: "Product",
      }),
    };
  });
};

const searchCategories = async (query, limit) => {
  const categories = await prisma.stone_categories.findMany({
    where: {
      is_active: true,

      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          meta_keywords: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          seo_title: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },

    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      parent_id: true,
      thumbnail_url: true,
      display_order: true,

      stone_categories: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },

    take: limit,

    orderBy: [
      {
        display_order: "asc",
      },
      {
        name: "asc",
      },
    ],
  });

  return categories.map((category) => {
    const isParentCategory = category.parent_id === null;

    return {
      id: `category-${category.id}`,
      resource_id: String(category.id),
      label: category.name,
      type: isParentCategory ? "Material" : "Collection",
      slug: category.slug,
      path: `/product-category/${category.slug}`,
      image: category.thumbnail_url,
      description: category.description,

      parent: category.stone_categories
        ? {
            id: category.stone_categories.id,
            name: category.stone_categories.name,
            slug: category.stone_categories.slug,
          }
        : null,

      score: calculateScore({
        query,
        label: category.name,
        slug: category.slug,
        type: isParentCategory ? "Material" : "Collection",
      }),
    };
  });
};

const searchPages = async (query, limit) => {
  const pages = await prisma.pages.findMany({
    where: {
      status: "published",

      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          page_seo: {
            is: {
              OR: [
                {
                  meta_title: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  meta_description: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  seo_content: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
        },
      ],
    },

    select: {
      id: true,
      title: true,
      slug: true,

      page_seo: {
        select: {
          meta_description: true,
          og_image_url: true,
        },
      },
    },

    take: limit,

    orderBy: {
      title: "asc",
    },
  });

  return pages.map((page) => ({
    id: `page-${page.id}`,
    resource_id: String(page.id),
    label: page.title,
    type: "Page",
    slug: page.slug,
    path: `/${page.slug}`,
    image: page.page_seo?.og_image_url || null,
    description: page.page_seo?.meta_description || null,

    score: calculateScore({
      query,
      label: page.title,
      slug: page.slug,
      type: "Page",
    }),
  }));
};

const searchShowrooms = async (query, limit) => {
  const showrooms = await prisma.showrooms.findMany({
    where: {
      is_active: true,

      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          city: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          state: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          country: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          short_description: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },

    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      state: true,
      address: true,
      short_description: true,
      image_url: true,
      banner_image_url: true,
      display_order: true,
    },

    take: limit,

    orderBy: [
      {
        display_order: "asc",
      },
      {
        name: "asc",
      },
    ],
  });

  return showrooms.map((showroom) => ({
    id: `showroom-${showroom.id}`,
    resource_id: String(showroom.id),
    label: showroom.name,
    type: "Location",
    slug: showroom.slug,
    path: `/locations/${showroom.slug}`,
    image: showroom.image_url || showroom.banner_image_url || null,
    description:
      showroom.short_description ||
      [showroom.address, showroom.city, showroom.state]
        .filter(Boolean)
        .join(", "),

    metadata: {
      city: showroom.city,
      state: showroom.state,
      address: showroom.address,
    },

    score: calculateScore({
      query,
      label: showroom.name,
      slug: showroom.slug,
      type: "Location",
    }),
  }));
};

 const globalSearch = async ({
  query,
  limit = DEFAULT_LIMIT,
  types = [],
}) => {
  const normalizedQuery = normalizeQuery(query);
  const normalizedLimit = normalizeLimit(limit);

  if (normalizedQuery.length < 2) {
    return {
      query: normalizedQuery,
      total: 0,
      results: [],
    };
  }

  const requestedTypes = Array.isArray(types)
    ? types.map((type) => String(type).toLowerCase())
    : [];

  const shouldSearchType = (type) =>
    requestedTypes.length === 0 ||
    requestedTypes.includes(type.toLowerCase());

  const searchTasks = [];

  if (shouldSearchType("product")) {
    searchTasks.push(searchProducts(normalizedQuery, normalizedLimit));
  }

  if (
    shouldSearchType("material") ||
    shouldSearchType("collection") ||
    shouldSearchType("category")
  ) {
    searchTasks.push(searchCategories(normalizedQuery, normalizedLimit));
  }

  if (shouldSearchType("page")) {
    searchTasks.push(searchPages(normalizedQuery, normalizedLimit));
  }

  if (
    shouldSearchType("location") ||
    shouldSearchType("showroom")
  ) {
    searchTasks.push(searchShowrooms(normalizedQuery, normalizedLimit));
  }

  const resultGroups = await Promise.all(searchTasks);

  const combinedResults = resultGroups.flat();

  const uniqueResults = Array.from(
    new Map(
      combinedResults.map((item) => [
        `${item.type}-${item.path}`,
        item,
      ])
    ).values()
  );

  const results = uniqueResults
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.label.localeCompare(b.label);
    })
    .slice(0, normalizedLimit);

  return {
    query: normalizedQuery,
    total: results.length,
    results,
  };
};

module.exports = {
  globalSearch,
};