const router = require("express").Router();
const errors = require("../utils/errors");
const auth = require("../middlewares/auth");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");

router.use("/users", auth, userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
});

module.exports = router;
