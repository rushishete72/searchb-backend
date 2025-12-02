// routes/auth.js
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../database/db");

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await db.oneOrNone(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err.message);
        res.status(500).json({ error: "Login failed" });
    }
});

module.exports = router;
