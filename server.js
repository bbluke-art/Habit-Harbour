// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Fix for ES module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve all static files (HTML, CSS, JS, etc.)
app.use(express.static(__dirname));

// Optional: an API endpoint example
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the HabitHarbor backend 👋" });
});

// Fallback: always serve index.html for unknown routes (for SPAs)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
