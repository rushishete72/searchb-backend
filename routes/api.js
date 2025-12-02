const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const scraperRoutes = require("./scraper");
const leadsRoutes = require("./leads");
const userRoutes = require("./users");

router.get("/", (req, res) => {
    res.json({ status: "API Working", time: new Date().toISOString() });
});

router.use("/auth", authRoutes);
router.use("/scrape", scraperRoutes); // <-- now /api/scrape works
router.use("/leads", leadsRoutes);
router.use("/users", userRoutes);

module.exports = router;
