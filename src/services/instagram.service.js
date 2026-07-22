// services/instagram.service.js

const prisma = require("../config/prisma");

const PROVIDER = "instagram";
const POST_LIMIT = 4;
const REFRESH_BEFORE_DAYS = 10;

const INSTAGRAM_MEDIA_URL =
  "https://graph.instagram.com/me/media";

const INSTAGRAM_REFRESH_URL =
  "https://graph.instagram.com/refresh_access_token";

/**
 * Return the active Instagram credential.
 */
const getInstagramCredential = async () => {
  const credential =
    await prisma.integration_credentials.findUnique({
      where: {
        provider: PROVIDER,
      },
    });

  if (!credential) {
    throw new Error(
      "Instagram integration is not configured"
    );
  }

  if (credential.is_active === false) {
    throw new Error(
      "Instagram integration is disabled"
    );
  }

  if (!credential.access_token) {
    throw new Error(
      "Instagram access token is missing"
    );
  }

  return credential;
};

/**
 * Check whether token is expired.
 */
const isTokenExpired = (tokenExpiresAt) => {
  if (!tokenExpiresAt) {
    return false;
  }

  return (
    new Date(tokenExpiresAt).getTime() <= Date.now()
  );
};

/**
 * Refresh token when 10 days or less remain.
 */
const shouldRefreshToken = (tokenExpiresAt) => {
  if (!tokenExpiresAt) {
    return false;
  }

  const refreshThreshold = new Date();

  refreshThreshold.setDate(
    refreshThreshold.getDate() +
      REFRESH_BEFORE_DAYS
  );

  return (
    new Date(tokenExpiresAt).getTime() <=
    refreshThreshold.getTime()
  );
};

/**
 * Refresh and save the Instagram access token.
 */
const refreshInstagramToken = async () => {
  const credential =
    await getInstagramCredential();

  const attemptTime = new Date();

  if (
    isTokenExpired(
      credential.token_expires_at
    )
  ) {
    await prisma.integration_credentials.update({
      where: {
        provider: PROVIDER,
      },
      data: {
        last_refresh_attempt_at: attemptTime,
        refresh_status: "expired",
        refresh_error:
          "Instagram token has expired and must be generated again.",
      },
    });

    throw new Error(
      "Instagram access token has expired and cannot be refreshed"
    );
  }

  await prisma.integration_credentials.update({
    where: {
      provider: PROVIDER,
    },
    data: {
      last_refresh_attempt_at: attemptTime,
      refresh_status: "refreshing",
      refresh_error: null,
    },
  });

  try {
    const url = new URL(
      INSTAGRAM_REFRESH_URL
    );

    url.searchParams.set(
      "grant_type",
      "ig_refresh_token"
    );

    url.searchParams.set(
      "access_token",
      credential.access_token
    );

    const response = await fetch(
      url.toString(),
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const result = await response.json();

    if (
      !response.ok ||
      !result.access_token
    ) {
      throw new Error(
        result?.error?.message ||
          "Instagram did not return a refreshed token"
      );
    }

    const expiresInSeconds = Number(
      result.expires_in
    );

    if (
      !Number.isFinite(expiresInSeconds) ||
      expiresInSeconds <= 0
    ) {
      throw new Error(
        "Instagram returned an invalid token expiry value"
      );
    }

    const refreshedAt = new Date();

    const tokenExpiresAt = new Date(
      refreshedAt.getTime() +
        expiresInSeconds * 1000
    );

    return await prisma.integration_credentials.update({
      where: {
        provider: PROVIDER,
      },
      data: {
        access_token: result.access_token,
        token_expires_at: tokenExpiresAt,
        last_refreshed_at: refreshedAt,
        last_refresh_attempt_at: attemptTime,
        refresh_status: "active",
        refresh_error: null,
      },
      select: {
        provider: true,
        account_name: true,
        account_id: true,
        token_expires_at: true,
        last_refreshed_at: true,
        last_refresh_attempt_at: true,
        refresh_status: true,
        is_active: true,
        updated_at: true,
      },
    });
  } catch (error) {
    await prisma.integration_credentials.update({
      where: {
        provider: PROVIDER,
      },
      data: {
        last_refresh_attempt_at:
          attemptTime,
        refresh_status: "failed",
        refresh_error: error.message,
      },
    });

    throw error;
  }
};

/**
 * Refresh only when required.
 */
const refreshTokenIfNeeded = async () => {
  const credential =
    await getInstagramCredential();

  if (
    isTokenExpired(
      credential.token_expires_at
    )
  ) {
    throw new Error(
      "Instagram access token has expired. Generate a new token."
    );
  }

  if (
    !shouldRefreshToken(
      credential.token_expires_at
    )
  ) {
    return {
      refreshed: false,
      tokenExpiresAt:
        credential.token_expires_at,
    };
  }

  const refreshedCredential =
    await refreshInstagramToken();

  return {
    refreshed: true,
    tokenExpiresAt:
      refreshedCredential.token_expires_at,
  };
};

/**
 * Clean Instagram response for frontend.
 */
const normalizeInstagramPost = (post) => {
  const isVideo =
    post.media_type === "VIDEO";

  return {
    id: post.id,
    caption: post.caption || "",
    mediaType: post.media_type,
    imageUrl: isVideo
      ? post.thumbnail_url || null
      : post.media_url || null,
    videoUrl: isVideo
      ? post.media_url || null
      : null,
    permalink: post.permalink,
    timestamp: post.timestamp,
  };
};

/**
 * Fetch latest four Instagram posts.
 */
const getLatestInstagramPosts = async () => {
  await refreshTokenIfNeeded();

  const credential =
    await getInstagramCredential();

  const fields = [
    "id",
    "caption",
    "media_type",
    "media_url",
    "thumbnail_url",
    "permalink",
    "timestamp",
  ].join(",");

  const url = new URL(
    INSTAGRAM_MEDIA_URL
  );

  url.searchParams.set(
    "fields",
    fields
  );

  url.searchParams.set(
    "limit",
    String(POST_LIMIT)
  );

  url.searchParams.set(
    "access_token",
    credential.access_token
  );

  const response = await fetch(
    url.toString(),
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        "Unable to retrieve Instagram posts"
    );
  }

  return (result.data || [])
    .slice(0, POST_LIMIT)
    .map(normalizeInstagramPost);
};

/**
 * Return safe CMS status.
 */
const getInstagramStatus = async () => {
  const credential =
    await prisma.integration_credentials.findUnique({
      where: {
        provider: PROVIDER,
      },
      select: {
        provider: true,
        account_name: true,
        account_id: true,
        token_expires_at: true,
        last_refreshed_at: true,
        last_refresh_attempt_at: true,
        refresh_status: true,
        refresh_error: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

  if (!credential) {
    return {
      connected: false,
      isActive: false,
      tokenExpired: false,
      refreshRequired: false,
    };
  }

  return {
    connected: true,
    accountName:
      credential.account_name,
    accountId:
      credential.account_id,
    tokenExpiresAt:
      credential.token_expires_at,
    lastRefreshedAt:
      credential.last_refreshed_at,
    lastRefreshAttemptAt:
      credential.last_refresh_attempt_at,
    refreshStatus:
      credential.refresh_status,
    refreshError:
      credential.refresh_error,
    isActive:
      credential.is_active,
    createdAt:
      credential.created_at,
    updatedAt:
      credential.updated_at,
    tokenExpired: isTokenExpired(
      credential.token_expires_at
    ),
    refreshRequired: shouldRefreshToken(
      credential.token_expires_at
    ),
  };
};

/**
 * Test stored Instagram connection.
 */
const testInstagramConnection = async () => {
  const posts =
    await getLatestInstagramPosts();

  const credential =
    await getInstagramCredential();

  return {
    connected: true,
    accountName:
      credential.account_name,
    accountId:
      credential.account_id,
    postsAvailable: posts.length,
  };
};

module.exports = {
  getLatestInstagramPosts,
  getInstagramStatus,
  refreshInstagramToken,
  refreshTokenIfNeeded,
  testInstagramConnection,
};