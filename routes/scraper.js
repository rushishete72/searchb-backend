const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const apiKey = process.env.SERP_API_KEY;
        const query = req.query.q || "test";

        if (!apiKey) {
            return res.status(500).json({ error: "SERP_API_KEY missing in .env" });
        }

        const url = `https://serpapi.com/search.json?engine=google&q=${query}&api_key=${apiKey}`;

        const response = await axios.get(url);

        return res.json({
            success: true,
            results: response.data.organic_results || []
        });

    } catch (err) {
        console.error("SCRAPER ERROR:", err?.response?.data || err.message);
        return res.status(500).json({
            error: "Scraper failed",
            details: err?.response?.data || err.message
        });
    }
});

module.exports = router;
