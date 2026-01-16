const express = require("express");
const cors = require("cors");
const mailRoutes = require("./routes/mailRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api", mailRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

app.listen(PORT, () => {
    console.log(`📨 Mailer Service running on port ${PORT}`);
});
