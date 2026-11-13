
const instagramService = require(
  "../services/instagram.service"
);

// ============================================================
// PUBLIC — GET INSTAGRAM POSTS
// GET /api/instagram/posts
// ============================================================

const getInstagramPosts = async (req, res) => {
  try {
    const posts =
      await instagramService.getLatestInstagramPosts();

    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error(
      "[Instagram] Get posts failed:",
      error
    );

    return res.status(502).json({
      success: false,
      message: "Unable to load Instagram posts",
      data: [],
    });
  }
};

// ============================================================
// CMS — GET INSTAGRAM STATUS
// GET /api/instagram/admin/status
// ============================================================

const getInstagramStatus = async (req, res) => {
  try {
    const status =
      await instagramService.getInstagramStatus();

    return res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error(
      "[Instagram] Get status failed:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve Instagram integration status",
    });
  }
};

// ============================================================
// CMS — REFRESH INSTAGRAM TOKEN
// POST /api/instagram/admin/refresh
// ============================================================

const refreshInstagramToken = async (req, res) => {
  try {
    const result =
      await instagramService.refreshInstagramToken();

    return res.status(200).json({
      success: true,
      message:
        "Instagram access token refreshed successfully",
      data: result,
    });
  } catch (error) {
    console.error(
      "[Instagram] Token refresh failed:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to refresh Instagram access token",
    });
  }
};

// ============================================================
// CMS — TEST INSTAGRAM CONNECTION
// POST /api/instagram/admin/test
// ============================================================

const testInstagramConnection = async (req, res) => {
  try {
    const result =
      await instagramService.testInstagramConnection();

    return res.status(200).json({
      success: true,
      message:
        "Instagram connection is working correctly",
      data: result,
    });
  } catch (error) {
    console.error(
      "[Instagram] Connection test failed:",
      error
    );

    return res.status(502).json({
      success: false,
      message: "Unable to test Instagram connection",
    });
  }
};

module.exports = {
  getInstagramPosts,
  getInstagramStatus,
  refreshInstagramToken,
  testInstagramConnection,
};
