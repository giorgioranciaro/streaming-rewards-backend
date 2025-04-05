import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.js";
import artistRoutes from "./routes/artist.js";

dotenv.config();

const app = express(); // ✅ deve venire prima!
const prisma = new PrismaClient();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: "https://streaming-rewards-frontend-clean.vercel.app", // meglio specifico
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json());

// Rotte
app.options("*", cors()); // preflightß
app.use("/api/auth", authRoutes);
app.use("/api/artist", artistRoutes);

// Rotta root
app.get("/", (req, res) => {
  res.send("🎧 Backend ONLINE ✅");
});

// Avvio server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
