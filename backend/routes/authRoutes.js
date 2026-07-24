const express = require("express");
const { register, login, me } = require("../controllers/authController");
const { authGuard } = require("../middleware/authGuard");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authGuard, me);

module.exports = router;
