const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED_STATUS_CODE } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log("Auth middleware hit");

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res
      .status(UNAUTHORIZED_STATUS_CODE)
      .send({ message: "Authorization Required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  console.log(token);

  try {
    payload = jwt.verify(token, JWT_SECRET);
    console.log("JWT verified successfully:", payload);
  } catch (err) {
    console.log("JWT verification error:", err);
    return res
      .status(UNAUTHORIZED_STATUS_CODE)
      .send({ message: "Authorization Required" });
  }

  req.user = payload;

  return next();
};
