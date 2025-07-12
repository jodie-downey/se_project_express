const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../utils/config");
const { UNAUTHORIZED_STATUS_CODE } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res
      .status(UNAUTHORIZED_STATUS_CODE)
      .send({ message: "Authorization Required" });
  }
  const token = authorization.replace("Bearer", " ");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(UNAUTHORIZED_STATUS_CODE)
      .send({ message: "Authorization Required" });
  }

  req.user = payload;

  next();
};
