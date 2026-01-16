const express = require("express");
const cors = require("cors");
const mailRoutes = require("./routes/mailRoutes");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use("/api", mailRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

app.listen(PORT, () => {
    console.log(`📨 Mailer Service running on port ${PORT}`);
});
