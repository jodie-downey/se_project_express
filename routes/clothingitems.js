const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  createItem,
  deleteItem,
  getItems,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingitems");

router.get("/", getItems);
router.delete("/:itemId", auth, deleteItem);
router.post("/", auth, createItem);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, unlikeItem);

module.exports = router;
