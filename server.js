import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.js";
import artistRoutes from "./routes/artist.js";
import cors from "cors";

dotenv.config();

const allowedOrigins = [
  "https://streaming-rewards-frontend-clean.vercel.app",
  "https://hoppscotch.io",
];

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// Middleware CORS dinamico
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Body parser
app.use(express.json());

// Rotte
app.use("/api/auth", authRoutes);
app.use("/api/artist", artistRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🎷 Backend ONLINE ✅");
});

// Avvio server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
