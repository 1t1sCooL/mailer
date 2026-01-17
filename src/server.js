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
    // Собираем отладочную информацию
    const debugInfo = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        headers: { ...req.headers }, // копируем, чтобы избежать мутаций
        receivedApiKey: req.headers['x-api-key'],
        expectedApiKey: process.env.MAILER_API_KEY,
    };

    // Логируем в консоль (если есть доступ)
    console.log("🔍 Debug info:", JSON.stringify(debugInfo, null, 2));

    // Проверяем API-ключ
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.MAILER_API_KEY) {
        // Возвращаем отладочные данные в теле ответа (ТОЛЬКО ДЛЯ ОТЛАДКИ!)
        return res.status(401).json({
            error: "Unauthorized: Invalid API Key",
            debug: {
                receivedApiKey: apiKey,
                expectedApiKeyExists: !!process.env.MAILER_API_KEY,
                headerKeys: Object.keys(req.headers),
            },
        });
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
