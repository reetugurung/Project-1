const Log = require("../models/Log");
const User = require("../models/User");

const getAnalytics = async (req, res) => {
  try {
    // Total number of logs
    const totalLogs = await Log.countDocuments();

    // Logs grouped by action
    const actions = await Log.aggregate([
      { $group: { _id: "$action", count: { $sum: 1 } } }
    ]);

    // Most active users (top 5)
    const activeUsers = await Log.aggregate([
      { $group: { _id: "$user", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      {
        $unwind: "$userInfo"
      },
      {
        $project: {
          _id: 0,
          userId: "$userInfo._id",
          name: "$userInfo.name",
          email: "$userInfo.email",
          count: 1
        }
      }
    ]);

    res.json({
      totalLogs,
      actions,
      activeUsers
    });
  } catch (error) {
    res.status(500).json({
      message: "Error generating analytics",
      error: error.message
    });
  }
};

module.exports = { getAnalytics };
