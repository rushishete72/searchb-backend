const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

// Load API router
const apiRoutes = require("./routes/api");

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
    res.send("Server Running...");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
