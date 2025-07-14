const Item = require("../models/clothingitem");
const {
  SUCCESSFUL_REQUEST_CODE,
  BAD_REQUEST_STATUS_CODE,
  REQUEST_NOT_FOUND_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  FORBIDDEN_STATUS_CODE,
} = require("../utils/errors");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(SUCCESSFUL_REQUEST_CODE).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const { owner } = req.user._id;

  Item.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      !item.owner.equals(req.user._id);
      res.status(FORBIDDEN_STATUS_CODE).send({ message: "Not Authorized" });
    })
    .then((item) => res.status(SUCCESSFUL_REQUEST_CODE).send({ data: item }))
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

const createItem = (req, res) => {
  const { name, imageUrl, weather } = req.body;

  Item.create({ name, imageUrl, weather, owner: req.user })
    .then((item) => {
      res.send({ data: item });
    })
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

const likeItem = (req, res) =>
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(SUCCESSFUL_REQUEST_CODE).send({ data: item }))
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

const unlikeItem = (req, res) =>
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(SUCCESSFUL_REQUEST_CODE).send({ data: item }))
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

module.exports = { createItem, deleteItem, getItems, likeItem, unlikeItem };
