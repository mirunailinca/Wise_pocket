const express = require("express");
const db = require("./models").db;
const allRoutes = require("./routes");
const authRoutes = require("./routes/auth");
const recompensaRoutes = require("./routes/recompensa"); 
const cors = require("cors");

const app = express();
const port = 4848;

require('dotenv').config();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/recompensa", recompensaRoutes); 
app.use("/", allRoutes);

app.get("/", (req, res) => {
    res.status(200).send("SERVER OK");
});

app.get("/reset", async (req, res) => {
    try {
        await db.query("SET FOREIGN_KEY_CHECKS = 0");
        await db.sync({ force: true });
        await db.query("SET FOREIGN_KEY_CHECKS = 1");
        res.status(200).send("Db reset complete!");
    } catch (err) {
        res.status(500).send({ message: "Db reset failed", err: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
    console.log(`http://localhost:${port}`);
});
