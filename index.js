const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Backend Running Successfully!");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running...");
});
