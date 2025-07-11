const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");
const {
  SUCCESSFUL_REQUEST_CODE,
  SUCCESSFULL_POST_CODE,
  BAD_REQUEST_STATUS_CODE,
  REQUEST_NOT_FOUND_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  UNAUTHORIZED_STATUS_CODE,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(SUCCESSFUL_REQUEST_CODE).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.create({ name, avatar, email, password })
    .then((user) => res.status(SUCCESSFULL_POST_CODE).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "An error has occurred on the server" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(SUCCESSFUL_REQUEST_CODE).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(REQUEST_NOT_FOUND_CODE)
          .send({ message: "An error has occurred on the server" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "An error has occurred on the server" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect password or email"));
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      if (!matched) {
        return Promise.reject(new Error("Incorrect password or email"));
      }
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(UNAUTHORIZED_STATUS_CODE)
        .send({ message: "An error has occured on the server" });
    });
};

module.exports = { getUsers, createUser, getUser };
