const router = require("express").Router();
const auth = require("../middlewares/auth");

const NotFoundError = require("../errors/NotFoundError");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");

router.use("/users", auth, userRouter);
router.use("/items", itemRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Router Not Found"));
});

module.exports = router;
