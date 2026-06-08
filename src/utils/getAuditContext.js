// utils/getAuditContext.js

module.exports = (req) => ({

  userId:
    req.user?.id || null,

  userName:
    req.user
      ? `${req.user.first_name} ${req.user.last_name}`
      : null,

  ipAddress:
    req.ip,

  userAgent:
    req.headers["user-agent"]

});