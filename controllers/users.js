const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/users");
const { JWT_SECRET } = require("../utils/config");
const {
  SUCCESSFUL_REQUEST_CODE,
  SUCCESSFULL_POST_CODE,
  BAD_REQUEST_STATUS_CODE,
  REQUEST_NOT_FOUND_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  UNAUTHORIZED_STATUS_CODE,
  CONFLICT_ERROR,
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

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name,
        avatar,
      })
    )
    .then((user) => {
      const userObjectWithoutPassword = user.toObject();
      delete userObjectWithoutPassword.password;
      res.status(SUCCESSFULL_POST_CODE).send(userObjectWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "An error has occurred on the server" });
      }
      if (err.code === 11000)
        return res
          .status(CONFLICT_ERROR)
          .send({ message: "A conflict has occured" });
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => {
      const userObjectWithoutPassword = user.toObject();
      delete userObjectWithoutPassword.password;
      res.status(SUCCESSFUL_REQUEST_CODE).send(userObjectWithoutPassword);
    })
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

const updateCurrentUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { runValidators: true, new: true }
  )
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

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .send({ message: "Email and password are required" });
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return res
          .status(UNAUTHORIZED_STATUS_CODE)
          .send({ message: "Invalid email or password" });
      }
      if (!user._id || !JWT_SECRET) {
        return res
          .status(UNAUTHORIZED_STATUS_CODE)
          .send({ message: "Invalid email or password" });
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(SUCCESSFUL_REQUEST_CODE).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res
          .status(UNAUTHORIZED_STATUS_CODE)
          .json({ message: err.message });
      }
      console.error(err);
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Internal Service Error" });
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  login,
  updateCurrentUser,
};
