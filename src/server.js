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
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);


app.use((req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.MAILER_API_KEY) {
        return res.status(401).json({ error: "Unauthorized: Invalid API Key" });
    }
    next();
});

app.use("/api", mailRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

app.listen(PORT, () => {
    console.log(`📨 Mailer Service running on port ${PORT}`);
});
