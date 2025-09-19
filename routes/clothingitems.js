const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  createItem,
  deleteItem,
  getItems,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingitems");

const {
  validateId,
  validateItemCardBody,
} = require("../middlewares/validation");

router.get("/", getItems);
router.delete("/:itemId", auth, validateId, deleteItem);
router.post("/", auth, validateItemCardBody, createItem);
router.put("/:itemId/likes", auth, validateId, likeItem);
router.delete("/:itemId/likes", auth, validateId, unlikeItem);

module.exports = router;
