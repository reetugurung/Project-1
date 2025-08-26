const Visitor = require("../models/Visitor");

const logVisitor = async (req, res, next) => {
  try {
    await Visitor.create({
      ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      referrer: req.headers['referer'] || req.headers['referrer'] || 'Direct',
    });
  } catch (err) {
    console.error("Failed to log visitor:", err.message);
  }
  next();
};

module.exports = logVisitor;
