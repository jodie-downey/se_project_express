const Item = require("../models/clothingItem");
const { SUCCESSFUL_REQUEST_CODE } = require("../utils/errors");

const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const UnauthorizedError = require("../errors/UnauthorizedError");

const getItems = (req, res, next) => {
  Item.find({})
    .populate("owner")
    .then((items) => res.send(items))
    .catch(next);
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const owner = req.user._id;

  Item.findById(itemId)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("No item with matching ID found");
      }
      if (item.owner.toString() !== owner.toString()) {
        throw new ForbiddenError("You are not authorized to delete this item");
      }
      return Item.findByIdAndDelete(itemId).then((deletedItem) => {
        return res.send(deletedItem);
      });
    })
    .catch(next);
};

const createItem = (req, res, next) => {
  const { name, imageUrl, weather } = req.body;

  Item.create({ name, imageUrl, weather, owner: req.user._id })
    .then((item) => {
      res.send(item);
    })
    .catch(next);
};

const likeItem = (req, res, next) =>
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("No item with matching ID found");
      }
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("The id string is in an invalid format");
      } else {
        next(err);
      }
    });

const unlikeItem = (req, res, next) =>
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("No item with matching ID found");
      }
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("The id string is in an invalid format");
      } else {
        next(err);
      }
    });

module.exports = { createItem, deleteItem, getItems, likeItem, unlikeItem };
