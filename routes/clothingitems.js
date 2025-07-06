const router = require("express").Router();
const {
  createItem,
  deleteItem,
  getItems,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingitems");

router.get("/", getItems);
router.delete("/:itemId", deleteItem);
router.post("/", createItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", unlikeItem);

module.exports = router;
