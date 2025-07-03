const router = require("express").Router();
const {
  CreateItem,
  DeleteItem,
  GetItems,
  LikeItem,
  UnlikeItem,
} = require("../controllers/clothingitems");

router.get("/", GetItems);
router.delete("/:itemId", DeleteItem);
router.post("/", CreateItem);
router.put("/:itemId/likes", LikeItem);
router.delete("/:itemId/likes", UnlikeItem);

module.exports = router;
