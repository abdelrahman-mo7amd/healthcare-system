const express = require("express");
const { listStaff, getStaff } = require("../controllers/staffController");
const { authGuard } = require("../middleware/authGuard");

const router = express.Router();

router.get("/", authGuard, listStaff);
router.get("/:id", authGuard, getStaff);

module.exports = router;
