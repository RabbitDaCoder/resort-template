require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const handler = require("./api/send");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(morgan("dev"));
app.use(express.json({ limit: "5mb" }));

app.post("/api/send", (req, res) => handler(req, res));

app.use((_req, res) => {
  res.status(404).json({ error: "Not found. POST to /api/send" });
});

app.listen(PORT, () => {
  console.log(`Email service running at http://localhost:${PORT}`);
  console.log(`POST http://localhost:${PORT}/api/send`);
});
