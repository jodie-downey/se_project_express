const router = require("express").Router();
const {
  CreateItem,
  DeleteItem,
  GetItems,
} = require("../controllers/clothingitems");

router.get("/", GetItems);
router.delete("/:itemId", DeleteItem);
router.post("/", CreateItem);

module.exports = router;
