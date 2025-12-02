// routes/users.js
const router = require("express").Router();
const { db } = require("../database/db");
const auth = require("../middleware/auth");

// GET logged-in user profile
router.get("/me", auth, async (req, res) => {
    try {
        const user = await db.one("SELECT id, email, role FROM users WHERE id=$1", [
            req.user.id,
        ]);

        res.json({ user });
    } catch (err) {
        console.error("USER ERROR:", err.message);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

module.exports = router;
