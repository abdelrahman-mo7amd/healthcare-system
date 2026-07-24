const express = require("express");
const { getDashboardStats } = require("../controllers/dashboardController");
const { authGuard } = require("../middleware/authGuard");

const router = express.Router();

router.get("/stats", authGuard, getDashboardStats);

module.exports = router;
