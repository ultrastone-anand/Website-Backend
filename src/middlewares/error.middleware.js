
const errorHandler = (err, req, res, next) => {
    // Keep detailed errors in backend logs
    console.error("[API ERROR]", {
        method: req.method,
        path: req.originalUrl,
        error: err,
    });

    if (res.headersSent) {
        return next(err);
    }

    // Invalid JSON
    if (
        err instanceof SyntaxError &&
        err.status === 400 &&
        "body" in err
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON request body",
        });
    }

    // Request body too large
    if (err.status === 413) {
        return res.status(413).json({
            success: false,
            message: "Request body too large",
        });
    }

    // Prisma: Record not found
    if (err.code === "P2025") {
        return res.status(404).json({
            success: false,
            message: "Record not found",
        });
    }

    // Prisma: Duplicate record
    if (err.code === "P2002") {
        return res.status(409).json({
            success: false,
            message: "A record with this value already exists",
        });
    }

    // Prisma: Foreign key error
    if (err.code === "P2003") {
        return res.status(400).json({
            success: false,
            message: "Invalid related record",
        });
    }

    const knownErrors = {
        "Showroom not found": 404,
        "Social media record not found": 404,
        "Slug already exists": 409,
        "Platform already exists": 409,
    };

    if (
        typeof err.message === "string" &&
        Object.prototype.hasOwnProperty.call(
            knownErrors,
            err.message
        )
    ) {
        return res.status(knownErrors[err.message]).json({
            success: false,
            message: String(err.message),
        });
    }

    // Unexpected errors
    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
};

module.exports = errorHandler;
