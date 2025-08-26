
const Log = require("../../models/Log");

const logAction = async (userId, action, description) => {
  const log = new Log({ user: userId, action, description });
  await log.save();
};

module.exports = logAction;
