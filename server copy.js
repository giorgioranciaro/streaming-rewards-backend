import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import artistRoutes from "./routes/artist.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  "https://streaming-rewards-frontend-clean.vercel.app",
  "https://hoppscotch.io",
];

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://streaming-rewards-frontend-clean.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Gestisce correttamente le richieste preflight
app.options("*", cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/artist", artistRoutes);

app.get("/", (req, res) => {
  res.send("🎧 Backend ONLINE ✅");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
