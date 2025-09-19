const Item = require("../models/clothingItem");
const { SUCCESSFUL_REQUEST_CODE } = require("../utils/errors");

const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");

const getItems = (req, res, next) => {
  Item.find({})
    .populate("owner")
    .then((items) => res.status(SUCCESSFUL_REQUEST_CODE).send(items))
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
        return res.status(SUCCESSFUL_REQUEST_CODE).send(deletedItem);
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
    .orFail()
    .then((item) => res.status(SUCCESSFUL_REQUEST_CODE).send(item))
    .catch(next);

const unlikeItem = (req, res, next) =>
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(SUCCESSFUL_REQUEST_CODE).send(item))
    .catch(next);

module.exports = { createItem, deleteItem, getItems, likeItem, unlikeItem };
