const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/users");
const { JWT_SECRET } = require("../utils/config");
const {
  SUCCESSFUL_REQUEST_CODE,
  SUCCESSFULL_POST_CODE,
} = require("../utils/errors");

const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(SUCCESSFUL_REQUEST_CODE).send(users))
    .catch(next);
};

const createUser = (req, res, next) => {
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
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => {
      const userObjectWithoutPassword = user.toObject();
      delete userObjectWithoutPassword.password;
      res.status(SUCCESSFUL_REQUEST_CODE).send(userObjectWithoutPassword);
    })
    .catch(next);
};

const updateCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { runValidators: true, new: true }
  )
    .orFail()
    .then((user) => {
      const userObjectWithoutPassword = user.toObject();
      delete userObjectWithoutPassword.password;
      res.status(SUCCESSFUL_REQUEST_CODE).send(userObjectWithoutPassword);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Incorrect email or password");
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError("Incorrect email or password");
      }
      if (!user._id || !JWT_SECRET) {
        throw new UnauthorizedError("Incorrect email or password");
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(SUCCESSFUL_REQUEST_CODE).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  login,
  updateCurrentUser,
};
