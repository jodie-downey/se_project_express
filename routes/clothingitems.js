const router = require("express").Router();

router.get("/", (req, res) => console.log("GET clothing items"));
router.delete("/:itemId", (req, res) => console.log("delete items by Id"));
router.post("/", (req, res) => console.log("Post item"));

module.exports = router;
