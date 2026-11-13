const GlobalSearchService = require("../services/globalsearch.service");
const parseTypes = (types) => {
  if (!types) {
    return [];
  }

  if (Array.isArray(types)) {
    return types
      .map((type) => String(type).trim())
      .filter(Boolean);
  }

  return String(types)
    .split(",")
    .map((type) => type.trim())
    .filter(Boolean);
};

 const searchWebsite = async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();
    const limit = req.query.limit;
    const types = parseTypes(req.query.types);

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
        data: {
          query: "",
          total: 0,
          results: [],
        },
      });
    }

    if (query.length < 2) {
      return res.status(200).json({
        success: true,
        message: "Enter at least 2 characters to search.",
        data: {
          query,
          total: 0,
          results: [],
        },
      });
    }

    const searchResult = await GlobalSearchService.globalSearch({
      query,
      limit,
      types,
    });

    return res.status(200).json({
      success: true,
      message:
        searchResult.total > 0
          ? "Search results retrieved successfully."
          : "No matching results found.",
      data: searchResult,
    });
  } catch (error) {
    console.error("Global search controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to perform global search.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

module.exports = {
  searchWebsite,
};