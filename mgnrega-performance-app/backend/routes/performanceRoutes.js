const express = require("express");
const router = express.Router();
const { getPerformanceData } = require("../controllers/performanceController");

router.get("/fetch", getPerformanceData);
module.exports = router;
