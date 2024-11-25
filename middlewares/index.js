const cors = require("./cors");
const rateLimit = require("./rateLimit");
const helmet = require("helmet");

module.exports = {
  cors,
  helmet,
  rateLimit,
};
