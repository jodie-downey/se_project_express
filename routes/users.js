const router = require("express").Router();
const auth = require("../middlewares/auth");

const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

const { validateUpdateUserBody } = require("../middlewares/validation");

router.get("/me", getCurrentUser);
router.patch("/me", auth, validateUpdateUserBody, updateCurrentUser);

module.exports = router;
