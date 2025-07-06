const router = require("express").Router();
const errors = require("../utils/errors");

const userRouter = require("./users");
const itemRouter = require("./clothingitems");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res
    .status(errors.REQUEST_NOT_FOUND_CODE)
    .send({ message: "Router not found" });
});

module.exports = router;
