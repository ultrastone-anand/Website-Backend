const activityService = require("../services/activity.service");

const getActivities = async (req, res) => {
    const activities = await activityService.getActivities();
    res.json(activities);
};

module.exports = {
    getActivities,
};