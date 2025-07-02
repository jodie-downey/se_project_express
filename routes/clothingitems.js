const router = require("express").Router();
const { CreateItem } = require("../controllers/clothingitems");

router.get("/", (req, res) => console.log("GET clothing items"));
router.delete("/:itemId", (req, res) => console.log("delete items by Id"));
router.post("/", CreateItem);

module.exports = router;
